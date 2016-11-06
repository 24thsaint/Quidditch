/* eslint-env mocha */
import chai from 'chai'
import Player from '../models/Player'
const expect = chai.expect

describe('Player', () => {
  describe('#save()', () => {
    it('confirm that player collection is empty', (done) => {
      Player.find({}).exec()
      .then((players) => {
        expect(players).to.have.length(0)
        done()
      })
    })

    it('confirm that player collection has one entry', (done) => {
      const rave = new Player({
        number: '23',
        name: 'Rave Arevalo',
        position: 'Chaser',
      })
      rave.save()
        .then(() => {
          Player.find({}).exec()
            .then((players) => {
              expect(players).to.have.length(1)
              done()
            })
        })
    })
  })
})
