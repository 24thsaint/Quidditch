import mongoose from 'mongoose'
import Model from './Model'

class Player extends Model {

  static _schema = mongoose.Schema({
    number: { type: Number },
    firstName: { type: String },
    lastName: { type: String },
    position: { type: String },
    blocks: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    goalsMissed: { type: Number, default: 0 },
    snitchCaught: { type: Boolean, default: false },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  })

  block() {
    if (this.position !== 'Keeper') {
      throw new Error('Cannot block, player is not a keeper')
    }
    this.blocks += 1
  }

  scoreGoal() {
    if (this.position !== 'Chaser') {
      throw new Error('Cannot score goal, player is not a chaser')
    }
    this.goals += 1
  }

  missGoal() {
    if (this.position !== 'Chaser') {
      throw new Error('Cannot miss a goal, player is not a chaser')
    }
    this.goalsMissed += 1
  }

  catchSnitch(snitch) {
    if (this.position !== 'Seeker') {
      throw new Error('Cannot catch snitch, player is not a seeker')
    }
    snitch.caught(this)
    this.snitchCaught = true
    this.goals = 3 // catch only once, score it only once.
  }
}

export default Model.load('Player', Player)
