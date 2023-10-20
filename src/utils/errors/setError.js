const setError = (code, message) => {
  const error = new Error()
  error.code = code
  error.message = message
  return error
}
export default setError
