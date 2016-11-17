import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User'
import FailureResponse from './FailureResponse.module'
import secrets from './Secret.module'

const router = express.Router()

router.post('/user/login', (request, response) => {
  const auth = request.body
  User.findOne({ username: auth.username }).exec()
  .then((user) => {
    const isAuthorized = bcrypt.compareSync(auth.password, user.password)
    if (isAuthorized) {
      response.end(JSON.stringify({
        status: 'OK',
        token: secrets.summonDarkSecret(user),
      }))
    } else {
      FailureResponse.respondAsFailed(response, 'INVALID PASSWORD')
    }
  })
  .catch((err) => {
    FailureResponse.respondAsFailed(response, err.message)
  })
})

router.get('/user/verify/:token', (request, response) => {
  const token = request.params.token
  const tokenResolve = new Promise((resolve) => {
    const tokenData = jwt.verify(token, secrets.darkSecret)
    resolve(tokenData)
  })
  tokenResolve
  .then(tokenData =>
     User.findOne({ _id: tokenData }).exec(),
  )
  .then((user) => {
    const jsonResponse = {
      status: 'OK',
      session: user._id, // eslint-disable-line no-underscore-dangle
    }
    response.end(JSON.stringify(jsonResponse))
  })
  .catch((err) => {
    FailureResponse.respondAsFailed(response, err.message)
  })
})

export default router
