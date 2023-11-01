import enum_ from '../../utils/enum'

export const resManager = (respOrm) => {
  let status = 'Success'
  let errorcode = ''
  let message = ''
  let data = ''
  let statuscode = 0
  let response = {}

  if (respOrm.err) {
    status = 'Failure'
    errorcode = respOrm.err.code
    message = respOrm.err.messsage
    statuscode = enum_.CODE_BAD_REQUEST
  } else {
    if (Object.keys(respOrm).length > 0) {
      message = 'Consumer updated'
      statuscode = enum_.CODE_OK
      data = respOrm
    } else {
      message = 'You are not authorized'
      statuscode = enum_.CODE_UNAUTHORIZED
    }
  }
}
