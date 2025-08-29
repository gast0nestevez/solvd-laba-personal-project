import { routes } from '../models/route.model.js'
import { deleteEntity } from '../helpers/deleteEntity.js'

const buildGraph = () => {
  const graph = {}
  
  // Each airport ID maps to an array of routes originating from it
  routes.forEach(r => {
    if (!graph[r.sourceId]) graph[r.sourceId] = []
    graph[r.sourceId].push(r)
  })
  return graph
}

// BFS to find all paths (limited by maxStops to avoid infinite loops)
const findPaths = (graph, sourceId, destId, maxStops = 3) => {
  const paths = []
  const queue = [{ path: [sourceId], totalDuration: 0, totalPrice: 0, routeList: [] }]

  while (queue.length > 0) {
    const { path, totalDuration, totalPrice, routeList } = queue.shift()
    const last = path[path.length - 1]

    if (last === destId && routeList.length > 1) {
      paths.push({ path, totalDuration, totalPrice, routeList })
      continue
    }

    if (!graph[last]) continue

    for (const r of graph[last]) {
      if (!path.includes(r.destId) && path.length <= maxStops + 1) {
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

// /api/routes?source=1&destination=2
export const getRoutes = (req, res) => {
  const { source, dest } = req.query

  if (source && dest) {
    const sourceId = parseInt(source)
    const destId = parseInt(dest)

    // Filter direct routes first
    const directRoutes = routes.filter(
      r => r.sourceId === sourceId && r.destId === destId
    )
    
    // Build graph and find multi-leg routes
    const graph = buildGraph()
    const multiLegRoutes = findPaths(graph, sourceId, destId)

    return res.json({
      directRoutes,
      multiLegRoutes
    })
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

export const deleteRoute = (req, res) => {
  const id = req.params.id
  const result = deleteEntity(routes, id)
  if (result.error) return res.status(404).json({ message: result.message })
  res.json({ message: "Route deleted", route: result.deletedEntity })
}
