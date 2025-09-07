export class Route {
  constructor({ id, originId, destinationId, duration, price, airlineId }) {
    this.id = id
    this.originId = originId
    this.destinationId = destinationId
    this.duration = duration
    this.price = price
    this.airlineId = airlineId
  }
}

// In-memory list of example routes
export const routes = [
  new Route({
    id: 1,
    originId: 1,   // JFK
    destinationId: 2,     // LHR
    duration: 420,
    price: 500,
    airlineId: 1  // American Airlines
  }),
  new Route({
    id: 2,
    originId: 1,
    destinationId: 3,
    duration: 435,
    price: 450,
    airlineId: 4
  }),
  new Route({
    id: 3,
    originId: 3,
    destinationId: 2,
    duration: 75,
    price: 120,
    airlineId: 5
  }),
  new Route({
    id: 4,
    originId: 2,
    destinationId: 4,
    duration: 420,
    price: 600,
    airlineId: 5
  }),
  new Route({
    id: 5,
    originId: 5,
    destinationId: 3,
    duration: 70,
    price: 110,
    airlineId: 4
  }),
  new Route({
    id: 6,
    originId: 2,
    destinationId: 1,
    duration: 430,
    price: 400,
    airlineId: 1
  }),
  new Route({
    id: 7,
    originId: 3,
    destinationId: 4,
    duration: 235,
    price: 230,
    airlineId: 4
  }),
  new Route({
    id: 8,
    originId: 4,
    destinationId: 5,
    duration: 235,
    price: 230,
    airlineId: 4
  }),
]
