import { airports } from "../models/airport.model.js"

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
  const { id } = req.params
  const airportId = parseInt(id)

  const index = airports.findIndex(a => a.id === airportId)
  if (index === -1) return res.status(404).json({ message: "Airport not found" })

  const deletedAirport = airports.splice(index, 1)[0]
  res.json({ message: "Airport deleted", airport: deletedAirport })
}
