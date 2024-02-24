import { LogDanger, ResponseService } from '../../utils/magic.js'
import enum_ from '../../utils/enum.js'
import * as odmConsumer from '../odm/odm-consumer.js'

export const GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}

  try {
    let respOdm = await odmConsumer.GetAll()
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll Users'
      data = respOdm
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

    if (name && email && CP && phone && consumerGroup && address && KgByDefault) {
      let respOdm = await odmConsumer.Create({
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
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Consumer created'
        data = respOdm
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
      let respOdm = await odmConsumer.Delete(id)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        console.log(respOdm)
        message = 'User deleted'
        statuscode = enum_.CODE_OK
        data = respOdm
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
      let respOdm = await odmConsumer.Update(id, updatedConsumer)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        // console.log('resporm: ' + respOdm);

        if (Object.keys(respOdm).length) {
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
    let respOdm = await odmConsumer.GetById(id)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the consumer'
      data = respOdm
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
    let respOdm = await odmConsumer.GetByName(name)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the consumer'
      data = respOdm
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

export const LikeProduct = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { id } = req.params
    const { idProduct } = req.body
    if (idProduct) {
      let respOdm = await odmConsumer.LikeProduct(id, idProduct)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Like product'
        statuscode = enum_.CODE_OK
        data = respOdm
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
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

export const DiscartProduct = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { id } = req.params
    const { idProduct } = req.body
    if (idProduct) {
      let respOdm = await odmConsumer.DiscartProduct(id, idProduct)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Discarded product'
        statuscode = enum_.CODE_OK
        data = respOdm
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
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

export const RecordLike = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { id } = req.params
    const { idRecord } = req.body
    if (idRecord) {
      let respOdm = await odmConsumer.RecordLike(id, idRecord)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Like record'
        statuscode = enum_.CODE_OK
        data = respOdm
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
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}
