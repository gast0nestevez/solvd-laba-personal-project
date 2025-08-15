import { routes } from '../models/route.model.js'

// /api/routes?source=1&destination=2
export const getRoutes = (req, res) => {
  const { source, destination } = req.query
  
  // Filter routes that match the source and destination ids
  if (source && destination) {
    const filtered = routes.filter(
      r => r.sourceId === parseInt(source) && r.destId === parseInt(destination)
    )
    return res.json(filtered)
  }

  // Return all routes if no query provided
  res.json(routes)
}

export const createRoute = (req, res) => {
  const { sourceId, destId, duration, price, airline } = req.body
  const newRoute = {
    id: routes.length + 1,
    sourceId,
    destId,
    duration,
    price,
    airline
  }
  routes.push(newRoute)
  res.status(201).json(newRoute)
}
