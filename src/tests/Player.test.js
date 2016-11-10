/* eslint-env mocha */

import chai from 'chai'
import faker from 'faker'
import sinon from 'sinon'
import Snitch from '../models/Snitch'
import Player from '../models/Player'

const expect = chai.expect

describe('Player', () => {
  let snitch = new Snitch({})
  let now = new Date()
  let clock = sinon.useFakeTimers(now.getTime())

  let s1 = new Player({
    number: '1',
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: 'Seeker',
  })

  let k1 = new Player({
    number: '2',
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: 'Keeper',
  })

  let c1 = new Player({
    number: '3',
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: 'Chaser',
  })

  beforeEach(() => {
    clock.restore()
    snitch = new Snitch({})

    s1 = new Player({
      number: '1',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: 'Seeker',
    })

    k1 = new Player({
      number: '2',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: 'Keeper',
    })

    c1 = new Player({
      number: '3',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
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
    it('catches the snitch after 143 minutes', () => {
      snitch.appeared()
      now = new Date(snitch.appearedOn.getTime())
      now.setMinutes(now.getMinutes() + 143)
      clock = sinon.useFakeTimers(now.getTime())
      s1.catchSnitch(snitch)
      expect(s1.snitchCaught).to.be.true // eslint-disable-line
      expect(snitch.caughtOn.getTime()).to.equal(new Date(clock.now).getTime())
      expect(snitch.caughtBy).to.equal(s1)
    })
  })
})
