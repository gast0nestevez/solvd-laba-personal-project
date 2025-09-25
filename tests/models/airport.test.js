import { jest } from '@jest/globals'
import pool from '../../src/utils/db.js'
import { Airport } from '../../src/models/airport.model.js'

jest.mock('../../src/utils/db.js')

describe('Airport model', () => {
  beforeEach(() => {
    pool.query = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await pool.end()
  })

  test('getAll returns list with airports', async () => {
    const mockRows = [
      { id: 1, code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', latitude: -34.82, longitude: -58.53 },
      { id: 2, code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA', latitude: 40.64, longitude: -73.78 }
    ]
    pool.query.mockResolvedValueOnce({ rows: mockRows })

    const result = await Airport.getAll()
    expect(result).toHaveLength(2)
    expect(result[0]).toBeInstanceOf(Airport)
    expect(result[0].code).toBe('EZE')
    expect(result[1].code).toBe('JFK')
  })

  test('create a new airport', async () => {
    const input = { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'Spain', latitude: 40.47, longitude: -3.56 }
    pool.query.mockResolvedValueOnce({ rows: [{ id: 3, ...input }] })

    const newAirport = await Airport.create(input)
    expect(newAirport).toBeInstanceOf(Airport)
    expect(newAirport.id).toBe(3)
    expect(newAirport.code).toBe(input.code)
    expect(newAirport.name).toBe(input.name)
    expect(newAirport.city).toBe(input.city)
    expect(newAirport.country).toBe(input.country)
    expect(newAirport.latitude).toBe(input.latitude)
    expect(newAirport.longitude).toBe(input.longitude)
  })

  test('delete an airport and return it', async () => {
    const mockAirport = { id: 1, code: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina', latitude: -34.82, longitude: -58.53 }
    pool.query.mockResolvedValueOnce({ rows: [mockAirport] })

    const deleted = await Airport.delete(1)
    expect(deleted).toBeInstanceOf(Airport)
    expect(deleted.id).toBe(1)
    expect(deleted.code).toBe(mockAirport.code)
    expect(deleted.name).toBe(mockAirport.name)
    expect(deleted.city).toBe(mockAirport.city)
    expect(deleted.country).toBe(mockAirport.country)
    expect(deleted.latitude).toBe(mockAirport.latitude)
    expect(deleted.longitude).toBe(mockAirport.longitude)
  })

  test('delete returns null when airport not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const deleted = await Airport.delete(999)
    expect(deleted).toBeNull()
  })
})
