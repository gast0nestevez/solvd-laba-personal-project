import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { getAirports, createAirport, deleteAirport } from '../controllers/airport.controller.js'

const router = Router()

router.get('/', getAirports)
router.post('/', adminOnly, createAirport)
router.delete('/:id', adminOnly, deleteAirport)

export default router
