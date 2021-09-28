import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import './models/userModel.js'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import path from 'path'
dotenv.config()
connectDB()

import middlewares from './middlewares.js'
import api from './api/index.js'
const app = express()

//for image uploads
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
//end

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  })
})

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
