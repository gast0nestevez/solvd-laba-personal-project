import { Router } from 'express'
import authRoutes from './auth.routes.js'
import routesRoutes from './route.routes.js'
import airportRoutes from './airport.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/routes', routesRoutes)
router.use('/airports', airportRoutes)

export default router
