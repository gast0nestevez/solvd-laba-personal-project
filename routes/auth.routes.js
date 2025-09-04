import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { register, login } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', adminOnly, register)
router.post('/login', login)

export default router
