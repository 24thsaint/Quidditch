import mongoose from 'mongoose'
import loadClass from 'mongoose-class-wrapper'

let mongoURI = ''

switch (process.env.NODE_ENV) {
  case 'production' :
    mongoURI = 'mongodb://production:123123@ds139937.mlab.com:39937/quidditch'
    break
  case 'ci' :
    mongoURI = 'mongodb://mongo/quidditch'
    break
  default:
    mongoURI = 'mongodb://localhost:27017/quidditch'
}

mongoose.connect(mongoURI)
mongoose.Promise = Promise

class Model {
  constructor(properties) {
    Object.assign(this, properties)
  }

  static load(name, modelClass) {
    modelClass._schema.plugin(loadClass, modelClass) // eslint-disable-line no-underscore-dangle
    return mongoose.model(name, modelClass._schema) // eslint-disable-line no-underscore-dangle
  }
}

export default Model
