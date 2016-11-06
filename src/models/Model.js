import mongoose from 'mongoose'
import loadClass from 'mongoose-class-wrapper'

let mongoURI = ''

switch (process.env.NODE_ENV) {
  case 'production' :
    mongoURI = 'mongodb://24thsaint:hydr0gen@ds139937.mlab.com:39937/quidditch'
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

  static load(name, modelClass, schema) {
    schema.plugin(loadClass, modelClass)
    return mongoose.model(name, schema)
  }
}

export default Model
