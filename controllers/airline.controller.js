import { airlines } from '../models/airline.model.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { createEntity } from '../helpers/createEntity.js'
import pool from '../utils/db.js'
import { getAll } from '../helpers/getAll.js'

export const getAirlines = async (req, res) => {
  try {
    const airlines = await getAll('airlines')
    res.json(airlines)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createAirline = async (req, res) => {
  const { name } = req.body
  
  try {
    const result = await pool.query(
      `INSERT INTO airlines (name)
       VALUES ($1)
       RETURNING *`,
      [name]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error when inserting airline' })
  }
}

export const deleteAirline = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const result = await pool.query(
      'DELETE FROM airlines WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rowCount === 0) return res.status(404).json({ message: 'Airline not found' })

    res.json({ message: 'Airline deleted', airline: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error when removing airline' })
  }
}
