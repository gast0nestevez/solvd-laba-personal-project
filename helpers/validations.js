const assertAllPresent = (...args) => {
  if (!args.every(arg => arg != null)) throw new Error('All fields are required')
}

const assertValidTypes = (variables, types) => {
  for (const key in types) {
    const expectedType = types[key]
    const value = variables[key]
    if (typeof value !== expectedType) throw new Error('Invalid data types')
  }
}

const assertValidIATACode = (code) => {
  const regex = /^[A-Z]{3}$/
  if (!regex.test(code)) throw new Error('Invalid IATA code')
}

const assertValidCoordinates = (latitude, longitude) => {
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw new Error('Latitude or longitude out of range')
}

const assertPositiveNumbers = (...args) => {
  if (!args.every(arg => arg >= 0)) throw new Error('`price` and `duration` must be positive integers')
}

const assertDifferentOriginAndDestination = (originId, destinationId) => {
  if (originId === destinationId) throw new Error('Origin and destination cannot be the same')
}

export const validateAirport = (code, name, city, country, latitude, longitude) => {
  assertAllPresent(code, name, city, country, latitude, longitude) 
  assertValidTypes({code, name, city, country, latitude, longitude}, {
    code: 'string',
    name:'string',
    city:'string',
    country:'string',
    latitude:'number',
    longitude:'number' })
  assertValidIATACode(code)
  assertValidCoordinates(latitude, longitude)
}

export const validateRoute = (originId, destinationId, duration, price, airline_id) => {
  assertAllPresent(originId, destinationId, duration, price, airline_id)
  assertValidTypes({originId, destinationId, duration, price, airline_id}, {
    originId: 'number',
    destinationId:'number',
    duration:'number',
    price:'number',
    airline_id:'number' })
  assertPositiveNumbers(duration, price)
  assertDifferentOriginAndDestination(originId, destinationId)
}

export const validateAirline = (name) => {
  assertAllPresent(name) 
}
