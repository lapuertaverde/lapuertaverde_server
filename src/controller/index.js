import express from 'express'
const router = express.Router()
import * as consumer from '../domain/services/service-consumer.js'
import * as consumerGroup from '../domain/services/service-consumerGroup.js'
import * as castSheets from '../domain/services/service-castSheets.js'
import * as bill from '../domain/services/service-bill.js'
import * as finalRecord from '../domain/services/service-finalRecord.js'
import * as user from '../domain/services/service-user.js'
import { isAuth } from '../middlewares/auth.middleware.js'

router.get('/consumer', [isAuth], consumer.GetAll)
router.post('/consumer', consumer.Create)
router.delete('/consumer/:id', consumer.Delete)
router.patch('/consumer/:id', consumer.Update)
router.get('/consumer/:id', consumer.GetById)
router.get('/consumer/name/:name', consumer.GetByName)

router.get('/consumerGroup', [isAuth], consumerGroup.GetAll)
router.post('/consumerGroup', consumerGroup.Create)
router.delete('/consumerGroup/:id', consumerGroup.Delete)
router.patch('/consumerGroup/:id', consumerGroup.Update)
router.get('/consumerGroup/:id', consumerGroup.GetById)

router.post('/user/login', user.Login)
router.get('/user', user.GetAll)
router.post('/user', user.Create)
router.delete('/user/:id', user.Delete)
router.patch('/user/:id', user.Update)
router.get('/user/:id', user.GetById)

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

router.get('/finalRecord', finalRecord.GetAll)
router.post('/finalRecord', finalRecord.Create)
router.delete('/finalRecord/:id', finalRecord.Delete)
router.patch('/finalRecord/:id', finalRecord.Update)
router.get('/finalRecord/:id', finalRecord.GetById)
router.get('/finalRecord/date/:date/:id', finalRecord.GetByIdAndDate)

export default router
