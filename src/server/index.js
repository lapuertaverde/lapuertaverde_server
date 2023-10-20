import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from '../routes/index.js'
dotenv.config()
import compression from 'compression'

const app = express()

app.use(compression())

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('secretKey', process.env.SECRET_KEY_JWT)

routes(app)

app.disable('x-powered-by')

export default app
