import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { createToken } from '../utils/jwt.js'
import pool from '../utils/db.js'

dotenv.config()

export const register = async (req, res) => {
  const { username, password } = req.body

  try {
    const hash = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
      [username, hash]
    )

    res.status(201).json({ message: 'Admin registered successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Error registering admin' })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await pool.query(
      'SELECT password_hash FROM admins WHERE username = $1',
      [username]
    )
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' })
    
    const password_hash_from_db = result.rows[0].password_hash
    const isValid = await bcrypt.compare(password, password_hash_from_db)
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' })
    
    const token = createToken(
      { sub: username, role: 'admin' },
      {
        secret: process.env.JWT_SECRET,
        expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN || '3600')
      }
    )
    res.json({ token })
  } catch (err) {
    throw new Error(`Error fetching admins table`)
  }
}