import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { getAirports, createAirport } from '../controllers/airport.controller.js'

const router = Router()

router.get('/', getAirports)
router.post('/', adminOnly, createAirport)

export default router
