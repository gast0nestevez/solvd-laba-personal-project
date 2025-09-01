import { deleteEntity } from '../helpers/deleteEntity.js'
import { createEntity } from '../helpers/createEntity.js'
import pool from '../utils/db.js'
import { getAll } from '../helpers/getAll.js'

const buildGraph = (routes) => {
  const graph = {}

  // Each airport ID maps to an array of routes originating from it
  routes.forEach(r => {
    if (!graph[r.origin_id]) graph[r.origin_id] = []
    graph[r.origin_id].push(r)
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
      if (!path.includes(r.dest_id) && path.length < maxStops) {
        queue.push({
          path: [...path, r.dest_id],
          totalDuration: totalDuration + parseInt(r.duration),
          totalPrice: totalPrice + parseFloat(r.price),
          routeList: [...routeList, r]
        })
      }
    }
  }

  return paths
}

export const getRoutes = async (req, res) => {
  const { origin, dest } = req.query
  
  try {
    const routes = await getAll('routes')
  
    if (origin && dest) {
      const originId = parseInt(origin)
      const destId = parseInt(dest)
  
      // Filter direct routes first
      const directRoutes = routes.filter(
        r => r.origin_id === originId && r.dest_id === destId
      )
      
      // Build graph and find multi-leg routes
      const graph = buildGraph(routes)
      const multiLegRoutes = findPaths(graph, originId, destId)
  
      return res.json({
        directRoutes,
        multiLegRoutes
      })
    }
  
    // Return all routes if no query provided
    res.json(routes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createRoute = async (req, res) => {
  const { name, originId, destId, duration, price, airlineId } = req.body
  
  try {
    const result = await pool.query(
      `INSERT INTO routes (origin_id, dest_id, duration, price, airline_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, originId, destId, duration, price, airlineId]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error when inserting route' })
  }
}

export const deleteRoute = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const result = await pool.query(
      'DELETE FROM routes WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rowCount === 0) return res.status(404).json({ message: 'Route not found' })

    res.json({ message: 'Route deleted', route: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error when removing route' })
  }
}
