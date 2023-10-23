import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    return await conn.connMongo.Bill.find()
  } catch (error) {
    console.log(error)
    LogDanger('Cannot getAll bills', error)
    return { err: { code: 123, message: error } }
  }
}

export const Create = async (date, consumerName, total, billStatus) => {
  try {
    const duplicatedBill = await conn.connMongo.Bill.find({ date, consumerName })
    if (duplicatedBill.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a bill with the same date and consumer"
      }
    } else {
      const data = await new conn.connMongo.Bill({
        date,
        consumerName,
        total,
        billStatus
      })
      data.save()
      return data
    }
  } catch (error) {
    LogDanger('Cannot Create bill', error)
    if (error.type === 'custom') {
      const { code, message } = error
      return { err: { code, message } }
    }
    return { err: { code: 123, message: error } }
  }
}

export const Delete = async (id) => {
  try {
    const billDeleted = await conn.connMongo.Bill.findByIdAndDelete(id)
    if (billDeleted) return billDeleted
  } catch (error) {
    LogDanger('Cannot Delete bill', error)

    return { err: { code: 123, message: error } }
  }
}

export const Update = async (id, updatedBill) => {
  try {
    return await conn.connMongo.Bill.findByIdAndUpdate(id, updatedBill)
  } catch (error) {
    LogDanger('Cannot Update bill', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.Bill.findById(id) //.populate('registers')
  } catch (error) {
    LogDanger('Cannot get the bill by its ID', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetByIdAndDate = async (id, date) => {
  try {
    return await conn.connMongo.Bill.find({ id, date }) //.populate('registers')
  } catch (error) {
    LogDanger('Cannot get the CastSheets by its date', error)
    return { err: { code: 123, message: error } }
  }
}
