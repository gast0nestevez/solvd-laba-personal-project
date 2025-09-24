import pool from '../utils/db.js'

export class Route {
  constructor({ id, originId, destinationId, duration, price, airlineId }) {
    this.id = id
    this.originId = originId
    this.destinationId = destinationId
    this.duration = duration
    this.price = price
    this.airlineId = airlineId
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM routes ORDER BY id')
    return result.rows.map(row => new Route(row))
  }

  static async create({ originId, destinationId, duration, price, airlineId }) {
    const query = `
      INSERT INTO routes (origin_id, destination_id, duration, price, airline_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`
    const values = [originId, destinationId, duration, price, airlineId]

    const result = await pool.query(query, values)
    return new Route(result.rows[0])
  }

  static async delete(id) {
    const query = 'DELETE FROM routes WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0] ? new Route(result.rows[0]) : null
  }
}
