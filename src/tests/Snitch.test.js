/* eslint-env mocha */

import chai from 'chai'
import faker from 'faker'
import sinon from 'sinon'
import Snitch from '../models/Snitch'
import Player from '../models/Player'

const expect = chai.expect

describe('Snitch', () => {
  let snitch = new Snitch({})
  let s1 = new Player({
    number: '1',
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    position: 'Seeker',
  })
  let now = new Date()
  let clock = sinon.useFakeTimers(now.getTime())

  beforeEach(() => {
    snitch = new Snitch({})
    s1 = new Player({
      number: '1',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      position: 'Seeker',
    })
    clock.restore()
  })

  it('indicate that the snitch has not yet appeared nor caught', () => {
    expect(snitch.appearedOn).to.be.undefined // eslint-disable-line
    expect(snitch.caughtOn).to.be.undefined // eslint-disable-line
  })

  describe('#appeared()', () => {
    it('indicate that the snitch has appeared', () => {
      snitch.appeared()
      now = new Date()
      clock = sinon.useFakeTimers(now.getTime())
      expect(snitch.appearedOn).to.not.be.undefined // eslint-disable-line
      expect(snitch.appearedOn.getTime()).to.equal(new Date(clock.now).getTime()) // eslint-disable-line
      expect(snitch.caughtOn).to.be.undefined // eslint-disable-line
    })
  })

  describe('#caught()', () => {
    it('indicate that the snitch has been caught after 143 minutes', () => {
      snitch.appeared()
      now = new Date(snitch.appearedOn.getTime())
      now.setMinutes(now.getMinutes() + 143)
      clock = sinon.useFakeTimers(now.getTime())
      snitch.caught(s1)
      expect(snitch.caughtOn.getTime()).to.equal(new Date(clock.now).getTime())
      expect(snitch.caughtBy).to.equal(s1)
    })
  })
})
