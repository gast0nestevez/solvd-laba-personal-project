import { routes } from '../models/route.model.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { createEntity } from '../helpers/createEntity.js'

const buildGraph = () => {
  const graph = {}
  
  // Each airport ID maps to an array of routes originating from it
  routes.forEach(r => {
    if (!graph[r.originId]) graph[r.originId] = []
    graph[r.originId].push(r)
  })
  return graph
}

// BFS
const findPaths = (graph, originId, destId, maxStops = Object.keys(graph).length) => {
  const paths = []
  const queue = [{ path: [originId], totalDuration: 0, totalPrice: 0, routeList: [] }]

  while (queue.length > 0) {
    const { path, totalDuration, totalPrice, routeList } = queue.shift()
    const last = path[path.length - 1]

    if (last === destId && routeList.length > 1) {
      paths.push({ path, totalDuration, totalPrice, routeList })
      continue
    }

    if (!graph[last]) continue

    for (const r of graph[last]) {
      if (!path.includes(r.destId) && path.length < maxStops) {
        queue.push({
          path: [...path, r.destId],
          totalDuration: totalDuration + r.duration,
          totalPrice: totalPrice + r.price,
          routeList: [...routeList, r]
        })
      }
    }
  }

  return paths
}

export const getRoutes = (req, res) => {
  const { origin, dest } = req.query

  if (origin && dest) {
    const originId = parseInt(origin)
    const destId = parseInt(dest)

    // Filter direct routes first
    const directRoutes = routes.filter(
      r => r.originId === originId && r.destId === destId
    )
    
    // Build graph and find multi-leg routes
    const graph = buildGraph()
    const multiLegRoutes = findPaths(graph, originId, destId)

    return res.json({
      directRoutes,
      multiLegRoutes
    })
  }

  // Return all routes if no query provided
  res.json(routes)
}

export const createRoute = (req, res) => {
  const newRoute = createEntity(routes, req.body)
  res.status(201).json(newRoute)
}

export const deleteRoute = (req, res) => {
  const id = req.params.id
  const result = deleteEntity(routes, id)
  if (result.error) return res.status(404).json({ message: result.message })
  res.json({ message: 'Route deleted', route: result.deletedEntity })
}
