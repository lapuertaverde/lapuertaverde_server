const magic = require('../../utils/magic')
const enum_ = require('../../utils/enum')
const ormConsumerGroup = require('../orm/orm-consumerGroup')

exports.GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}

  try {
    let respOrm = await ormConsumerGroup.GetAll()
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll consumer groups'
      data = respOrm
      statuscode = data.length > 0 ? enum_.CODE_OK : enum_.CODE_NO_CONTENT
    }
    response = await magic.ResponseService(status, errorcode, message, data)

    return res.status(statuscode).send(response)
  } catch (error) {
    magic.LogDanger('error: ', error)
    response = await magic.ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, 'JODIDO')
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
    const { name, consumers, castSheets } = req.body
    if (name) {
      let respOrm = await ormConsumerGroup.Create(name, consumers, castSheets)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Consumer Group created'
        data = respOrm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = 'All fields are required'
      statuscode = enum_.CODE_BAD_REQUEST
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
      let respOrm = await ormConsumerGroup.Delete(id)
      if (respOrm.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Consumer Group deleted'
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
    const { name, castSheets, consumers } = req.body
    const updatedConsumerGroup = {
      name,
      castSheets,
      consumers,
      _id: id
    }

    if (id && updatedConsumerGroup) {
      let respOrm = await ormConsumerGroup.Update(id, updatedConsumerGroup)
     
      if (respOrm?.err) {
        status = 'Failure'
        errorcode = respOrm.err.code
        message = respOrm.err.messsage
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'consumer group updated'
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

exports.GetById = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id } = req.params
   
    let respOrm = await ormConsumerGroup.GetById(id)
   
    if (respOrm.err) {
      status = 'Failure'
      errorcode = respOrm.err.code
      message = respOrm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the consumer group'
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
