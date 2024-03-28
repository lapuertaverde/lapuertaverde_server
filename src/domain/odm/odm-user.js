import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const Login = async ({ email, password }) => {
  try {
    const userInfo = await conn.connMongo.User.findOne({
      email
    })

    if (password === userInfo.password) {
      const token = jwt.sign(
        {
          id: userInfo._id,
          email: userInfo.email,
          role: userInfo.role
        },
        process.env.SECRET,
        { expiresIn: '8h' }
      )

      let consumer
      if (userInfo.role == 'Consumer') {
        consumer = await conn.connMongo.Consumer.findOne({
          email
        })
      }

      return { token, consumer: consumer?._id || '', role: userInfo.role || 'Consumer' }
    } else {
      return console.log('Incorrect password')
    }
  } catch (error) {
    LogDanger('Cannot log in the user', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetAll = async () => {
  try {
    return await conn.connMongo.User.find()
  } catch (error) {
    LogDanger('Cannot get All consumers', error)
  }
}

export const Create = async (user) => {
  try {
    const data = await new conn.connMongo.User(user)

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

export const Update = async (id, { name, password, avatar, role, priceKg }) => {
  try {
    return await conn.connMongo.User.findByIdAndUpdate(id, {
      name,
      password,
      avatar,
      role,
      priceKg
    })
  } catch (error) {
    LogDanger('Cannot Update consumer', error)
    return { err: { code: 123, message: error } }
  }
}

export const UpdatePrice = async (priceKg, priceFuel) => {
  try {
    return conn.connMongo.User.updateMany({ priceKg, priceFuel })
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
