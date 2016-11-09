/* eslint-env mocha */

import chai from 'chai' // eslint-disable-line
import faker from 'faker'
import Snitch from '../models/Snitch'
import Player from '../models/Player'

const expect = chai.expect

describe('Snitch', () => {
  const snitch = new Snitch({})
  let s1 = new Player({
    number: '1',
    name: faker.name.findName(),
    position: 'Seeker',
  })

  beforeEach(() => {
    s1 = new Player({
      number: '1',
      name: faker.name.findName(),
      position: 'Seeker',
    })
  })

  it('indicate that the snitch has not yet appeared nor caught', () => {
    expect(snitch.appearedOn).to.be.undefined // eslint-disable-line
    expect(snitch.caughtOn).to.be.undefined // eslint-disable-line
  })

  describe('#appeared', () => {
    it('indicate that the snitch has appeared', () => {
      snitch.appeared(new Date())
      expect(snitch.appearedOn).to.not.be.undefined // eslint-disable-line
      expect(snitch.caughtOn).to.be.undefined // eslint-disable-line
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
