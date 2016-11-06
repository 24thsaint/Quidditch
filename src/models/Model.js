import mongoose from 'mongoose'
import loadClass from 'mongoose-class-wrapper'

mongoose.connect('mongodb://localhost:27017/quidditch')
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
