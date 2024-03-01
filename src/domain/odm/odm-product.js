import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    return await conn.connMongo.Product.find()
  } catch (error) {
    LogDanger('Cannot getAll product', error)
    return { err: { code: 123, message: error } }
  }
}

export const Create = async (name, image, priceKg, priceKgSuplements, description) => {
  try {
    const duplicatedBill = await conn.connMongo.Product.find({ name })
    if (duplicatedBill.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a bill with the same date and consumer"
      }
    } else {
      const nameLower = name.toLowerCase()
      const data = await new conn.connMongo.Product({
        name: nameLower,
        image,
        priceKg,
        priceKgSuplements,
        description
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
    const productDeleted = await conn.connMongo.Product.findByIdAndDelete(id)

    // Actualizamos los consumer que le han dados ha me gusta o descartado
    // Para que no desaparezca de los pedidos si un producto es borrado poner --> Este articulo ya no esta en stock
    await conn.connMongo.Consumer.updateMany({ favorites: id }, { $pull: { favorites: id } })
    await conn.connMongo.Consumer.updateMany({ discarded: id }, { $pull: { discarded: id } })
    if (productDeleted) return productDeleted
  } catch (error) {
    LogDanger('Cannot Delete product', error)

    return { err: { code: 123, message: error } }
  }
}

export const Update = async (id, body) => {
  try {
    const productDB = await conn.connMongo.Product.findById(id)

    if (!productDB) {
      LogDanger('Cannot Update product', { error: { code: 404, message: 'Product don`t found' } })
      return {
        err: { code: 123, message: { error: { code: 404, message: 'Product don`t found' } } }
      }
    }

    const updatedProduct = {
      name: body.name ? body.name : productDB.name,
      image: body.image ? body.image : productDB.image,
      priceKg: body.priceKg ? body.priceKg : productDB.priceKg,
      priceKgSuplements: body.priceKgSuplements
        ? body.priceKgSuplements
        : productDB.priceKgSuplements,
      description: body.description ? body.description : productDB.description,
      availability: body.availability
    }
    await conn.connMongo.Product.findByIdAndUpdate(id, updatedProduct)
    return await conn.connMongo.Product.findById(id)
  } catch (error) {
    LogDanger('Cannot Update product', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.Product.findById(id)
  } catch (error) {
    LogDanger('Cannot get the product by its ID', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetByName = async (name) => {
  try {
    return await conn.connMongo.Product.find({ name })
  } catch (error) {
    LogDanger('Cannot get the product by its name', error)
    return { err: { code: 123, message: error } }
  }
}

export const ChangeAvailability = async (id) => {
  try {
    const productDB = await conn.connMongo.Product.findById(id)

    if (productDB.availability) {
      await conn.connMongo.Product.findByIdAndUpdate(id, { availability: false })
    } else {
      await conn.connMongo.Product.findByIdAndUpdate(id, { availability: true })
    }

    return await conn.connMongo.Product.findById(id)
  } catch (error) {
    LogDanger('Cannot change the availability product', error)
    return { err: { code: 123, message: error } }
  }
}
