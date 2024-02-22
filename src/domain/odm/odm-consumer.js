import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    return await conn.connMongo.Consumer.find().populate('consumerGroup')
  } catch (error) {
    LogDanger('Cannot get All consumers', error)
  }
}

export const Create = async ({
  name,
  email,
  dni,
  CP,
  phone,
  consumerGroup,
  address,
  KgByDefault,
  weeklyLog,
  monthlyBills,
  favorites,
  discarded,
  active
}) => {
  try {
    const avatar = name[0].toUpperCase()
    const data = await new conn.connMongo.Consumer({
      name,
      email,
      dni,
      CP,
      phone,
      consumerGroup,
      address,
      KgByDefault,
      weeklyLog,
      monthlyBills,
      favorites,
      discarded,
      active,
      avatar
    })

    data.save()

    if (consumerGroup) {
      const consumerGroupToUpdate = await conn.connMongo.ConsumerGroup.findById(consumerGroup)
      //Suponiendo que un consumidor no pueda estar en dos grupos a la vez

      await conn.connMongo.ConsumerGroup.findByIdAndUpdate(consumerGroupToUpdate._id, {
        $push: { consumers: data._id }
      })
    }

    const newUser = await conn.connMongo.User({
      name,
      password: password || name,
      email,
      role: 'Consumer',
      avatar
    })

    newUser.save()

    return data
  } catch (error) {
    LogDanger('Cannot Create consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const Delete = async (id) => {
  try {
    return await conn.connMongo.Consumer.deleteOne({ _id: id })
  } catch (error) {
    LogDanger('Cannot Delete consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const Update = async (id, updatedUser) => {
  try {
    return await conn.connMongo.Consumer.findByIdAndUpdate(id, updatedUser)
  } catch (error) {
    LogDanger('Cannot Update consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.Consumer.findById(id).populate('bills weeklyLog orderInProgress')
  } catch (error) {
    LogDanger('Cannot get the consumer by its ID', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetByName = async (name) => {
  try {
    return await conn.connMongo.Consumer.find({ name })
  } catch (error) {
    LogDanger('Cannot get the consumer by its name', error)
    return { err: { code: 123, message: error } }
  }
}
