import { Router } from 'express'
import airportRoutes from './airport.routes.js'
import routesRoutes from './route.routes.js'

const router = Router()

router.use('/airports', airportRoutes)
router.use('/routes', routesRoutes)

export default router
