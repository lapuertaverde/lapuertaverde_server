const conn = require('../repositories/mongo.repository')
const magic = require('../../utils/magic')

exports.GetAll = async () => {
  try {
    return await conn.db.connMongo.CastSheets.find().populate('consumers')
  } catch (error) {
    magic.LogDanger('Cannot getAll castsheets', error)
    return await { err: { code: 123, message: error } }
  }
}

exports.Create = async (date, consumerGroup, consumers, deliveryAddress, status) => {
  try {
    const data = await new conn.db.connMongo.CastSheets({
      date,
      consumerGroup,
      consumers,
      deliveryAddress,
      status
    })

    data.save()
    return data
  } catch (error) {
    magic.LogDanger('Cannot Create castsheet', error)
    return await { err: { code: 123, message: error } }
  }
}

exports.Delete = async (id) => {
  try {
    return await conn.db.connMongo.CastSheets.findByIdAndDelete(id)
  } catch (error) {
    magic.LogDanger('Cannot Delete CastSheets', error)
    return await { err: { code: 123, message: error } }
  }
}

exports.Update = async (id, updatedCastSheets) => {
  try {
    return await conn.db.connMongo.CastSheets.findByIdAndUpdate(id, updatedCastSheets)
  } catch (error) {
    magic.LogDanger('Cannot Update CastSheets', error)
    return await { err: { code: 123, message: error } }
  }
}

exports.GetById = async (id) => {
  try {
    return await conn.db.connMongo.CastSheets.findById(id).populate('consumers')
  } catch (error) {
    magic.LogDanger('Cannot get the CastSheets by its ID', error)
    return await { err: { code: 123, message: error } }
  }
}
