import { Router } from 'express'
import dotenv from 'dotenv'
import { createToken } from '../utils/jwt.js'

dotenv.config()

const router = Router()

router.post('/token', (req, res) => {
  const { username, password } = req.body || {}

  if (username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = createToken(
    { sub: username, role: 'admin' },
    {
      secret: process.env.JWT_SECRET,
      expiresInSeconds: parseInt(process.env.JWT_EXPIRES_IN || '3600')
    }
  )

  res.json({ token })
})

export default router
