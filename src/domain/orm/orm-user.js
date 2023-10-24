import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    return await conn.connMongo.User.find()
  } catch (error) {
    LogDanger('Cannot get All consumers', error)
  }
}

export const Create = async ({ name, password, avatar }) => {
  try {
    const data = await new conn.connMongo.User({
      name,
      password,
      avatar
    })
    data.save()

    return data
  } catch (error) {
    LogDanger('Cannot Create consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const Delete = async (id) => {
  try {
    return await conn.connMongo.User.deleteOne({ _id: id })
  } catch (error) {
    LogDanger('Cannot Delete consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const Update = async (id, { name, password, avatar }) => {
  try {
    return await conn.connMongo.User.findByIdAndUpdate(id, { name, password, avatar })
  } catch (error) {
    LogDanger('Cannot Update consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.User.findById(id)
  } catch (error) {
    LogDanger('Cannot get the consumer by its ID', error)
    return { err: { code: 123, message: error } }
  }
}
