import enum_ from '../../utils/enum.js'
import { ResponseService, LogDanger } from '../../utils/magic.js'
import * as odmBill from '../odm/odm-bill.js'

export const GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    let respOdm = await odmBill.GetAll()
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll Bills'
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
    const { date, consumerName, total, billStatus } = req.body
    if (date && consumerName && total) {
      let respOdm = await odmBill.Create(date, consumerName, total, billStatus)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.message
        data = { date, consumerName, total, billStatus }
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Bill created'
        data = respOdm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = `Date, consumerName and total are required: date=${date},consumerName=${consumerName}, total: ${total}`
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
      let respOdm = await odmBill.Delete(id)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Bill deleted'
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
    const { date, consumerName, total, billStatus } = req.body

    const updatedBill = {
      date,
      consumerName,
      total,
      billStatus,
      _id: id
    }

    if (id && updatedBill) {
      let respOdm = await odmBill.Update(id, updatedBill)

      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Bill updated'
        statuscode = enum_.CODE_OK
        data = updatedBill
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
    let respOdm = await odmBill.GetById(id)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting bill'
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

export const GetByIdAndDate = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id, date } = req.params
    let respOdm = await odmBill.GetByIdAndDate(id, date)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting bill'
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
