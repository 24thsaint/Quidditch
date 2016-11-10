import faker from 'faker'

import Player from './dist/models/Player'
import Game from './dist/models/Game'
import Team from './dist/models/Team'
import Snitch from './dist/models/Snitch'

const teams = []

const s1 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Seeker',
})

const k1 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Keeper',
})

const c1 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Chaser',
})

const c2 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Chaser',
})

const c3 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Chaser',
})

const s2 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Seeker',
})

const k2 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Keeper',
})

const c4 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Chaser',
})

const c5 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Chaser',
})

const c6 = new Player({
  number: faker.random.number(99),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  position: 'Chaser',
})

const team1 = [s1, k1, c1, c2, c3]
const team2 = [s2, k2, c4, c5, c6]

const redTeam = new Team({
  name: faker.address.country(),
  players: team1,
})

const blueTeam = new Team({
  name: faker.address.country(),
  players: team2,
})

teams.push(redTeam)
teams.push(blueTeam)

const snitch = new Snitch()
snitch.save()
  .then(() => {
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

    const game = new Game({ teams, snitch })
    game.start()
    game.save()
      .then(() => {
        console.log('Database seed successful')
        process.exit()
      })
  })
