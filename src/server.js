import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import cors from 'cors'
import sha256 from 'sha256'
import Team from '../dist/models/Team'
import Player from '../dist/models/Player'
import Snitch from '../dist/models/Snitch'
import Game from '../dist/models/Game'
import User from '../dist/models/User'

const WebSocketServer = require('ws').Server

const server = http.createServer()
const app = express()
const socket = new WebSocketServer({ server })
app.use(bodyParser.json())
app.use(cookieParser())
mongoose.Promise = Promise
app.use(express.static('public'))
app.use(cors())

// =============== TOKENS

const clientTokens = {}

function generateToken(user) {
  const token = sha256(user._id + new Date().getTime()) // eslint-disable-line no-underscore-dangle
  clientTokens[token] = user
  return token
}

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

function sendPlayByPlaySocketResponse(response) {
  const socketResponse = response
  socketResponse.type = 'PLAY-BY-PLAY'
  socket.clients.forEach((client) => {
    client.send(JSON.stringify(socketResponse))
  })
}

function respondAsUnauthorized(response) {
  response.writeHead(401, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ status: 'FAIL', message: 'Unauthorized' }))
}

function respondAsFailed(response, message) {
  response.end(JSON.stringify({ status: 'FAIL', message }))
}

// ================ REST stuff

app.post('/user/login', (request, response) => {
  const auth = request.body
  User.findOne({ username: auth.username }).exec()
  .then((user) => {
    const isAuthorized = bcrypt.compareSync(auth.password, user.password)
    if (isAuthorized) {
      response.end(JSON.stringify({
        status: 'OK',
        token: generateToken(user),
      }))
    } else {
      respondAsFailed(response, 'INVALID PASSWORD')
    }
  })
  .catch((err) => {
    respondAsFailed(response, err.message)
  })
})

app.get('/user/verify/:token', (request, response) => {
  let jsonResponse
  const valid = clientTokens[request.params.token]
  if (valid) {
    jsonResponse = Object.assign({}, valid)
    delete jsonResponse.password
    delete jsonResponse._id // eslint-disable-line no-underscore-dangle
    response.end(JSON.stringify(jsonResponse))
  } else {
    respondAsFailed(response, 'TOKEN IS INVALID')
  }
})

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
  }).populate({
    path: 'playHistory.player',
    model: 'Player',
  })
  .exec()
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
    game.teams.forEach((team) => {
      const json = {
        team,
        score: team.score,
      }
      res.push(json)
    })
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
    respondAsFailed(response, 'Resource not found')
  })
})

app.post('/game/:gameId/chaser/goal/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (clientTokens[token] !== undefined) {
    response.writeHead(200, { 'Content-Type': 'application/json' })

    if (jsonRequest.chaser === undefined) {
      respondAsFailed(response, 'Player not found')
    }

    let player

    Player.findOne({ _id: jsonRequest.chaser }).populate('team').exec()
    .then((playerData) => {
      player = playerData
      return Game.findOne({ _id: gameId }).exec()
    })
    .then((game) => {
      const socketResponse = game.goalMade(player)
      sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      player.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
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
          jsonResponse.teamId = team._id // eslint-disable-line no-underscore-dangle
        }
      })

      response.end(JSON.stringify(jsonResponse))
    })
    .catch((err) => {
      respondAsFailed(response, err.message)
    })
  } else {
    respondAsUnauthorized(response)
  }
})

app.post('/game/:gameId/chaser/miss/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (clientTokens[token] !== undefined) {
    response.writeHead(200, { 'Content-Type': 'application/json' })

    if (jsonRequest.chaser === undefined) {
      respondAsFailed(response, 'Player not found')
    }

    let player
    let game

    Player.findOne({ _id: jsonRequest.chaser }).exec()
    .then((playerData) => {
      player = playerData
      return Game.findOne({ _id: gameId }).exec()
    })
    .then((gameData) => {
      game = gameData
      const socketResponse = game.goalMissed(player)
      sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      player.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      sendBoxScoreSocketResponse(teams)
      const jsonResponse = JSON.stringify({
        status: 'OK',
        player: `${player.firstName} ${player.lastName}`,
      })
      response.end(jsonResponse)
    })
    .catch((err) => {
      respondAsFailed(response, err.message)
    })
  } else {
    respondAsUnauthorized(response)
  }
})

app.post('/game/:gameId/keeper/block/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (clientTokens[token] !== undefined) {
    response.writeHead(200, { 'Content-Type': 'application/json' })

    if (jsonRequest.keeper === undefined) {
      respondAsFailed(response, 'Player not found')
    }

    let player

    Player.findOne({ _id: jsonRequest.keeper }).exec()
    .then((playerData) => {
      player = playerData
      return Game.findOne({ _id: gameId }).exec()
    })
    .then((game) => {
      const socketResponse = game.goalBlocked(player)
      sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      player.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      sendBoxScoreSocketResponse(teams)
      const jsonResponse = JSON.stringify({
        status: 'OK',
        player: `${player.firstName} ${player.lastName}`,
      })

      response.end(jsonResponse)
    })
    .catch((err) => {
      respondAsFailed(response, err.message)
    })
  } else {
    respondAsUnauthorized(response)
  }
})

app.post('/game/:gameId/seeker/catchSnitch/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId
  const jsonRequest = request.body

  if (clientTokens[token] !== undefined) {
    if (jsonRequest.seeker === undefined) {
      respondAsFailed(response, 'Player not found')
    }

    let game
    let seeker

    Game.findOne({ _id: gameId }).populate('snitch').exec()
    .then((gameData) => {
      game = gameData
      return Player.findOne({ _id: jsonRequest.seeker }).exec()
    })
    .then((seekerData) => {
      seeker = seekerData
      const socketResponse = game.snitchCaught(seeker)
      sendPlayByPlaySocketResponse(socketResponse)
      game.snitch.save()
      seeker.save()
      game.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      sendBoxScoreSocketResponse(teams)
      return Team.findOne({ _id: seeker.team }).populate('players').exec()
    })
    .then((team) => {
      const jsonResponse = JSON.stringify({
        status: 'OK',
        player: `${seeker.firstName} ${seeker.lastName}`,
        endTime: game.endTime,
        score: team.score,
        teamId: team._id, // eslint-disable-line no-underscore-dangle
      })
      response.end(jsonResponse)
    })
    .catch((err) => {
      respondAsFailed(response, err.message)
    })
  } else {
    respondAsUnauthorized(response)
  }
})

app.post('/game/:gameId/snitch/appeared/:token', (request, response) => {
  const token = request.params.token
  const gameId = request.params.gameId

  if (clientTokens[token] !== undefined) {
    Game.findOne({ _id: gameId }).populate('snitch').exec()
    .then((game) => {
      const socketResponse = game.snitchAppeared()
      sendPlayByPlaySocketResponse(socketResponse)
      game.snitch.save()
      game.save()
      const jsonResponse = JSON.stringify({
        status: 'OK',
        appearanceDate: game.snitch.appearedOn,
      })
      response.end(jsonResponse)
    })
    .catch((err) => {
      respondAsFailed(response, err.message)
    })
  } else {
    respondAsUnauthorized(response)
  }
})


app.post('/game/start/:token', (request, response) => {
  const token = request.params.token
  const jsonRequest = request.body

  if (clientTokens[token] !== undefined) {
    const snitch = new Snitch()
    snitch.save()
    .then(() => {
      const game = new Game({
        teams: jsonRequest.teams,
        snitch,
        playHistory: [],
      })
      const socketResponse = game.start()
      sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      response.redirect(`/game/${game._id}`) // eslint-disable-line no-underscore-dangle
    })
    .catch((err) => {
      respondAsFailed(response, err.message)
    })
  } else {
    respondAsUnauthorized(response)
  }
})

// ================ ANGULAR STUFF

app.get('*', (request, response) => {
  response.sendFile('index.html', { root: `${__dirname}/../public/templates/` })
})

// ================
server.on('request', app)
server.listen(process.env.PORT || 1234)
console.log('Server running over port 1234') // eslint-disable-line no-console
