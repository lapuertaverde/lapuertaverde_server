const magic = require('../../utils/magic')
const enum_ = require('../../utils/enum')
const ormBill = require('../orm/orm-bill')

exports.GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    let respOrm = await ormBill.GetAll()
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll Bills'
      data = respOrm
      statuscode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await magic.ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    magic.LogDanger('error: ', error)
    response = await magic.ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}

exports.Create = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { date, consumerName, total, billStatus } = req.body
    if (date && consumerName && total) {
      let respOrm = await ormBill.Create(date, consumerName, total, billStatus)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.message
        data = { date, consumerName, total, billStatus }
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Bill created'
        data = respOrm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = `Date, consumerName and total are required: date=${date},consumerName=${consumerName}, total: ${total}`
      statuscode = enum_.CODE_BAD_REQUEST
    }
    response = await magic.ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (err) {
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

exports.Delete = async (req, res) => {
  let status = 'Success',
    errorcode = '',
    message = '',
    data = '',
    statuscode = 0,
    response = {}
  try {
    const { id } = req.params
    if (id) {
      let respOrm = await ormBill.Delete(id)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Bill deleted'
        statuscode = enum_.CODE_OK
        data = respOrm
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = 'id does not exist'
      statuscode = enum_.CODE_UNPROCESSABLE_ENTITY
    }
    response = await magic.ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (err) {
    console.log('err = ', err)
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

exports.Update = async (req, res) => {
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
      let respOrm = await ormBill.Update(id, updatedBill)

      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.message
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
    response = await magic.ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (err) {
    console.log('err = ', err)
    return res
      .status(enum_.CODE_INTERNAL_SERVER_ERROR)
      .send(await magic.ResponseService('Failure', enum_.CRASH_LOGIC, 'err', ''))
  }
}

exports.GetById = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id } = req.params
    let respOrm = await ormBill.GetById(id)
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting bill'
      data = respOrm
      statuscode = data ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await magic.ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    magic.LogDanger('error: ', error)
    response = await magic.ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}

exports.GetByIdAndDate = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id, date } = req.params
    let respOrm = await ormBill.GetByIdAndDate(id, date)
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting bill'
      data = respOrm
      statuscode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await magic.ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    magic.LogDanger('error: ', error)
    response = await magic.ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}
