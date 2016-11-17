import express from 'express'
import Team from '../models/Team'
import FailureResponse from './FailureResponse.module'

const router = express.Router()

router.get('/team/find/:id', (request, response) => {
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
    FailureResponse.respondAsFailed(response, 'Resource not found')
  })
})

export default router
