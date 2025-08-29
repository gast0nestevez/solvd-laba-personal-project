import { airlines } from '../models/airline.model.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { createEntity } from '../helpers/createEntity.js'

export const getAirlines = (req, res) => {
  res.json(airlines)
}

export const createAirline = (req, res) => {
  const newAirline = createEntity(airlines, req.body)
  res.status(201).json(newAirline)
}

export const deleteAirline = (req, res) => {
  const id = req.params.id
  const result = deleteEntity(airlines, id)
  if (result.error) return res.status(404).json({ message: result.message })
  res.json({ message: 'Airline deleted', airline: result.deletedEntity })
}
