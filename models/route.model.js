export class Route {
  constructor({ id, sourceId, destId, duration, price, airline }) {
    this.id = id
    this.sourceId = sourceId  // Airport id
    this.destId = destId      // Airport id
    this.duration = duration  // minutes
    this.price = price
    this.airline = airline
  }
}

// In-memory list of example routes
export const routes = [
  new Route({
    id: 1,
    sourceId: 1,   // JFK
    destId: 2,     // LHR
    duration: 420,
    price: 500,
    airline: 'British Airways'
  }),
  new Route({
    id: 2,
    sourceId: 1,   // JFK
    destId: 3,     // CDG
    duration: 435,
    price: 450,
    airline: 'Air France'
  }),
  new Route({
    id: 3,
    sourceId: 3,   // CDG
    destId: 2,     // LHR
    duration: 75,
    price: 120,
    airline: 'British Airways'
  })
]
