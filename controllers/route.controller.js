import { getAll } from '../helpers/getAll.js'
import { createEntity } from '../helpers/createEntity.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { validateRoute } from '../helpers/validations.js'

export const getRoutes = async (req, res) => {
  try {
    const routes = await getAll('routes')
    res.json(routes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createRoute = async (req, res) => {
  const { originId, destinationId, duration, price, airlineId } = req.body
  
  try {
    validateRoute(originId, destinationId, duration, price, airlineId)
    const newRoute = await createEntity(
      'routes',
      ['origin_id', 'destination_id', 'duration', 'price', 'airline_id'],
      [originId, destinationId, duration, price, airlineId]
    )
    res.status(201).json(newRoute)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteRoute = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const route = await deleteEntity('routes', id)
    if (!route) return res.status(404).json({ message: 'Route not found' })

    res.json({ message: 'Route deleted', route })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
