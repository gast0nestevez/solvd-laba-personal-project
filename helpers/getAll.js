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

export const getAllFlightsWithRoutesInfo = async () => {
  const result = await pool.query(`
    SELECT f.id AS flight_id, r.origin_id, r.destination_id, r.duration,
    f.departure_time, f.arrival_time, r.price, r.airline_id
    FROM flights f
    JOIN routes r ON f.route_id = r.id
  `)
  return result.rows
}

export const getAllDirectFlightsFromTo = async (originId, destinationId) => {
  const result = await pool.query(`
    SELECT f.id AS flight_id, r.origin_id, r.destination_id, r.duration,
            f.departure_time, f.arrival_time, r.price, r.airline_id
    FROM flights f
    JOIN routes r ON f.route_id = r.id
    WHERE r.origin_id = $1 AND r.destination_id = $2
    `,
    [originId, destinationId]
  )
  return result.rows
}
