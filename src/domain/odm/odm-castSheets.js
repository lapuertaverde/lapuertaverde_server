import conn from '../repositories/mongo.repository.js'
import magic from '../../utils/magic.js'

export const GetAll = async () => {
  try {
    return await conn.connMongo.CastSheets.find().populate('consumers')
  } catch (error) {
    magic.LogDanger('Cannot getAll castsheets', error)
    return { err: { code: 123, message: error } }
  }
}

export const Create = async (date, consumerGroup, consumers, deliveryAddress, castStatus) => {
  try {
    const duplicatedCastSheets = await conn.connMongo.CastSheets.find({ date, consumerGroup })
    if (duplicatedCastSheets.length > 0) {
      throw {
        type: 'custom',
        code: 'duplicatedNotAllowed',
        message: "You can't create a castsheet with the same date and group"
      }
    } else {
      const data = await new conn.connMongo.CastSheets({
        date,
        consumerGroup,
        consumers,
        deliveryAddress,
        castStatus
      })
      data.save()
      return data
    }
  } catch (error) {
    magic.LogDanger('Cannot Create castsheet', error)
    if (error.type === 'custom') {
      const { code, message } = error
      return { err: { code, message } }
    }
    return { err: { code: 123, message: error } }
  }
}

export const Delete = async (id) => {
  try {
    const castsheetDeleted = await conn.connMongo.CastSheets.findByIdAndDelete(id)
    if (castsheetDeleted) return castsheetDeleted
  } catch (error) {
    magic.LogDanger('Cannot Delete CastSheets', error)

    return { err: { code: 123, message: error } }
  }
}

export const Update = async (id, updatedCastSheets) => {
  try {
    return await conn.connMongo.CastSheets.findByIdAndUpdate(id, updatedCastSheets)
  } catch (error) {
    magic.LogDanger('Cannot Update CastSheets', error)
    return { err: { code: 123, message: error } }
  }
}

export const GetById = async (id) => {
  try {
    return await conn.connMongo.CastSheets.findById(id).populate('consumers')
  } catch (error) {
    magic.LogDanger('Cannot get the CastSheets by its ID', error)
    return { err: { code: 123, message: error } }
  }
}

export const ChangeStatus = async (id) => {
  try {
    const castSheets = await conn.connMongo.CastSheets.findById(id)
      .populate('bills')
      .populate({
        path: 'consumers',
        populate: { path: 'orderInProgress' }
      })
      .populate({
        path: 'consumers',
        populate: { path: 'weeklyLog' }
      })

    // Depende del status hará una cosa u otra
    if (castSheets.castStatus === 'Previo') {
      // Lo cambiamos a "Repartido"

      await conn.connMongo.CastSheets.findByIdAndUpdate(id, { castStatus: 'Repartido' })

      for (const consumer of castSheets.consumers) {
        // Por cada consumidor de esta ruta hay que ver sus registros en curso y crear una bill
        // cada bill generada se meterá en el campo bills de esta hoja de reparto

        const newBill = await new conn.connMongo.Bill({
          date: castSheets.date,
          consumerName: consumer.name,
          consumer: consumer._id,
          total: 0
        })

        await newBill.save()
        let total = 0

        // Actualizamos hoja de reparto
        await conn.connMongo.CastSheets.findByIdAndUpdate(id, { $push: { bills: newBill._id } })

        // Actualizamos al consumer
        await conn.connMongo.Consumer.findByIdAndUpdate(consumer._id, {
          $push: { bills: newBill._id }
        })

        for (const order of consumer.orderInProgress) {
          total += order.totalEuros

          //  Cambiamos los pedidos en curso a pedidos en el consumer
          await conn.connMongo.Consumer.findByIdAndUpdate(consumer._id, {
            $push: { weeklyLog: order._id },
            $pull: { orderInProgress: order._id }
          })

          // Metemos los pedidos en la bill generada
          await conn.connMongo.Bill.findByIdAndUpdate(newBill._id, {
            $push: { registers: order._id }
          })

          // Metemos la factura en el pedido correspondiente
          await conn.connMongo.FinalRecord.findByIdAndUpdate(order._id, {
            $push: { bill: newBill._id }
          })
        }

        await conn.connMongo.Bill.findByIdAndUpdate(newBill._id, { total: total })
      }
      return await conn.connMongo.CastSheets.findById(id).populate('consumers')
    } else {
      // cambiamos el status a "Previo"
      // Ya se han generado las bill, hay que borrarlas y devolver los pedidos a orderInProgress
      await conn.connMongo.CastSheets.findByIdAndUpdate(id, { castStatus: 'Previo' })

      for (const bill of castSheets.bills) {
        await conn.connMongo.Consumer.updateOne(
          { bills: bill._id },
          {
            $pull: { bills: bill._id }
          }
        )

        // Actualizamos hoja de reparto
        await conn.connMongo.CastSheets.findByIdAndUpdate(id, {
          $pull: { bills: bill._id }
        })

        // Actualizamos pedido que tienen esta factura
        await conn.connMongo.FinalRecord.updateOne(
          { bill: bill._id },
          {
            $pull: { bill: bill._id }
          }
        )

        // Recorremos pedidos y por cada uno actualizamos al consumer

        for (const register of bill.registers) {
          await conn.connMongo.Consumer.updateOne(
            { weeklyLog: register },
            {
              $pull: { weeklyLog: register },
              $push: { orderInProgress: register }
            }
          )
        }

        // Borramos esta bill
        await conn.connMongo.Bill.findByIdAndDelete(bill._id)
      }
      return await conn.connMongo.CastSheets.findById(id).populate('consumers')
    }
  } catch (error) {
    magic.LogDanger('Cannot update castSheets status', error)
    return { err: { code: 123, message: error } }
  }
}

export const CastSheetsWithActiveRecord = async (id) => {
  try {
    const castSheets = await conn.connMongo.CastSheets.findById(id).populate({
      path: 'consumers',
      populate: { path: 'orderInProgress' }
    })

    const activeRecord = []
    for (const consumer of castSheets.consumers) {
      for (const record of consumer.orderInProgress) {
        record.active && activeRecord.push(record)
      }
    }

    if (!activeRecord.length <= 0) {
      return await activeRecord
    } else {
      magic.LogDanger('Cannot found active record')
      return { err: { code: 123, message: 'Cannot found active record' } }
    }
  } catch (error) {
    magic.LogDanger('Cannot get the active record in CastSheets by its ID', error)
    return { err: { code: 123, message: error } }
  }
}
