import { airlines } from "../models/airline.model.js"

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
