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
    return await conn.connMongo.Consumer.findById(id)
      .populate('bills')
      .populate({
        path: 'weeklyLog',
        populate: { path: 'products' }
      })
      .populate({
        path: 'orderInProgress',
        populate: { path: 'products' }
      })
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

export const LikeProduct = async (id, idProduct) => {
  try {
    const consumer = await conn.connMongo.Consumer.findById(id)

    if (consumer.favorites.includes(idProduct)) {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $pull: { favorites: idProduct } })
      await conn.connMongo.Product.findByIdAndUpdate(idProduct, { $pull: { likes: id } })
    } else {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $push: { favorites: idProduct } })
      await conn.connMongo.Product.findByIdAndUpdate(idProduct, { $push: { likes: id } })
    }

    if (consumer.discarded?.includes(idProduct)) {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $pull: { discarded: idProduct } })
      await conn.connMongo.Product.findByIdAndUpdate(idProduct, { $pull: { discarded: id } })
    }
    return await conn.connMongo.Consumer.findById(id).populate('favorites')
  } catch (error) {
    LogDanger('Cannot get the consumer by its id', error)
    return { err: { code: 123, message: error } }
  }
}

export const DiscartProduct = async (id, idProduct) => {
  try {
    const consumer = await conn.connMongo.Consumer.findById(id)

    if (consumer.discarded.includes(idProduct)) {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $pull: { discarded: idProduct } })
      await conn.connMongo.Product.findByIdAndUpdate(idProduct, { $pull: { discarded: id } })
    } else {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $push: { discarded: idProduct } })
      await conn.connMongo.Product.findByIdAndUpdate(idProduct, { $push: { discarded: id } })
    }

    if (consumer.favorites?.includes(idProduct)) {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $pull: { favorites: idProduct } })
      await conn.connMongo.Product.findByIdAndUpdate(idProduct, { $pull: { likes: id } })
    }
    return await conn.connMongo.Consumer.findById(id).populate('discarded')
  } catch (error) {
    LogDanger('Cannot get the consumer by its id', error)
    return { err: { code: 123, message: error } }
  }
}

export const RecordLike = async (id, idRecord) => {
  try {
    const consumer = await conn.connMongo.Consumer.findById(id)

    if (consumer.orderFavs.includes(idRecord)) {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $pull: { orderFavs: idRecord } })
      await conn.connMongo.FinalRecord.findByIdAndUpdate(idRecord, { like: false })
    } else {
      await conn.connMongo.Consumer.findByIdAndUpdate(id, { $push: { orderFavs: idRecord } })
      await conn.connMongo.FinalRecord.findByIdAndUpdate(idRecord, { like: true })
    }

    return await conn.connMongo.Consumer.findById(id).populate('orderFavs')
  } catch (error) {
    LogDanger('Cannot get the consumer by its id', error)
    return { err: { code: 123, message: error } }
  }
}
