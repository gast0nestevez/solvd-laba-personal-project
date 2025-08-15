import { Router } from 'express'
import { getAirports, createAirport } from '../controllers/airport.controller.js'

const router = Router()

router.get('/', getAirports)
router.post('/', createAirport)

export default router
