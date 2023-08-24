const apiServices = require('../controller/index');

const routes = (app) => {
  app.use('/api/v1', apiServices);
};

module.exports = routes;