const conn = require('../repositories/mongo.repository')
const magic = require('../../utils/magic')

exports.GetAll = async () => {
  try {
    return await conn.db.connMongo.CastSheets.find().populate('consumers')
  } catch (error) {
    magic.LogDanger('Cannot getAll castsheets', error)
    return { err: { code: 123, message: error } }
  }
}

exports.Create = async (date, consumerGroup, consumers, deliveryAddress, castStatus) => {
  try {
    const duplicatedCastSheets = await conn.db.connMongo.CastSheets.find({ date, consumerGroup })
    if (duplicatedCastSheets.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a castsheet with the same date and group"
      }
    } else {
      const data = await new conn.db.connMongo.CastSheets({
        date,
        consumerGroup,
        consumers,
        deliveryAddress,
        castStatus
      })
      data.save()
      return data
    }
  } catch (error) {
    magic.LogDanger('Cannot Create castsheet', error)
    if (error.type === 'custom') {
      const { code, message } = error
      return { err: { code, message } }
    }
    return { err: { code: 123, message: error } }
  }
}

exports.Delete = async (id) => {
  try {
    const castsheetDeleted = await conn.db.connMongo.CastSheets.findByIdAndDelete(id)
    if (castsheetDeleted) return castsheetDeleted
  } catch (error) {
    magic.LogDanger('Cannot Delete CastSheets', error)

    return { err: { code: 123, message: error } }
  }
}

exports.Update = async (id, updatedCastSheets) => {
  try {
    return await conn.db.connMongo.CastSheets.findByIdAndUpdate(id, updatedCastSheets)
  } catch (error) {
    magic.LogDanger('Cannot Update CastSheets', error)
    return { err: { code: 123, message: error } }
  }
}

exports.GetById = async (id) => {
  try {
    return await conn.db.connMongo.CastSheets.findById(id).populate('consumers')
  } catch (error) {
    magic.LogDanger('Cannot get the CastSheets by its ID', error)
    return { err: { code: 123, message: error } }
  }
}
