import { Route } from '../models/route.model.js'
import { validateRoute } from '../helpers/validations.js'

export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.getAll()
    res.json({ Routes: routes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createRoute = async (req, res) => {
  const { originId, destinationId, duration, price, airlineId } = req.body

  try {
    validateRoute(originId, destinationId, duration, price, airlineId)
    const newRoute = await Route.create({ originId, destinationId, duration, price, airlineId })
    res.status(201).json(newRoute)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteRoute = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const route = await Route.delete(id)
    if (!route) return res.status(404).json({ message: 'Route not found' })

    res.json({ message: 'Route deleted', route })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
