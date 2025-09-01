import { airports } from '../models/airport.model.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { createEntity } from '../helpers/createEntity.js'
import pool from '../utils/db.js'
import { getAll } from '../helpers/getAll.js'

export const getAirports = async (req, res) => {
  try {
    const airports = await getAll('airports')
    res.json(airports)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createAirport = async (req, res) => {
  const { code, name, city, country, latitude, longitude } = req.body
  
  try {
    const result = await pool.query(
      `INSERT INTO airports (code, name, city, country, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [code, name, city, country, latitude, longitude]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error when inserting airport' })
  }
}

export const deleteAirport = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const result = await pool.query(
      'DELETE FROM airports WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rowCount === 0) return res.status(404).json({ message: 'Airport not found' })

    res.json({ message: 'Airport deleted', airport: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error when removing airport' })
  }
}
