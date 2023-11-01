import { LogDanger, ResponseService } from '../../utils/magic.js'
import enum_ from '../../utils/enum.js'
import * as odmConsumerGroup from '../odm/odm-consumerGroup.js'

export const GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}

  try {
    let respOdm = await odmConsumerGroup.GetAll()
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll consumer groups'
      data = respOdm
      statuscode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await ResponseService(status, errorcode, message, data)

    return res.status(statuscode).send(response)
  } catch (error) {
    LogDanger('error: ', error)
    response = await ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, 'JODIDO')
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
    const { name, consumers, castSheets } = req.body
    if (name) {
      let respOdm = await odmConsumerGroup.Create(name, consumers, castSheets)
      if (respOdm.err) {
        console.log('respOdm.err', respOdm.err)
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        data = { name, consumers, castSheets }
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Consumer Group created'
        data = respOdm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = 'All fields are required'
      statuscode = enum_.CODE_BAD_REQUEST
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
      let respOdm = await odmConsumerGroup.Delete(id)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Consumer Group deleted'
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
    const { name, castSheets, consumers } = req.body
    const updatedConsumerGroup = {
      name,
      castSheets,
      consumers,
      _id: id
    }

    if (id && updatedConsumerGroup) {
      let respOdm = await odmConsumerGroup.Update(id, updatedConsumerGroup)

      if (respOdm?.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'consumer group updated'
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

export const GetById = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id } = req.params

    let respOdm = await odmConsumerGroup.GetById(id)

    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the consumer group'
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
