export class Route {
  constructor({ id, sourceId, destId, duration, price, airlineId }) {
    this.id = id
    this.sourceId = sourceId  // Airport id
    this.destId = destId      // Airport id
    this.duration = duration  // minutes
    this.price = price
    this.airline = airlineId    // Airline id
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
    airlineId: 1  // American Airlines
  }),
  new Route({
    id: 2,
    sourceId: 1,   // JFK
    destId: 3,     // CDG
    duration: 435,
    price: 450,
    airlineId: 4  // Lufthansa
  }),
  new Route({
    id: 3,
    sourceId: 3,   // CDG
    destId: 2,     // LHR
    duration: 75,
    price: 120,
    airlineId: 5  // Emirates
  }),
  new Route({
    id: 4,
    sourceId: 2,   // LHR
    destId: 4,     // DXB
    duration: 420,
    price: 600,
    airlineId: 5   // Emirates
  }),
  new Route({
    id: 5,
    sourceId: 5,
    destId: 3,
    duration: 70,
    price: 110,
    airlineId: 4
  }),
  new Route({
    id: 6,
    sourceId: 2,
    destId: 1,
    duration: 430,
    price: 400,
    airlineId: 1
  }),
  new Route({
    id: 7,
    sourceId: 3,
    destId: 4,
    duration: 235,
    price: 230,
    airlineId: 4
  }),
]
