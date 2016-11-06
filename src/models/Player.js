import mongoose from 'mongoose'
import Model from './Model'

const schema = mongoose.Schema({
  number: { type: Number },
  name: { type: String },
  position: { type: String },
  blocks: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  goalsMissed: { type: Number, default: 0 },
  snitchCaught: { type: Boolean, default: false },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
})

class Player extends Model {

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

  catchSnitch(time, snitch) {
    if (this.position !== 'Seeker') {
      throw new Error('Cannot catch snitch, player is not a seeker')
    }
    snitch.caught(time, this)
    this.snitchCaught = true
  }
}

export default Model.load('Player', Player, schema)
