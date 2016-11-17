import mongoose from 'mongoose'
import Model from './Model'

class Team extends Model {

  static _schema = mongoose.Schema({
    name: { type: String },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  })

  addPlayer(player) {
    this.players.push(player)
  }

  get score() {
    let goalsMade = 0
    let score = 0
    this.players.forEach((player) => {
      goalsMade += player.goals
    })
    score += goalsMade * 10
    return score
  }

}

export default Model.load('Team', Team)
