const conn = require('../repositories/mongo.repository')
const magic = require('../../utils/magic')

exports.GetAll = async () => {
  try {
    return await conn.db.connMongo.Bill.find()
  } catch (error) {
    console.log(error)
    magic.LogDanger('Cannot getAll bills', error)
    return { err: { code: 123, message: error } }
  }
}

exports.Create = async (date, consumerName, total, billStatus) => {
  try {
    const duplicatedBill = await conn.db.connMongo.Bill.find({ date, consumerName })
    if (duplicatedBill.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a bill with the same date and consumer"
      }
    } else {
      const data = await new conn.db.connMongo.Bill({
        date,
        consumerName,
        total,
        billStatus
      })
      data.save()
      return data
    }
  } catch (error) {
    magic.LogDanger('Cannot Create bill', error)
    if (error.type === 'custom') {
      const { code, message } = error
      return { err: { code, message } }
    }
    return { err: { code: 123, message: error } }
  }
}

exports.Delete = async (id) => {
  try {
    const billDeleted = await conn.db.connMongo.Bill.findByIdAndDelete(id)
    if (billDeleted) return billDeleted
  } catch (error) {
    magic.LogDanger('Cannot Delete CastSheets', error)

    return { err: { code: 123, message: error } }
  }
}

exports.Update = async (id, updatedBill) => {
  try {
    return await conn.db.connMongo.Bill.findByIdAndUpdate(id, updatedBill)
  } catch (error) {
    magic.LogDanger('Cannot Update bill', error)
    return { err: { code: 123, message: error } }
  }
}

exports.GetById = async (id) => {
  try {
    return await conn.db.connMongo.Bill.findById(id) //.populate('registers')
  } catch (error) {
    magic.LogDanger('Cannot get the CastSheets by its ID', error)
    return { err: { code: 123, message: error } }
  }
}

exports.GetByIdAndDate = async (id, date) => {
  try {
    return await conn.db.connMongo.Bill.find({ id, date }) //.populate('registers')
  } catch (error) {
    magic.LogDanger('Cannot get the CastSheets by its date', error)
    return { err: { code: 123, message: error } }
  }
}