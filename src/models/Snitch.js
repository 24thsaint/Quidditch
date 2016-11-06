import Model from './Model'
import mongoose from 'mongoose'

const schema = mongoose.Schema({
  appearedOn: { type: Date },
  caughtOn: { type: Date },
  caughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
})

class Snitch extends Model {

  appeared(time) {
    if (this.appearedOn !== undefined) {
      throw new Error('Snitch has already appeared')
    }
    this.appearedOn = time
  }

  caught(time, player) {
    if (this.appearedOn === undefined) {
      throw new Error('Snitch has not yet appeared')
    }
    this.caughtOn = time
    this.caughtBy = player
  }
}

export default Model.load('Snitch', Snitch, schema)
