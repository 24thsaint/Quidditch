import express from 'express'
import secrets from './Secret.module'
import Player from '../models/Player'
import Game from '../models/Game'
import Team from '../models/Team'
import Snitch from '../models/Snitch'
import FailureResponse from './FailureResponse.module'

function playerModule(socket) {
  const router = express.Router()

  router.post('/game/:gameId/chaser/goal/:token', (request, response) => {
    const token = request.params.token
    const gameId = request.params.gameId
    const jsonRequest = request.body

    if (jsonRequest.chaser === undefined) {
      FailureResponse.respondAsFailed(response, 'Player not found')
    }

    let player

    secrets.resolveSecret(token)
    .then(() =>
       Player.findOne({ _id: jsonRequest.chaser }).populate('team').exec(),
    )
    .then((playerData) => {
      player = playerData
      return Game.findOne({ _id: gameId }).exec()
    })
    .then((game) => {
      const socketResponse = game.goalMade(player)
      socket.sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      player.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      socket.sendBoxScoreSocketResponse(teams)
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
      FailureResponse.respondAsFailed(response, err.message)
    })
  })

  router.post('/game/:gameId/chaser/miss/:token', (request, response) => {
    const token = request.params.token
    const gameId = request.params.gameId
    const jsonRequest = request.body

    if (jsonRequest.chaser === undefined) {
      FailureResponse.respondAsFailed(response, 'Player not found')
    }

    let player
    let game

    secrets.resolveSecret(token)
    .then(() =>
       Player.findOne({ _id: jsonRequest.chaser }).exec(),
    )
    .then((playerData) => {
      player = playerData
      return Game.findOne({ _id: gameId }).exec()
    })
    .then((gameData) => {
      game = gameData
      const socketResponse = game.goalMissed(player)
      socket.sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      player.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      socket.sendBoxScoreSocketResponse(teams)
      const jsonResponse = JSON.stringify({
        status: 'OK',
        player: `${player.firstName} ${player.lastName}`,
      })
      response.end(jsonResponse)
    })
    .catch((err) => {
      socket.respondAsFailed(response, err.message)
    })
  })

  router.post('/game/:gameId/keeper/block/:token', (request, response) => {
    const token = request.params.token
    const gameId = request.params.gameId
    const jsonRequest = request.body

    if (jsonRequest.keeper === undefined) {
      FailureResponse.respondAsFailed(response, 'Player not found')
    }

    let player

    secrets.resolveSecret(token)
    .then(() =>
       Player.findOne({ _id: jsonRequest.keeper }).exec(),
    )
    .then((playerData) => {
      player = playerData
      return Game.findOne({ _id: gameId }).exec()
    })
    .then((game) => {
      const socketResponse = game.goalBlocked(player)
      socket.sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      player.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      socket.sendBoxScoreSocketResponse(teams)
      const jsonResponse = JSON.stringify({
        status: 'OK',
        player: `${player.firstName} ${player.lastName}`,
      })

      response.end(jsonResponse)
    })
    .catch((err) => {
      FailureResponse.respondAsFailed(response, err.message)
    })
  })

  router.post('/game/:gameId/seeker/catchSnitch/:token', (request, response) => {
    const token = request.params.token
    const gameId = request.params.gameId
    const jsonRequest = request.body

    if (jsonRequest.seeker === undefined) {
      FailureResponse.respondAsFailed(response, 'Player not found')
    }

    let game
    let seeker

    secrets.resolveSecret(token)
    .then(() =>
       Game.findOne({ _id: gameId }).populate('snitch').exec(),
    )
    .then((gameData) => {
      game = gameData
      return Player.findOne({ _id: jsonRequest.seeker }).exec()
    })
    .then((seekerData) => {
      seeker = seekerData
      const socketResponse = game.snitchCaught(seeker)
      socket.sendPlayByPlaySocketResponse(socketResponse)
      game.snitch.save()
      seeker.save()
      game.save()
      return Team.find({ _id: { $in: game.teams } }).populate('players').exec()
    })
    .then((teams) => {
      socket.sendBoxScoreSocketResponse(teams)
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
      FailureResponse.respondAsFailed(response, err.message)
    })
  })

  router.post('/game/:gameId/snitch/appeared/:token', (request, response) => {
    const token = request.params.token
    const gameId = request.params.gameId

    secrets.resolveSecret(token)
    .then(() =>
       Game.findOne({ _id: gameId }).populate('snitch').exec(),
    )
    .then((game) => {
      const socketResponse = game.snitchAppeared()
      socket.sendPlayByPlaySocketResponse(socketResponse)
      game.snitch.save()
      game.save()
      const jsonResponse = JSON.stringify({
        status: 'OK',
        appearanceDate: game.snitch.appearedOn,
      })
      response.end(jsonResponse)
    })
    .catch((err) => {
      FailureResponse.respondAsFailed(response, err.message)
    })
  })

  router.post('/game/start/:token', (request, response) => {
    const token = request.params.token
    const jsonRequest = request.body

    secrets.resolveSecret(token)
    .then(() => {
      const snitch = new Snitch()
      snitch.save()
      const game = new Game({
        teams: jsonRequest.teams,
        snitch,
        playHistory: [],
      })
      const socketResponse = game.start()
      socket.sendPlayByPlaySocketResponse(socketResponse)
      game.save()
      response.redirect(`/game/${game._id}`) // eslint-disable-line no-underscore-dangle
    })
    .catch((err) => {
      FailureResponse.respondAsFailed(response, err.message)
    })
  })

  return router
}

export default playerModule
