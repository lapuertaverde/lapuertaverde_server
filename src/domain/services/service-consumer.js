import { LogDanger, ResponseService } from '../../utils/magic.js'
import enum_ from '../../utils/enum.js'
import * as ormConsumer from '../orm/orm-consumer.js'

export const GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}

  try {
    let respOrm = await ormConsumer.GetAll()
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll Users'
      data = respOrm
      statuscode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    LogDanger('error: ', error)
    response = await ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}

export const Create = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const {
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
    } = req.body

    if (name && email && CP && phone && consumerGroup && address && KgByDefault && active) {
      let respOrm = await ormConsumer.Create({
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
      })
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Consumer created'
        data = respOrm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = 'Maybe you forgot a mandatory field'
      statuscode = enum_.CODE_BAD_REQUEST
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (err) {
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

export const Delete = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { id } = req.params
    if (id) {
      let respOrm = await ormConsumer.Delete(id)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'User deleted'
        statuscode = enum_.CODE_OK
        data = respOrm
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = 'id does not exist'
      statuscode = enum_.CODE_UNPROCESSABLE_ENTITY
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (err) {
    console.log('err = ', err)
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}
export const Update = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { id } = req.params
    const { name, address, email, phone, consumerGroup } = req.body
    const updatedConsumer = {
      name,
      address,
      email,
      phone,
      consumerGroup,
      _id: id
    }

    if (id && updatedConsumer) {
      let respOrm = await ormConsumer.Update(id, updatedConsumer)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        // console.log('resporm: ' + respOrm);

        if (Object.keys(respOrm).length) {
          message = 'Consumer updated'
          statuscode = enum_.CODE_OK
          data = updatedConsumer
        } else {
          message = 'You are not authorized to update this user'
          statuscode = enum_.CODE_UNAUTHORIZED
        }
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = 'id does not exist'
      statuscode = enum_.CODE_UNPROCESSABLE_ENTITY
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (err) {
    console.log('err = ', err)
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

export const GetById = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id } = req.params
    let respOrm = await ormConsumer.GetById(id)
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the consumer'
      data = respOrm
      statuscode = data ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    LogDanger('error: ', error)
    response = await ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}

export const GetByName = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { name } = req.params
    let respOrm = await ormConsumer.GetByName(name)
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the consumer'
      data = respOrm
      statuscode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    LogDanger('error: ', error)
    response = await ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}
