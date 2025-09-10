import { getAll } from '../helpers/gets.js'
import { createEntity } from '../helpers/createEntity.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { validateAirport } from '../helpers/validations.js'

export const getAirports = async (req, res) => {
  try {
    const airports = await getAll('airports')
    res.json({ Airports: airports })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createAirport = async (req, res) => {
  const { code, name, city, country, latitude, longitude } = req.body
  
  try {
    validateAirport(code, name, city, country, latitude, longitude)
    const newAirport = await createEntity(
      'airports',
      ['code', 'name', 'city', 'country', 'latitude', 'longitude'],
      [code, name, city, country, latitude, longitude]
    )
    res.status(201).json(newAirport)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteAirport = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const airport = await deleteEntity('airports', id)
    if (!airport) return res.status(404).json({ message: 'Airport not found' })

    res.json({ message: 'Airport deleted', airport })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
