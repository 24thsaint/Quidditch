import http from 'http'
import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import consolidate from 'consolidate'
import bodyParser from 'body-parser'
import Team from '../dist/models/Team'
import Player from '../dist/models/Player'
import Snitch from '../dist/models/Snitch'
import Game from '../dist/models/Game'

const WebSocketServer = require('ws').Server

const server = http.createServer()
const app = express()
const socket = new WebSocketServer({ server })
app.engine('html', consolidate.swig)
app.set('view engine', 'html')
app.set('views', './src/views')
app.use(bodyParser.json())
mongoose.Promise = Promise
app.use(express.static('public'))

// =============== TOKENS

const tokens = ['123']

// =============== VIEWS

function sendBoxScoreSocketResponse(teams) {
  const teamsResponseData = []

  teams.forEach((team) => {
    const json = {
      team,
      score: team.score,
    }

    teamsResponseData.push(json)
  })

  const socketRes = { type: 'BOX-SCORE', teams: teamsResponseData }

  socket.clients.forEach((client) => {
    client.send(JSON.stringify(socketRes))
  })
}

app.get('/game/:gameId/play-by-play', (request, response) => {
  const id = request.params.gameId
  Game.findOne({ _id: id }).populate({
    path: 'playHistory.player',
    model: 'Player',
  }).exec()
  .then((game) => {
    response.render('playByPlay.html', { playHistory: game.playHistory })
  })
})

// ================ REST stuff

app.get('/games/list', (request, response) => {
  Game.find({}).populate('teams snitch').exec()
  .then((games) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(games, null, 2))
  })
})

app.get('/game/find/:gameId', (request, response) => {
  const id = request.params.gameId

  Game.findOne({ _id: id }).populate({
    path: 'teams',
    model: 'Team',
    populate: {
      path: 'players',
      model: 'Player',
    },
  }).populate({
    path: 'snitch',
    model: 'Snitch',
    populate: {
      path: 'caughtBy',
      model: 'Player',
    },
  }).exec()
  .then((game) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(game, null, 2))
  })
})

app.get('/game/:gameId/team/all', (request, response) => {
  const id = request.params.gameId

  Game.findOne({ _id: id }).populate({
    path: 'teams',
    model: 'Team',
    populate: {
      path: 'players',
      model: 'Player',
    },
  }).exec()
  .then((game) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    const res = []
    for (const team of game.teams) {
      const json = {
        team,
        score: team.score,
      }
      res.push(json)
    }
    response.end(JSON.stringify(res, null, 2))
  })
})

app.get('/team/find/:id', (request, response) => {
  const id = request.params.id
  response.writeHead(200, { 'Content-Type': 'application/json' })

  Team.findOne({ _id: id }).populate('players').exec()
  .then((team) => {
    const json = {
      team,
      score: team.score,
    }

    response.end(JSON.stringify(json, null, 2))
  })
  .catch(() => {
    response.end(JSON.stringify({ message: 'Resource not found' }, null, 2))
  })
})

app.post('/game/:gameId/chaser/goal/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (tokens.includes(token)) {
    response.writeHead(200, { 'Content-Type': 'application/json' })

    if (jsonRequest.chaser === undefined) {
      response.end(JSON.stringify({ status: 'FAIL', message: 'Player not found' }))
    }

    Player.findOne({ _id: jsonRequest.chaser }).populate('team').exec()
    .then((player) => {
      Game.findOne({ _id: gameId }).exec()
      .then((game) => {
        const jsonResponse = game.goalMade(player)
        jsonResponse.type = 'PLAY-BY-PLAY'
        game.save()
        player.save()

        socket.clients.forEach((client) => {
          client.send(JSON.stringify(jsonResponse))
        })

        return game
      })
      .then((game) => {
        Team.find({ _id: { $in: game.teams } }).populate('players').exec()
        .then((teams) => {
          sendBoxScoreSocketResponse(teams)
          const jsonResponse = {
            status: 'OK',
            player: `${player.firstName} ${player.lastName}`,
          }

          teams.forEach((team) => {
            if (player.team.name === team.name) {
              jsonResponse.team = team.name
              jsonResponse.score = team.score
              jsonResponse.teamId = team._id // eslint-disable-line
            }
          })

          response.end(JSON.stringify(jsonResponse))
        })
      })
      .catch((err) => {
        response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
      })
    })
    .catch((err) => {
      response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
    })
  } else {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  }
})

app.post('/game/:gameId/chaser/miss/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (tokens.includes(token)) {
    response.writeHead(200, { 'Content-Type': 'application/json' })

    if (jsonRequest.chaser === undefined) {
      response.end(JSON.stringify({ status: 'FAIL', message: 'Player not found' }))
    }

    Player.findOne({ _id: jsonRequest.chaser }).exec()
    .then((player) => {
      Game.findOne({ _id: gameId }).exec()
      .then((game) => {
        const socketResponse = game.goalMissed(player)
        socketResponse.type = 'PLAY-BY-PLAY'
        game.save()
        player.save()
        .then(() => {
          Team.find({ _id: { $in: game.teams } }).populate('players').exec()
          .then((teams) => {
            sendBoxScoreSocketResponse(teams)
          })
        })

        const jsonResponse = JSON.stringify({
          status: 'OK',
          player: `${player.firstName} ${player.lastName}`,
        })

        response.end(jsonResponse)
      })
      .catch((err) => {
        response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
      })
    })
    .catch((err) => {
      response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
    })
  } else {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  }
})

app.post('/game/:gameId/keeper/block/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (tokens.includes(token)) {
    response.writeHead(200, { 'Content-Type': 'application/json' })

    if (jsonRequest.keeper === undefined) {
      response.end(JSON.stringify({ status: 'FAIL', message: 'Player not found' }))
    }

    Player.findOne({ _id: jsonRequest.keeper }).exec()
    .then((player) => {
      Game.findOne({ _id: gameId }).exec()
      .then((game) => {
        const socketResponse = game.goalBlocked(player)
        socketResponse.type = 'PLAY-BY-PLAY'
        game.save()
        player.save()
        .then(() => {
          Team.find({ _id: { $in: game.teams } }).populate('players').exec()
          .then((teams) => {
            sendBoxScoreSocketResponse(teams)
          })
        })

        socket.clients.forEach((client) => {
          client.send(JSON.stringify(socketResponse))
        })

        const jsonResponse = JSON.stringify({
          status: 'OK',
          player: `${player.firstName} ${player.lastName}`,
        })

        response.end(jsonResponse)
      })
      .catch((err) => {
        response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
      })
    })
    .catch((err) => {
      response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
    })
  } else {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  }
})

app.post('/game/:gameId/seeker/catchSnitch/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (tokens.includes(token)) {
    if (jsonRequest.seeker === undefined) {
      response.end(JSON.stringify({ status: 'FAIL', message: 'Player not found' }))
    }

    Game.findOne({ _id: gameId }).populate('snitch').exec()
    .then((game) => {
      Player.findOne({ _id: jsonRequest.seeker }).exec()
      .then((seeker) => {
        const socketResponse = game.snitchCaught(seeker)
        socketResponse.type = 'PLAY-BY-PLAY'

        game.snitch.save()
        .then(() => {
          seeker.save()
        })
        .then(() => {
          game.save()
          .then(() => {
            Team.find({ _id: { $in: game.teams } }).populate('players').exec()
            .then((teams) => {
              sendBoxScoreSocketResponse(teams)
            })
          })

          socket.clients.forEach((client) => {
            client.send(JSON.stringify(socketResponse))
          })

          Team.findOne({ _id: seeker.team }).populate('players').exec() // eslint-disable-line
          .then((team) => {
            const jsonResponse = JSON.stringify({
              status: 'OK',
              player: `${seeker.firstName} ${seeker.lastName}`,
              endTime: game.endTime,
              score: team.score,
              teamId: team._id, // eslint-disable-line
            })

            response.end(jsonResponse)
          })
          .catch((err) => {
            response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
          })
        })
        .catch((err) => {
          response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
        })
      })
      .catch((err) => {
        response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
      })
    })
    .catch((err) => {
      response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
    })
  } else {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  }
})

app.post('/game/:gameId/snitch/appeared/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId

  if (tokens.includes(token)) {
    Game.findOne({ _id: gameId }).populate('snitch').exec()
    .then((game) => {
      const socketResponse = game.snitchAppeared()
      socketResponse.type = 'PLAY-BY-PLAY'
      game.snitch.save()
      .then(() => {
        game.save()

        socket.clients.forEach((client) => {
          client.send(JSON.stringify(socketResponse))
        })

        const jsonResponse = JSON.stringify({
          status: 'OK',
          appearanceDate: game.snitch.appearedOn,
        })

        response.end(jsonResponse)
      })
    })
    .catch((err) => {
      response.end(JSON.stringify({ status: 'FAIL', message: err.message }))
    })
  } else {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  }
})


app.post('/game/start/:token', (request, response) => {
  const token = request.params.token
  const jsonRequest = request.body

  if (tokens.includes(token)) {
    const snitch = new Snitch()
    snitch.save()
    .then(() => {
      const game = new Game({
        teams: jsonRequest.teams,
        snitch,
        playHistory: [],
      })
      game.start()
      game.save()
      .then(() => {
        response.redirect(`/game/${game._id}`) // eslint-disable-line
      })
      .catch((err) => {
        response.end(JSON.stringify({ status: 'FAIL', message: err }))
      })
    })
  } else {
    response.writeHead(401, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
  }
})

// ================ 3rd Party Libraries
app.get('/js/jquery.min.js', (request, response) => {
  fs.readFile('./node_modules/jquery/dist/jquery.min.js', (err, data) => {
    if (err) {
      response.send(err)
    } else {
      response.writeHead(200, { 'Content-Type': 'text/javascript' })
      response.end(data)
    }
  })
})

app.get('/js/bootstrap.min.js', (request, response) => {
  fs.readFile('./node_modules/bootstrap/dist/js/bootstrap.min.js', (err, data) => {
    if (err) {
      response.send(err)
    } else {
      response.writeHead(200, { 'Content-Type': 'text/javascript' })
      response.end(data)
    }
  })
})

app.get('/css/bootstrap.min.css', (request, response) => {
  fs.readFile('./node_modules/bootstrap/dist/css/bootstrap.min.css', (err, data) => {
    if (err) {
      response.send(err)
    } else {
      response.writeHead(200, { 'Content-Type': 'text/css' })
      response.end(data)
    }
  })
})

// ================ ANGULAR STUFF

app.get('*', (request, response) => {
  response.sendFile('index.html', { root: `${__dirname}/../public/templates/` })
})

// ================
server.on('request', app)
server.listen(process.env.PORT || 1234)
console.log('Server running over port 1234') // eslint-disable-line
