/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line
import faker from 'faker'
import Snitch from '../models/Snitch'
import Player from '../models/Player'
import Game from '../models/Game'
import Team from '../models/Team'

const expect = chai.expect
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

function reinitialize() {
  teams = []

  s1 = new Player({
    number: '1',
    name: faker.name.findName(),
    position: 'Seeker',
  })

  k1 = new Player({
    number: '2',
    name: faker.name.findName(),
    position: 'Keeper',
  })

  c1 = new Player({
    number: '3',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  c2 = new Player({
    number: '4',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  c3 = new Player({
    number: '5',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  s2 = new Player({
    number: '6',
    name: faker.name.findName(),
    position: 'Seeker',
  })

  k2 = new Player({
    number: '7',
    name: faker.name.findName(),
    position: 'Keeper',
  })

  c4 = new Player({
    number: '8',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  c5 = new Player({
    number: '9',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  c6 = new Player({
    number: '10',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  team1 = [s1, k1, c1, c2, c3]
  team2 = [s2, k2, c4, c5, c6]
  redTeam = new Team({
    name: 'Red Team',
    players: team1,
  })
  blueTeam = new Team({
    name: 'Blue Team',
    players: team2,
  })
  teams.push(redTeam)
  teams.push(blueTeam)
  const snitch = new Snitch()
  game = new Game({
    teams,
    snitch,
  })
  game.start(new Date())
}

beforeEach(() => {
  reinitialize()
})

describe('Game', () => {
  beforeEach(() => {
    reinitialize()
  })

  it('initialization', () => {
    game = new Game()
    expect(game.teams.length).to.equal(0)
    expect(game.playHistory.length).to.equal(0)
    expect(game.startTime).to.be.undefined // eslint-disable-line
    expect(game.endTime).to.be.undefined // eslint-disable-line
    expect(game.snitch).to.be.undefined // eslint-disable-line
  })

  describe('#goalMade()', () => {
    beforeEach(() => {
      reinitialize()
    })

    it('make red team win 2 goals', () => {
      game.goalMade(c1)
      game.goalMade(c3)
      expect(redTeam.score).to.equal(20)
    })

    it('make blue team win 4 goals', () => {
      game.goalMade(c4)
      game.goalMade(c5)
      game.goalMade(c6)
      game.goalMade(c5)
      expect(blueTeam.score).to.equal(40)
    })
  })

  describe('#goalBlocked', () => {
    it('indicate that an attempted goal has been blocked', () => {
      game.goalBlocked(k2)
      expect(k2.blocks).to.equal(1)
    })
  })

  describe('#snitchCaught', () => {
    it('make blue team catch the snitch and end the game', () => {
      game.snitchAppeared()
      game.snitchCaught(s2)
      expect(blueTeam.score).to.equal(30)
      expect(game.endTime).to.not.be.undefined // eslint-disable-line
    })
  })
})

describe('Snitch', () => {
  beforeEach(() => {
    reinitialize()
  })

  const snitch = new Snitch({})

  it('indicate that the snitch has not yet appeared nor caught', () => {
    expect(snitch.appearedOn).to.be.undefined // eslint-disable-line
    expect(snitch.caughtOn).to.be.undefined   // eslint-disable-line
  })

  describe('#appeared', () => {
    it('indicate that the snitch has appeared', () => {
      snitch.appeared(new Date())
      expect(snitch.appearedOn).to.not.be.undefined // eslint-disable-line
      expect(snitch.caughtOn).to.be.undefined       // eslint-disable-line
    })
  })

  describe('#caught', () => {
    it('indicate that the snitch has been caught after 3 minutes', () => {
      const snitchCaughtSimulatedTime = new Date(snitch.appearedOn)
      snitchCaughtSimulatedTime.setMinutes(snitchCaughtSimulatedTime.getMinutes() + 3)
      snitch.caught(snitchCaughtSimulatedTime, s1)
      expect(snitch.caughtOn.getTime() - snitch.appearedOn.getTime()).to.equal(180000)
      expect(snitch.caughtBy).to.equal(s1)
    })
  })
})
