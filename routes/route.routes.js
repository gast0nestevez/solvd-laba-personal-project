import { Router } from 'express'
import { getRoutes, createRoute } from '../controllers/route.controller.js'

const router = Router()

router.get('/', getRoutes)
router.post('/', createRoute)  // add auth middleware for admins

export default router
