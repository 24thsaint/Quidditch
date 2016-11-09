/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line
import faker from 'faker'
import Snitch from '../models/Snitch'
import Player from '../models/Player'

const expect = chai.expect

describe('Player', () => {
  let snitch = new Snitch({})

  let s1 = new Player({
    number: '1',
    name: faker.name.findName(),
    position: 'Seeker',
  })

  let k1 = new Player({
    number: '2',
    name: faker.name.findName(),
    position: 'Keeper',
  })

  let c1 = new Player({
    number: '3',
    name: faker.name.findName(),
    position: 'Chaser',
  })

  beforeEach(() => {
    snitch = new Snitch({})

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
  })

  describe('#block()', () => {
    it('increases block count by 1', () => {
      k1.block()
      expect(k1.blocks).to.equal(1)
    })
  })

  describe('#scoreGoal()', () => {
    it('increases goal count by 1', () => {
      c1.scoreGoal()
      expect(c1.goals).to.equal(1)
    })
  })

  describe('#missGoal()', () => {
    it('increases block count by 1', () => {
      c1.missGoal()
      expect(c1.goalsMissed).to.equal(1)
    })
  })

  describe('#catchSnitch()', () => {
    it('catches the snitch', () => {
      const now = new Date()
      snitch.appeared(now)
      s1.catchSnitch(now, snitch)
      expect(s1.snitchCaught).to.be.true // eslint-disable-line
      expect(snitch.caughtBy).to.equal(s1)
    })
  })
})
