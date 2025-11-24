import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { pool } from '../db.js'
import rateLimit from 'express-rate-limit'

const router = Router()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

router.post(
  '/',
  limiter,
  body('items').isArray({ min: 1 }),
  body('contact.name').isString().trim().isLength({ min: 1 }),
  body('contact.phone').isString().trim().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const payload = req.body.items
    const contact = req.body.contact
    const result = await pool.query(
      `INSERT INTO orders (payload, contact) VALUES ($1,$2) RETURNING *`,
      [payload, contact],
    )
    // TODO: integrate email / WhatsApp notifications via provider
    res.json(result.rows[0])
  },
)

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100')
  res.json(rows)
})

export default router
