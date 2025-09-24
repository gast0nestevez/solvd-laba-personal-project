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
      f.id AS flight_id,
      r.origin_id,
      r.destination_id,
      r.duration,
      f.departure_time,
      f.arrival_time,
      r.price,
      r.airline_id
      FROM flights f
      JOIN routes r ON f.route_id = r.id`
    const values = []

    if (departureDate) {
      query += ' WHERE DATE(f.departure_time) = $1'
      values.push(departureDate)
    }

    query += ' ORDER BY departure_time'

    const result = await pool.query(query, values)
    return result.rows.map(row => new Flight(row))
  }

  static async create({ routeId, departureTime, arrivalTime }) {
    const query = `
      INSERT INTO flights (route_id, departure_time, arrival_time)
      VALUES ($1, $2, $3)
      RETURNING *`
    const values = [routeId, departureTime, arrivalTime]

    const result = await pool.query(query, values)
    return new Flight(result.rows[0])
  }

  static async delete(id) {
    const query = 'DELETE FROM flights WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0] ? new Flight(result.rows[0]) : null
  }
}
