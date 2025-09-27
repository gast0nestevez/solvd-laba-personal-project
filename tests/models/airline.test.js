import { jest } from '@jest/globals'

jest.mock('../../src/utils/db.js', () => {
  return {
    __esModule: true,
    default: {
      query: jest.fn(),
      end: jest.fn()
    }
  }
})

import pool from '../../src/utils/db.js'
import { Airline } from '../../src/models/airline.model.js'

describe('Airline model', () => {
  beforeEach(() => {
    pool.query = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await pool.end()
  })

  test('getAll returns list of airlines', async () => {
    const mockRows = [
      { id: 1, name: 'Aerolineas Argentinas' },
      { id: 2, name: 'Delta Airlines' }
    ]
    pool.query.mockResolvedValueOnce({ rows: mockRows })

    const airlines = await Airline.getAll()

    expect(airlines).toHaveLength(2)
    expect(airlines[0]).toBeInstanceOf(Airline)
    expect(airlines[0].name).toBe('Aerolineas Argentinas')
    expect(airlines[1]).toBeInstanceOf(Airline)
    expect(airlines[1].name).toBe('Delta Airlines')
  })

  test('getRoutes returns empty array if no routes found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const routes = await Airline.getRoutes(99)
    expect(routes).toEqual([])
  })

  test('create a new airline', async () => {
    const input = { name: 'Iberia' }
    pool.query.mockResolvedValueOnce({ rows: [{ id: 3, ...input }] })

    const newAirline = await Airline.create(input)

    expect(newAirline).toBeInstanceOf(Airline)
    expect(newAirline.id).toBe(3)
    expect(newAirline.name).toBe(input.name)
  })

  test('delete an airline and return it', async () => {
    const mockAirline = { id: 1, name: 'Aerolineas Argentinas' }
    pool.query.mockResolvedValueOnce({ rows: [mockAirline] })

    const deleted = await Airline.delete(1)

    expect(deleted).toBeInstanceOf(Airline)
    expect(deleted.id).toBe(1)
    expect(deleted.name).toBe(mockAirline.name)
  })

  test('delete returns null when airline not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const deleted = await Airline.delete(999)
    expect(deleted).toBeNull()
  })
})
