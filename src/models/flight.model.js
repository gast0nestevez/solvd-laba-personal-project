import pool from '../utils/db.js'

export class Flight {
  constructor({ id, routeId, departureTime, arrivalTime }) {
    this.id = id
    this.routeId = routeId
    this.departureTime = departureTime
    this.arrivalTime = arrivalTime
  }

  static async getAll({ departureDate } = {}) {
    let query = `SELECT 
      f.id,
      f.route_id AS "routeId",
      r.origin_id AS "originId",
      r.destination_id AS "destinationId",
      r.duration,
      f.departure_time AS "departureTime",
      f.arrival_time AS "arrivalTime",
      r.price,
      r.airline_id AS "airlineId"
    FROM flights f
    JOIN routes r ON f.route_id = r.id`
    const values = []

    if (departureDate) {
      query += ' WHERE f.departure_time >= $1'
      values.push(departureDate)
    }

    query += ' ORDER BY departure_time'

    const result = await pool.query(query, values)
    return result.rows
  }

  static async create({ routeId, departureTime, arrivalTime }) {
    const query = `
      INSERT INTO flights (route_id, departure_time, arrival_time)
      VALUES ($1, $2, $3)
      RETURNING 
        route_id AS "routeId",
        departure_time AS "departureTime",
        arrival_time AS "arrivalTime"`
    const values = [routeId, departureTime, arrivalTime]

    const result = await pool.query(query, values)
    return new Flight(result.rows[0])
  }

  static async delete(id) {
    const query = `DELETE
      FROM flights WHERE id = $1
      RETURNING 
        route_id AS "routeId",
        departure_time AS "departureTime",
        arrival_time AS "arrivalTime"`
    const result = await pool.query(query, [id])
    return result.rows[0] ? new Flight(result.rows[0]) : null
  }
}
