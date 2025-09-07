import { getAll } from '../helpers/getAll.js'
import { createEntity } from '../helpers/createEntity.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import pool from '../utils/db.js'


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

export const getFlights = async (req, res) => {
  const { origin, dest } = req.query
  
  try {
    // Case 1: return all flights if no query provided
    if (!origin || !dest) {
      const result = await pool.query(`
        SELECT f.id AS flight_id, r.origin_id, r.dest_id, 
               f.departure_time, f.arrival_time, r.price, r.airline_id
        FROM flights f
        JOIN routes r ON f.route_id = r.id
      `)
      return res.json(result.rows)
    }

    // Case 2: look for direct flights first
    const direct = await pool.query(
      `
      SELECT f.id AS flight_id, r.origin_id, r.dest_id, 
             f.departure_time, f.arrival_time, r.price, r.airline_id
      FROM flights f
      JOIN routes r ON f.route_id = r.id
      WHERE r.origin_id = $1 AND r.dest_id = $2
      `,
      [origin, dest]
    )
    if (direct.rows.length > 0) return res.json({ type: 'direct', flights: direct.rows })
  
    // Case 3: ...
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const addFlight = async (req, res) => {
  const { routeId, departureTime, arrivalTime } = req.body
  
  try {
    const newFlight = await createEntity(
      'flights',
      ['route_id', 'departure_time', 'arrival_time'],
      [routeId, departureTime, arrivalTime]
    )
    res.status(201).json(newFlight)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteFlight = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const flight = await deleteEntity('flights', id)
    if (!flight) return res.status(404).json({ message: 'Flight not found' })

    res.json({ message: 'flight deleted', flight })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
