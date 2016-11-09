import mongoose from 'mongoose'
import Model from './Model'

const schema = mongoose.Schema({ // eslint-disable-line
  name: { type: String },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
})

class Team extends Model {

  addPlayer(player) {
    this.players.push(player)
  }

  get score() {
    let goalsMade = 0
    let score = 0
    // use forEach, airBnb styleguide
    for (const player of this.players) {
      goalsMade += player.goals
      if (player.snitchCaught) {
        score += 30 // https://www.usquidditch.org/about/rules
      }
    }
    score += goalsMade * 10
    return score
  }

}

// export default Team
export default Model.load('Team', Team, schema)
