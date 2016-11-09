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

  /* take note of the universalize method that uses static schema var */
  static load(name, modelClass, schema) {
    schema.plugin(loadClass, modelClass)
    return mongoose.model(name, schema)
  }
}

export default Model
