import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import userModule from '../dist/api/User.module'
import gameModule from '../dist/api/Game.module'
import teamModule from '../dist/api/Team.module'
import playerModule from '../dist/api/Player.module'
import webSocket from '../dist/api/WebSocket.module'

const WebSocketServer = require('ws').Server

const server = http.createServer()
const app = express()
const socketServerInstance = new WebSocketServer({ server })
const socket = webSocket(socketServerInstance)
app.use(bodyParser.json())
mongoose.Promise = Promise
app.use(express.static('public'))
app.use(cors())
app.use(userModule)
app.use(gameModule)
app.use(teamModule)
app.use(playerModule(socket))

app.get('*', (request, response) => {
  response.sendFile('index.html', { root: `${__dirname}/../public/templates/` })
})

// ================
server.on('request', app)
server.listen(process.env.PORT || 1234)
console.log('Server running over port 1234') // eslint-disable-line no-console
