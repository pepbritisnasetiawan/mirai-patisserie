import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const validators = [
  body('name').isString().trim().isLength({ min: 1, max: 200 }),
  body('category').isString().trim().isLength({ min: 1, max: 100 }),
  body('price').isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('description').optional().isString(),
  body('ingredients').optional().isString(),
  body('image').optional().isString(),
  body('showOnHome').optional().isBoolean(),
]

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC')
  res.json(rows)
})

router.post('/', requireAuth, validators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, category, price, stock = 0, description, ingredients, image, showOnHome = false } = req.body
  const result = await pool.query(
    `INSERT INTO products (name, category, price, stock, description, ingredients, image, show_on_home)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [name, category, price, stock, description || '', ingredients || '', image || '', showOnHome],
  )
  res.json(result.rows[0])
})

router.put('/:id', requireAuth, validators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const id = Number(req.params.id)
  const { name, category, price, stock = 0, description, ingredients, image, showOnHome = false } = req.body
  const result = await pool.query(
    `UPDATE products
     SET name=$1, category=$2, price=$3, stock=$4, description=$5, ingredients=$6, image=$7, show_on_home=$8, updated_at=NOW()
     WHERE id=$9 RETURNING *`,
    [name, category, price, stock, description || '', ingredients || '', image || '', showOnHome, id],
  )
  if (!result.rows.length) return res.status(404).json({ error: 'not found' })
  res.json(result.rows[0])
})

router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING id', [id])
  if (!result.rows.length) return res.status(404).json({ error: 'not found' })
  res.json({ ok: true })
})

export default router
