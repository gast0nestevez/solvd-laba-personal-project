import { airports } from "../models/airport.model.js"
import { deleteEntity } from "../helpers/deleteEntity.js"

export const getAirports = (req, res) => {
  res.json(airports)
}

export const createAirport = (req, res) => {
  const { code, name, city, country, latitude, longitude } = req.body
  const newAirport = {
    id: airports.length + 1,
    code,
    name,
    city,
    country,
    latitude,
    longitude
  }
  airports.push(newAirport)
  res.status(201).json(newAirport)
}

export const deleteAirport = (req, res) => {
  const id = req.params.id
  const result = deleteEntity(airports, id)
  if (result.error) return res.status(404).json({ message: result.message })
  res.json({ message: "Airport deleted", airport: result.deletedEntity })
}
