import dotenv from 'dotenv'
import { verifyToken } from '../utils/jwt.js'

dotenv.config()

const parseBearer = header => {
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  return token
}

export function adminOnly(req, res, next) {
  try {
    const token = parseBearer(req.headers.authorization)
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' })

    const payload = verifyToken(token, { secret: process.env.JWT_SECRET })
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' })
    }

    // attach useful info for auditing
    req.user = { sub: payload.sub, role: payload.role }
    next()
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Unauthorized' })
  }
}
