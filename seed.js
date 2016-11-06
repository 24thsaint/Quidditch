import faker from 'faker'
import mongoose from 'mongoose'

import Player from './dist/models/Player'
import Game from './dist/models/Game'
import Team from './dist/models/Team'
import Snitch from './dist/models/Snitch'

let teams
let s1
let k1
let c1
let c2
let c3
let s2
let k2
let c4
let c5
let c6
let team1
let team2
let redTeam
let blueTeam
let game

teams = []

s1 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Seeker',
})

k1 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Keeper',
})

c1 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Chaser',
})

c2 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Chaser',
})

c3 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Chaser',
})

s2 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Seeker',
})

k2 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Keeper',
})

c4 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Chaser',
})

c5 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Chaser',
})

c6 = new Player({
  number: faker.random.number(99),
  name: faker.name.findName(),
  position: 'Chaser',
})

team1 = [s1, k1, c1, c2, c3]
team2 = [s2, k2, c4, c5, c6]

redTeam = new Team({
  name: faker.address.country(),
  players: team1,
})

blueTeam = new Team({
  name: faker.address.country(),
  players: team2,
})

teams.push(redTeam)
teams.push(blueTeam)

const snitch = new Snitch()
snitch.save()

for (const player of team1) {
  player.save()
}

for (const player of team2) {
  player.save()
}

redTeam.save()
blueTeam.save()

for (const player of team1) {
  player.team = redTeam
  player.save()
}

for (const player of team2) {
  player.team = blueTeam
  player.save()
}

game = new Game({ teams, snitch })
game.start(new Date())
game.save()

console.log('Database seed successful')
