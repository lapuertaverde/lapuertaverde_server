import config from 'config-yml'
import mongoose from 'mongoose'
import { LogInfo, LogDanger } from '../../utils/magic.js'
import consumer from '../entities/entity-consumer.js'
import consumerGroup from '../entities/entity-consumerGroup.js'
import castSheets from '../entities/entity-castSheets.js'
import bill from '../entities/entity-bill.js'
import finalRecord from '../entities/entity-finalRecord.js'
import user from '../entities/entity-user.js'
import product from '../entities/entity-product.js'

import dotenv from 'dotenv'

dotenv.config()

let db = {}

if (config.db.mongodb && config.db.mongodb.length > 0) {
  config.db.mongodb.map((c) => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db[c.nameconn] = {}
    db[c.nameconn].conn = mongoose
    db[c.nameconn].Consumer = consumer(mongoose)
    db[c.nameconn].ConsumerGroup = consumerGroup(mongoose)
    db[c.nameconn].CastSheets = castSheets(mongoose)
    db[c.nameconn].Bill = bill(mongoose)
    db[c.nameconn].FinalRecord = finalRecord(mongoose)
    db[c.nameconn].User = user(mongoose)
    db[c.nameconn].Product = product(mongoose)
  })

  LogInfo('Conectado a la base de datos')
} else {
  LogDanger('No existe la base de datos')
}

export default db
