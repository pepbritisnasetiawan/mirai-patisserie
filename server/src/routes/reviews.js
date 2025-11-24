import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'
import { pool } from '../db.js'

const router = Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100')
  res.json(rows)
})

router.post(
  '/',
  limiter,
  body('name').isString().trim().isLength({ min: 1, max: 120 }),
  body('city').optional().isString().trim().isLength({ max: 120 }),
  body('text').isString().trim().isLength({ min: 5, max: 1000 }),
  body('rating').isInt({ min: 1, max: 5 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, city, text, rating } = req.body
    const result = await pool.query(
      `INSERT INTO reviews (name, city, text, rating) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, city || '', text, rating],
    )
    res.json(result.rows[0])
  },
)

export default router
