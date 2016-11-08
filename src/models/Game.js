import mongoose from 'mongoose'
import Model from './Model'

const schema = mongoose.Schema({  // eslint-disable-line
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  snitch: { type: mongoose.Schema.Types.ObjectId, ref: 'Snitch' },
  playHistory: [{
    time: Date,
    message: String,
  }],
  startTime: { type: Date },
  endTime: { type: Date },
})

class Game extends Model {

  end(time, seeker) {
    if (this.snitch.caughtOn === undefined) {
      throw new Error('Snitch not yet caught')
    }
    if (this.startTime === undefined) {
      throw new Error('Game cannot end: It has not started yet')
    }
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    this.endTime = time
    const message = {
      time,
      message: `Snitch caught by ${seeker.name}. GAME HAS ENDED.`,
    }
    this.playHistory.push(message)
    return message
  }

  start(time) {
    this.startTime = time
    const message = {
      time: new Date(),
      message: `Game started on ${time}`,
    }
    this.playHistory.push(message)
    return message
  }

  goalMade(chaser) {
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    chaser.scoreGoal()
    const message = {
      time: new Date(),
      message: `Goal made by ${chaser.name}`,
    }
    this.playHistory.push(message)
    return message
  }

  goalMissed(chaser) {
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    chaser.missGoal()
    const message = {
      time: new Date(),
      message: `Goal missed by ${chaser.name}`,
    }
    this.playHistory.push(message)
    return message
  }

  goalBlocked(keeper) {
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    keeper.block()
    const message = {
      time: new Date(),
      message: `Goal blocked by ${keeper.name}`,
    }
    this.playHistory.push(message)
    return message
  }

  snitchAppeared() {
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    const appearanceDate = new Date()
    this.snitch.appeared(appearanceDate)
    const message = {
      time: appearanceDate,
      message: 'Snitch has appeared',
    }
    this.playHistory.push(message)
    return message
  }

  snitchCaught(seeker) {
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    const now = new Date()
    seeker.catchSnitch(now, this.snitch)
    return this.end(now, seeker)
  }
}

export default Model.load('Game', Game, schema)
