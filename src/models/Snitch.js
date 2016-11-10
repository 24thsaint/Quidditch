import mongoose from 'mongoose'
import Model from './Model'

class Snitch extends Model {

  static _schema = mongoose.Schema({ // eslint-disable-line
    appearedOn: { type: Date },
    caughtOn: { type: Date },
    caughtBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  })

  appeared() {
    if (this.appearedOn !== undefined) {
      throw new Error('Snitch has already appeared')
    }
    this.appearedOn = new Date(Date.now())
  }

  caught(player) {
    if (this.appearedOn === undefined) {
      throw new Error('Snitch has not yet appeared')
    }
    this.caughtOn = new Date(Date.now())
    this.caughtBy = player
  }
}

export default Model.load('Snitch', Snitch)
