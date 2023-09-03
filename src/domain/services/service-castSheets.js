const magic = require('../../utils/magic')
const enum_ = require('../../utils/enum')
const ormCastSheets = require('../orm/orm-castSheets')

exports.GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    let respOrm = await ormCastSheets.GetAll()
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll CastSheets'
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
    const { date, consumerGroup, consumers, deliveryAddress, castStatus } = req.body
    if (date && consumerGroup) {
      let respOrm = await ormCastSheets.Create(
        date,
        consumerGroup,
        consumers,
        deliveryAddress,
        castStatus
      )
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.message
        data = { date, consumerGroup, consumers, deliveryAddress, castStatus }
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'CastSheet created'
        data = respOrm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = `Date and consumerGroup are required: date=${date},consumerGroup=${consumerGroup}`
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
      let respOrm = await ormCastSheets.Delete(id)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'CastSheet deleted'
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
    const { date, consumers, consumerGroup, castStatus, deliveryAddress } = req.body

    const updatedCastSheets = {
      date,
      consumers,
      consumerGroup,
      castStatus,
      deliveryAddress,
      _id: id
    }

    if (id && updatedCastSheets) {
      let respOrm = await ormCastSheets.Update(id, updatedCastSheets)

      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Castsheet updated'
        statuscode = enum_.CODE_OK
        data = updatedCastSheets
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
    let respOrm = await ormCastSheets.GetById(id)
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the card'
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
