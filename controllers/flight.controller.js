import { getAll, getAllDirectFlightsFromTo, getAllFlightsWithRoutesInfo } from '../helpers/getAll.js'
import { createEntity } from '../helpers/createEntity.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { validateFlight } from '../helpers/validations.js'

const buildGraph = (flights) => {
  const graph = {}

  // Each airport ID maps to an array of flights originating from it
  flights.forEach(f => {
    if (!graph[f.origin_id]) graph[f.origin_id] = []
    graph[f.origin_id].push(f)
  })
  return graph
}

// BFS
const findPaths = (graph, originId, destinationId, maxStops = Object.keys(graph).length) => {
  const paths = []
  const queue = [{ path: [originId], totalDuration: 0, totalPrice: 0, routeList: [] }]

  while (queue.length > 0) {
    const { path, totalDuration, totalPrice, routeList } = queue.shift()
    const currentOriginId = path[path.length - 1]
    const previousFlight = routeList.length > 0 ? routeList[routeList.length-1] : null
    
    if (currentOriginId === destinationId && routeList.length > 1) {
      paths.push({ path, totalDuration, totalPrice, routeList })
      continue
    }
    
    if (!graph[currentOriginId]) continue
    
    for (const flight of graph[currentOriginId]) {
      const arrivalBeforeDeparture = !previousFlight || previousFlight.arrival_time < flight.departure_time

      if (!path.includes(flight.destination_id) && arrivalBeforeDeparture && path.length < maxStops) {
        queue.push({
          path: [...path, flight.destination_id],
          totalDuration: totalDuration + parseInt(flight.duration), 
          totalPrice: totalPrice + parseFloat(flight.price),
          routeList: [...routeList, flight]
        })
      }
    }
  }

  return paths
}

export const getFlights = async (req, res) => {
  const { origin, destination } = req.query
  
  try {
    // Return all flights if no query provided
    if (!origin || !destination) {
      const flights = await getAll('flights')
      return res.json(flights)
    }

    // Look for direct flights first
    const originId = parseInt(origin)
    const destinationId = parseInt(destination)
    const direct = await getAllDirectFlightsFromTo(originId, destinationId)
  
    // Find multi-leg flights
    const flightsWithRoutesInfo = await getAllFlightsWithRoutesInfo()
    const graph = buildGraph(flightsWithRoutesInfo)
    const multiLegRoutes = findPaths(graph, originId, destinationId)

    return res.json({ direct, multiLegRoutes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const addFlight = async (req, res) => {
  const { routeId, departureTime, arrivalTime } = req.body
  
  try {
    validateFlight(departureTime, arrivalTime)

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
