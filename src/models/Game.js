import mongoose from 'mongoose'
import Model from './Model'

class Game extends Model {

  static _schema = mongoose.Schema({  // eslint-disable-line
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    snitch: { type: mongoose.Schema.Types.ObjectId, ref: 'Snitch' },
    playHistory: [{
      time: Date,
      eventType: String,
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    }],
    startTime: { type: Date },
    endTime: { type: Date },
  })

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
      eventType: 'end',
      player: seeker,
    }
    this.playHistory.push(message)
    return message
  }

  start() {
    this.startTime = new Date(Date.now())
    const message = {
      time: this.startTime,
      eventType: 'start',
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
      eventType: 'goal',
      player: chaser,
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
      eventType: 'miss',
      player: chaser,
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
      eventType: 'block',
      player: keeper,
    }
    this.playHistory.push(message)
    return message
  }

  snitchAppeared() {
    if (this.endTime !== undefined) {
      throw new Error('Game has already ended')
    }
    this.snitch.appeared()
    const message = {
      time: this.snitch.appearedOn,
      eventType: 'snitchAppears',
    }
    this.playHistory.push(message)
    return message
  }

  snitchCaught(seeker) {
    seeker.catchSnitch(this.snitch)
    return this.end(this.snitch.caughtOn, seeker)
  }
}

export default Model.load('Game', Game)
