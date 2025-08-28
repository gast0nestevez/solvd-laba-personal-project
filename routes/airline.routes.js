import { Router } from 'express'
import { adminOnly } from '../middleware/adminOnly.js'
import { getAirlines, createAirline, deleteAirline } from '../controllers/airline.controller.js'

const router = Router()

router.get('/', getAirlines)
router.post('/', adminOnly, createAirline)
router.post('/', adminOnly, deleteAirline)

export default router
