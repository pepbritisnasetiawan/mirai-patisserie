import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { issueToken } from '../middleware/auth.js'

const router = Router()

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1 LIMIT 1', [email.toLowerCase()])
    if (!rows.length) return res.status(401).json({ error: 'invalid credentials' })
    const admin = rows[0]
    const ok = await bcrypt.compare(password, admin.password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })
    const token = issueToken(admin)
    res.json({ token, email: admin.email })
  },
)

router.post(
  '/bootstrap',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    const exists = await pool.query('SELECT 1 FROM admins LIMIT 1')
    if (exists.rows.length) return res.status(400).json({ error: 'already initialized' })
    const hash = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email.toLowerCase(), hash])
    return res.json({ ok: true })
  },
)

export default router
