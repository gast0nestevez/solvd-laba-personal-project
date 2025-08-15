import { airports } from "../models/aiport.model.js"

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
