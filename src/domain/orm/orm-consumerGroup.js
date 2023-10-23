import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    const result = await conn.connMongo.ConsumerGroup.find()
      .populate('castSheets')
      .populate('consumers')

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

export const Update = async (id, consumerGroup) => {
  try {
    return await conn.connMongo.ConsumerGroup.findByIdAndUpdate(id, consumerGroup)
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
