import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { getRoutes, createRoute } from '../controllers/route.controller.js'

const router = Router()

router.get('/', getRoutes)
router.post('/', adminOnly, createRoute)

export default router
