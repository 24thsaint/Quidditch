import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import Model from './Model'

class User extends Model {

  static _schema = mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  })

  encryptPassword() {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
  }

}

export default Model.load('User', User)
