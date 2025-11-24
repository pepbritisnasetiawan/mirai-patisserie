/* eslint-env node */
/* global process */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { initSchema } from './db.js'
import products from './routes/products.js'
import reviews from './routes/reviews.js'
import orders from './routes/orders.js'
import auth from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(express.json({ limit: '5mb' }))
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',').map((s) => s.trim()) || '*',
  }),
)
app.use(morgan('tiny'))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', auth)
app.use('/api/products', products)
app.use('/api/reviews', reviews)
app.use('/api/orders', orders)

initSchema()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to init schema', err)
    process.exit(1)
  })
