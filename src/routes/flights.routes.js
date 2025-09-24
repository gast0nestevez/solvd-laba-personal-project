import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { getFlights, addFlight, deleteFlight } from '../controllers/flight.controller.js'

const router = Router()

router.get('/', getFlights)
router.post('/', adminOnly, addFlight)
router.delete('/:id', adminOnly, deleteFlight)

export default router
