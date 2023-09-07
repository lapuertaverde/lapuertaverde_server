const express = require('express')
const router = express.Router()
const consumer = require('../domain/services/service-consumer')
const consumerGroup = require('../domain/services/service-consumerGroup')
const castSheets = require('../domain/services/service-castSheets')
const bill = require('../domain/services/service-bill')

router.get('/consumer', consumer.GetAll)
router.post('/consumer', consumer.Create)
router.delete('/consumer/:id', consumer.Delete)
router.patch('/consumer/:id', consumer.Update)
router.get('/consumer/:id', consumer.GetById)
router.get('/consumer/name/:name', consumer.GetByName)

router.get('/consumerGroup', consumerGroup.GetAll)
router.post('/consumerGroup', consumerGroup.Create)
router.delete('/consumerGroup/:id', consumerGroup.Delete)
router.patch('/consumerGroup/:id', consumerGroup.Update)
router.get('/consumerGroup/:id', consumerGroup.GetById)

router.get('/castSheets', castSheets.GetAll)
router.post('/castSheets', castSheets.Create)
router.delete('/castSheets/:id', castSheets.Delete)
router.patch('/castSheets/:id', castSheets.Update)
router.get('/castSheets/:id', castSheets.GetById)

router.get('/bill', bill.GetAll)
router.post('/bill', bill.Create)
router.delete('/bill/:id', bill.Delete)
router.patch('/bill/:id', bill.Update)
router.get('/bill/:id', bill.GetById)
router.get('/bill/date/:date/:id', bill.GetByIdAndDate)

module.exports = router
