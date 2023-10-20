import apiServices from '../controller/index.js'

const routes = (app) => {
  app.use('/api/v1', apiServices)
}

export default routes
