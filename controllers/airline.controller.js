import { getAll } from '../helpers/getAll.js'
import { createEntity } from '../helpers/createEntity.js'
import { deleteEntity } from '../helpers/deleteEntity.js'
import { validateAirline } from '../helpers/validations.js'

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
    validateAirline(name)
    const newAirline = await createEntity(
      'airlines',
      ['name'],
      [name]
    )
    res.status(201).json(newAirline)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteAirline = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const airline = await deleteEntity('airlines', id)
    if (!airline) return res.status(404).json({ message: 'Airline not found' })

    res.json({ message: 'Airline deleted', airline })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
