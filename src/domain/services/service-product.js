import enum_ from '../../utils/enum.js'
import { ResponseService, LogDanger } from '../../utils/magic.js'
import * as odmProduct from '../odm/odm-product.js'

export const GetAll = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    let respOdm = await odmProduct.GetAll()
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success GetAll Products'
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
    const { name, image, priceKg, priceKgSuplements, description } = req.body
    if ((name && image && priceKg && priceKgSuplements, description)) {
      let respOdm = await odmProduct.Create(name, image, priceKg, priceKgSuplements, description)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.message
        data = { name, image, priceKg, priceKgSuplements, description }
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Product created'
        data = respOdm
        statuscode = enum_.CODE_CREATED
      }
    } else {
      status = 'Failure'
      errorcode = enum_.ERROR_REQUIRED_FIELD
      message = `Date, consumerName and total are required: name=${name}, image=${image}, priceKg: ${priceKg}, priceKgSuplements: ${priceKgSuplements},  description: ${description}`
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
      let respOdm = await odmProduct.Delete(id)
      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Product deleted'
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

    if (id && req.body) {
      let respOdm = await odmProduct.Update(id, req.body)

      if (respOdm.err) {
        status = 'Failure'
        errorcode = respOdm.err.code
        message = respOdm.err.message
        statuscode = enum_.CODE_BAD_REQUEST
      } else {
        message = 'Product updated'
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
    let respOdm = await odmProduct.GetById(id)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting product'
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
    console.log('name', name)
    let respOdm = await odmProduct.GetByName(name)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Success getting the product'
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

export const ChangeAvailability = async (req, res) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}
  try {
    const { id } = req.params
    let respOdm = await odmProduct.ChangeAvailability(id)
    if (respOdm.err) {
      status = 'Failure'
      errorcode = respOdm.err.code
      message = respOdm.err.message
      statuscode = enum_.CODE_BAD_REQUEST
    } else {
      message = 'Availability updated'
      statuscode = enum_.CODE_OK
      data = respOdm
    }
    response = await ResponseService(status, errorcode, message, data)
    return res.status(statuscode).send(response)
  } catch (error) {
    LogDanger('error: ', error)
    response = await ResponseService('Failure', enum_.CODE_BAD_REQUEST, error, '')
    return res.status(enum_.CODE_INTERNAL_SERVER_ERROR).send(response)
  }
}
