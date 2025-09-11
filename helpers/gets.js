import pool from '../utils/db.js'

export const getAll = async (tableName) => {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id`)
    return result.rows
  } catch (err) {
    console.error(`Error fetching ${tableName}:`, err)
    throw new Error(`Error fetching ${tableName}`)
  }
}

export const getRoutesOfAirline = async (airlineId) => {
  const result = await pool.query(`SELECT * FROM routes WHERE airline_id = $1`, [airlineId])
  return result.rows
}

export const getFlightsWithFilters = async ({ originId, destinationId, departureDate }) => {
  let query = `
    SELECT f.id AS flight_id, r.origin_id, r.destination_id, r.duration,
           f.departure_time, f.arrival_time, r.price, r.airline_id
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    WHERE 1=1
  `
  const values = []
  let index = 1

  if (originId) {
    query += ` AND r.origin_id = $${index++}`
    values.push(originId)
  }

  if (destinationId) {
    query += ` AND r.destination_id = $${index++}`
    values.push(destinationId)
  }

  if (departureDate) {
    query += ` AND f.departure_time >= $${index++}`
    values.push(departureDate)
  }

  const result = await pool.query(query, values)
  return result.rows
}
