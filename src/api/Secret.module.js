import jwt from 'jsonwebtoken'
import User from '../models/User'

const secrets = {
  darkSecret: 'M0EKsRRZKobIqa6tJTjbYFRSR6MMXuuvSZPQa93oqkg=',
  resolveSecret: (token) => {
    const secretPromise = new Promise((resolve, reject) => {
      try {
        const tokenData = jwt.verify(token, secrets.darkSecret)
        resolve(User.findOne({ _id: tokenData }).exec())
      } catch (err) {
        reject(err)
      }
    })
    return secretPromise
  },
  summonDarkSecret: user =>
     jwt.sign(user._id.toString(), secrets.darkSecret) // eslint-disable-line no-underscore-dangle
  ,
}
export default secrets
