import express from 'express'
const router = express.Router()
import * as consumer from '../domain/services/service-consumer.js'
import * as consumerGroup from '../domain/services/service-consumerGroup.js'
import * as castSheets from '../domain/services/service-castSheets.js'
import * as bill from '../domain/services/service-bill.js'
import * as finalRecord from '../domain/services/service-finalRecord.js'
import * as user from '../domain/services/service-user.js'
import { isAuth } from '../middlewares/auth.middleware.js'
import isAdminAuth from '../middlewares/adminAuth.middleware.js'

router.get('/consumer', [isAdminAuth], consumer.GetAll)
router.post('/consumer', [isAdminAuth], consumer.Create)
router.delete('/consumer/:id', [isAdminAuth], consumer.Delete)
router.patch('/consumer/:id', [isAuth], consumer.Update)
router.get('/consumer/:id', [isAuth], consumer.GetById)
router.get('/consumer/name/:name', [isAuth], consumer.GetByName)

router.get('/consumerGroup', consumerGroup.GetAll)
router.post('/consumerGroup', [isAuth], consumerGroup.Create)
router.delete('/consumerGroup/:id', [isAuth], consumerGroup.Delete)
router.patch('/consumerGroup/:id', [isAuth], consumerGroup.Update)
router.get('/consumerGroup/:id', [isAuth], consumerGroup.GetById)

router.post('/user/login', user.Login)
router.get('/user', user.GetAll)
router.post('/user', user.Create)
router.delete('/user/:id', [isAuth], user.Delete)
router.patch('/user/:id', user.Update)
router.get('/user/:id', [isAuth], user.GetById)

router.get('/castSheets', [isAuth], castSheets.GetAll)
router.post('/castSheets', [isAuth], castSheets.Create)
router.delete('/castSheets/:id', [isAuth], castSheets.Delete)
router.patch('/castSheets/:id', [isAuth], castSheets.Update)
router.get('/castSheets/:id', [isAuth], castSheets.GetById)
router.patch('/castSheets/changeStatus/:id', [isAdminAuth], castSheets.ChangeStatus)

router.get('/bill', [isAuth], bill.GetAll)
router.post('/bill', [isAuth], bill.Create)
router.delete('/bill/:id', [isAuth], bill.Delete)
router.patch('/bill/:id', [isAuth], bill.Update)
router.get('/bill/:id', [isAuth], bill.GetById)
router.get('/bill/date/:date/:id', [isAuth], bill.GetByIdAndDate)

router.get('/finalRecord', [isAuth], finalRecord.GetAll)
router.post('/finalRecord', [isAuth], finalRecord.Create)
router.delete('/finalRecord/:id', [isAuth], finalRecord.Delete)
router.patch('/finalRecord/:id', [isAuth], finalRecord.Update)
router.get('/finalRecord/:id', [isAuth], finalRecord.GetById)
router.get('/finalRecord/date/:date/:id', [isAuth], finalRecord.GetByIdAndDate)

export default router
