import { getFlightsWithFilters } from '../helpers/gets.js'
import { createEntity } from '../helpers/createEntity.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { validateFlight } from '../helpers/validations.js'

const DEFAULT_LAYOVER_HOURS = 1
const DEFAULT_MAX_STOPOVERS = 3

const addHoursOfLayover = (datetime) => {
  return new Date(datetime.getTime() + 60 * 60 * 1000 * DEFAULT_LAYOVER_HOURS)
}

const parseDate = (date) => {
  if (date) {
    const [dd, mm, yyyy] = date.split('-').map(Number)
    const parsedDate = new Date(Date.UTC(yyyy, mm - 1, dd, 0, 0, 0))
    return parsedDate.toISOString()
  }
}

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
const findPaths = (graph, originId, destinationId) => {
  const allPaths = []
  const queue = [{ path: [originId], totalDuration: 0, totalPrice: 0, routeList: [] }]

  while (queue.length > 0) {
    const { path, totalDuration, totalPrice, routeList } = queue.shift()
    const currentOriginId = path[path.length - 1]
    const previousFlight = routeList.length > 0 ? routeList[routeList.length-1] : null
    
    if (currentOriginId === destinationId) {
      allPaths.push({ path, totalDuration, totalPrice, routeList })
    }
    
    if (!graph[currentOriginId]) continue
    
    for (const flight of graph[currentOriginId]) {
      const isUnvisitedDestination = !path.includes(flight.destination_id)
      const canConnectFromPreviousFlight = !previousFlight || addHoursOfLayover(previousFlight.arrival_time) < flight.departure_time
      const withinMaxStopovers = path.length <= DEFAULT_MAX_STOPOVERS

      if (isUnvisitedDestination && canConnectFromPreviousFlight && withinMaxStopovers) {
        queue.push({
          path: [...path, flight.destination_id],
          totalDuration: totalDuration + parseInt(flight.duration), 
          totalPrice: totalPrice + parseFloat(flight.price),
          routeList: [...routeList, flight]
        })
      }
    }
  }

  return allPaths
}

export const getFlights = async (req, res) => {
  const { origin, destination, date } = req.query
  const originId = parseInt(origin)
  const destinationId = parseInt(destination)
  const departureDate = parseDate(date)

  try {
    const allFlights = await getFlightsWithFilters({ departureDate: departureDate })

    // Return all flights if no query provided
    if (!origin || !destination) return res.json({ allFlights: allFlights })
    
    // Find direct and multi-leg flights
    const graph = buildGraph(allFlights)
    const allFlightsFromOriginToDestination = findPaths(graph, originId, destinationId)

    return res.json({ allFlightsFromOriginToDestination })
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

    res.json({ message: 'Flight deleted', flight })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
