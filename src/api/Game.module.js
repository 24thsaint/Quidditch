import express from 'express'
import Game from '../models/Game'

const router = express.Router()

router.get('/games/list', (request, response) => {
  Game.find({}).populate('teams snitch').exec()
  .then((games) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(games, null, 2))
  })
})

router.get('/game/find/:gameId', (request, response) => {
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

router.get('/game/:gameId/team/all', (request, response) => {
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

export default router
