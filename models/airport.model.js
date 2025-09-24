import pool from '../utils/db.js'

export class Airport {
  constructor({ id, code, name, city, country, latitude, longitude }) {
    this.id = id
    this.code = code
    this.name = name
    this.city = city
    this.country = country
    this.latitude = latitude
    this.longitude = longitude
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM airports ORDER BY id')
    return result.rows.map(row => new Airport(row))
  }

  static async create({ code, name, city, country, latitude, longitude }) {
    const query = `
    INSERT INTO airports (code, name, city, country, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`
    const values = [code, name, city, country, latitude, longitude]
    
    const result = await pool.query(query, values)
    return new Airport(result.rows[0])
  }
  
  static async delete(id) {
    const query = 'DELETE FROM airports WHERE id = $1 RETURNING *'
    const result = await pool.query(query, [id])
    return result.rows[0] ? new Airport(result.rows[0]) : null 
  }
}
