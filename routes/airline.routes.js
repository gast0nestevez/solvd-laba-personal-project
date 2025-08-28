import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { getAirlines, createAirline } from '../controllers/airline.controller.js'

const router = Router()

router.get('/', getAirlines)
router.post('/', adminOnly, createAirline)

export default router
