import { airports } from '../models/airport.model.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { createEntity } from '../helpers/createEntity.js'

export const getAirports = (req, res) => {
  res.json(airports)
}

export const createAirport = (req, res) => {
  const newAirport = createEntity(airports, req.body)
  res.status(201).json(newAirport)
}

export const deleteAirport = (req, res) => {
  const id = req.params.id
  const result = deleteEntity(airports, id)
  if (result.error) return res.status(404).json({ message: result.message })
  res.json({ message: 'Airport deleted', airport: result.deletedEntity })
}
