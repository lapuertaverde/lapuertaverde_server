import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    const result = await conn.connMongo.ConsumerGroup.find()
      .populate('castSheets')
      .populate('consumers')
      .populate({
        path: 'consumers',
        populate: { path: 'favorites' }
      })
      .populate({
        path: 'consumers',
        populate: { path: 'bills' }
      })
      .populate({
        path: 'consumers',
        populate: { path: 'discarded' }
      })
      .populate({
        path: 'consumers',
        populate: { path: 'records' }
      })
    // .populate({
    //   path: 'consumers',
    //   populate: { path: 'weeklyLog' }
    // })

    return result
  } catch (error) {
    LogDanger('Cannot getAll consumer group', error)
    return { err: { code: 123, message: error } }
  }
}

export const Create = async (name, consumers, castSheets) => {
  try {
    const duplicatedGroup = await conn.connMongo.ConsumerGroup.find({ name })
    if (duplicatedGroup.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a consumers group with the same name"
      }
    } else {
      const data = await new conn.connMongo.ConsumerGroup({
        name,
        consumers,
        castSheets
      })
      data.save()
      return data
    }
  } catch (error) {
    LogDanger('Cannot Create castsheet', error)
    if (error.type === 'custom') {
      const { code, message } = error
      return { err: { code, message } }
    }
    return { err: { code: 123, message: error } }
  }
}

export const Delete = async (id) => {
  try {
    return await conn.connMongo.ConsumerGroup.findByIdAndDelete(id)
  } catch (error) {
    LogDanger('Cannot Delete deck', error)
    return { err: { code: 123, message: error } }
  }
}

export const Update = async (id, body) => {
  try {
    const groupDB = await conn.connMongo.ConsumerGroup.findById(id)

    const consumerGroup = {
      name: body.name ? body.name : groupDB.name,
      castSheets: body.castSheets ? body.castSheets : groupDB.castSheets,
      consumers: body.consumers ? [...groupDB.consumers, body.consumers] : groupDB.consumers,
      _id: id,
      deliveryAddress: body.deliveryAddress ? body.deliveryAddress : groupDB.deliveryAddress
    }
    await conn.connMongo.ConsumerGroup.findByIdAndUpdate(id, consumerGroup)

    return await conn.connMongo.ConsumerGroup.findById(id)
  } catch (error) {
    LogDanger('Cannot Update consumer group', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.ConsumerGroup.findById(id).populate('consumers')
  } catch (error) {
    LogDanger('Cannot get the consumer group by its ID', error)
    return { err: { code: 123, message: error } }
  }
}
