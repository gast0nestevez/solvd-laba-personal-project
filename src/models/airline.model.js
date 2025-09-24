import pool from '../utils/db.js'

export class Airline {
  constructor({ id, name }) {
    this.id = id
    this.name = name
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM airlines ORDER BY id')
    return result.rows.map(row => new Airline(row))
  }

  static async getRoutes(id) {
    const query = `
      SELECT r.*
      FROM routes r
      INNER JOIN airlines a ON r.airline_id = a.id
      WHERE a.id = $1
      ORDER BY r.id`
    const result = await pool.query(query, [id])
    return result.rows
  }

  static async create({ name }) {
    const query = `
      INSERT INTO airlines (name)
      VALUES ($1)
      RETURNING *`
    const result = await pool.query(query, [name])
    return new Airline(result.rows[0])
  }

  static async delete(id) {
    const query = 'DELETE FROM airlines WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0] ? new Airline(result.rows[0]) : null
  }
}
