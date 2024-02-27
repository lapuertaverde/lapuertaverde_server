import conn from '../repositories/mongo.repository.js'
import { LogDanger } from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    return await conn.connMongo.FinalRecord.find()
  } catch (error) {
    console.log(error)
    LogDanger('Cannot getAll final records', error)
    return { err: { code: 123, message: error } }
  }
}

export const Create = async ({
  date,
  consumer,
  deliveredKgs,
  supplementsKgs,
  priceKg,
  priceKgSuplements,
  totalEuros,
  products,
  box
}) => {
  try {
    console.log('box', box)
    const duplicatedFinalRecord = await conn.connMongo.FinalRecord.find({ date, consumer })
    if (duplicatedFinalRecord.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a final record with the same date and consumer"
      }
    } else {
      const data = await new conn.connMongo.FinalRecord({
        date,
        consumer,
        deliveredKgs,
        supplementsKgs,
        priceKg,
        priceKgSuplements,
        totalEuros,
        products,
        box
      })
      data.save()

      // Actualizamos el consumidor que ha realizado el pedido
      const consumerUpdate = await conn.connMongo.Consumer.findByIdAndUpdate(consumer, {
        $push: { orderInProgress: data._id }
      }).populate('consumerGroup')

      // Buscamos si hay una hoja de reparto para el grupo
      const castSheet = await conn.connMongo.CastSheets.findOne({
        castStatus: 'Previo',
        consumerGroup: consumerUpdate.consumerGroup._id
      })

      if (!castSheet) {
        // Creamos la hoja de reparto
        const newCastSheet = await new conn.connMongo.CastSheets({
          date,
          consumerGroup: consumerUpdate.consumerGroup._id,
          consumers: [consumer],
          deliveryAddress:
            consumerUpdate.consumerGroup.deliveryAddress || 'calle de los desamparados'
        })

        newCastSheet.save()

        // Metemos esta hoja de reparto en el grupo correspondiente
        await conn.connMongo.ConsumerGroup.findByIdAndUpdate(newCastSheet.consumerGroup, {
          $push: { castSheets: newCastSheet._id }
        })
      } else {
        // La hoja de reparto esta creada pero el consumidor no aparece en ella porque aun no ha hecho pedido
        if (!castSheet.consumers.find((idConsumer) => idConsumer == consumer)) {
          await conn.connMongo.CastSheets.findByIdAndUpdate(castSheet._id, {
            $push: { consumers: consumer }
          })
        }
      }
      return data
    }
  } catch (error) {
    LogDanger('Cannot Create final record', error)
    if (error.type === 'custom') {
      const { code, message } = error
      return { err: { code, message } }
    }
    return { err: { code: 123, message: error } }
  }
}

export const Delete = async (id) => {
  try {
    const finalRecordDeleted = await conn.connMongo.FinalRecord.findByIdAndDelete(id)

    await conn.connMongo.Consumer.updateOne({ records: id }, { $pull: { records: id } })
    await conn.connMongo.Consumer.updateOne(
      { orderInProgress: id },
      { $pull: { orderInProgress: id } }
    )
    if (finalRecordDeleted) return finalRecordDeleted
  } catch (error) {
    LogDanger('Cannot Delete final record', error)

    return { err: { code: 123, message: error } }
  }
}

export const Update = async ({
  id,
  date,
  consumer,
  deliveredKgs,
  supplementsKgs,
  priceKg,
  priceKgSuplements,
  totalEuros,
  products,
  box
}) => {
  try {
    const record = await conn.connMongo.FinalRecord.findById(id)

    if (!record.active) {
      LogDanger('Cannot Update finalRecord')
      return { err: { code: 123, message: 'Cannot Update finalRecord' } }
    }
    return await conn.connMongo.FinalRecord.findByIdAndUpdate(id, {
      date,
      consumer,
      deliveredKgs,
      supplementsKgs,
      priceKg,
      priceKgSuplements,
      totalEuros,
      products,
      box
    })
  } catch (error) {
    LogDanger('Cannot Update finalRecord', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.FinalRecord.findById(id)
  } catch (error) {
    LogDanger('Cannot get the final record by its ID', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetByIdAndDate = async (id, date) => {
  try {
    return await conn.connMongo.FinalRecord.find({ id, date }) //.populate('registers')
  } catch (error) {
    LogDanger('Cannot get the final record by its date', error)
    return { err: { code: 123, message: error } }
  }
}

export const ChangeActive = async (id) => {
  try {
    const record = await conn.connMongo.FinalRecord.findById(id)

    if (record.active) {
      await conn.connMongo.FinalRecord.findByIdAndUpdate(id, { active: false })
    } else {
      await conn.connMongo.FinalRecord.findByIdAndUpdate(id, { active: true })
    }
    return await conn.connMongo.FinalRecord.findById(id)
  } catch (error) {
    LogDanger('Cannot get the final record by its date', error)
    return { err: { code: 123, message: error } }
  }
}
