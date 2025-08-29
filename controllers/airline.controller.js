import { airlines } from "../models/airline.model.js"
import { deleteEntity } from "../helpers/deleteEntity.js"

export const getAirlines = (req, res) => {
  res.json(airlines)
}

export const createAirline = (req, res) => {
  const { name } = req.body
  const newAirline = {
    id: airlines.length + 1,
    name
  }
  airlines.push(newAirline)
  res.status(201).json(newAirline)
}

export const deleteAirline = (req, res) => {
  const id = req.params.id
  const result = deleteEntity(airlines, id)
  if (result.error) return res.status(404).json({ message: result.message })
  res.json({ message: "Airline deleted", airline: result.deletedEntity })
}
