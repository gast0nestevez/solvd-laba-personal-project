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

export const deleteAirline = (req, res) => {
  const { id } = req.params
  const airlineId = parseInt(id)

  const index = airline.findIndex(a => a.id === airlineId)
  if (index === -1) return res.status(404).json({ message: "Airline not found" })

  const deletedAirline = airline.splice(index, 1)[0]
  res.json({ message: "Airline deleted", airline: deletedAirline })
}
