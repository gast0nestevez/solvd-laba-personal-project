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
import { Flight } from '../../src/models/flight.model.js'

describe('Flight model', () => {
  beforeEach(() => {
    pool.query = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await pool.end()
  })

  test('getAll returns all flights without filter', async () => {
    const mockRows = [
      { id: 1, routeId: 1, originId: 1, destinationId: 2, duration: 120, departureTime: '2025-09-25T10:00:00Z', arrivalTime: '2025-09-25T12:00:00Z', price: 150, airline_id: 1 },
      { id: 2, routeId: 2, originId: 2, destinationId: 3, duration: 180, departureTime: '2025-09-25T14:00:00Z', arrivalTime: '2025-09-25T17:00:00Z', price: 200, airline_id: 2 }
    ]
    pool.query.mockResolvedValueOnce({ rows: mockRows })

    const flights = await Flight.getAll()

    expect(flights).toHaveLength(2)
    expect(flights[0].departureTime).toBe('2025-09-25T10:00:00Z')
    expect(flights[1].departureTime).toBe('2025-09-25T14:00:00Z')
  })
  
  test('getAll with departureDate filter', async () => {
    const parsedDate = new Date(Date.UTC(2025, 8, 26, 0, 0, 0)).toISOString()
    const mockRows = [
      { id: 1, routeId: 1, departureTime: '2025-09-25T10:00:00Z', arrivalTime: '2025-09-25T14:00:00Z' }
    ]
    pool.query.mockResolvedValueOnce({ rows: mockRows })

    const flights = await Flight.getAll({ departureDate: parsedDate })

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE f.departure_time >= $1'),
      [parsedDate]
    )
  })

  test('create a new flight', async () => {
    const input = { routeId: 4, departureTime: '2025-09-27T10:00:00Z', arrivalTime: '2025-09-27T12:00:00Z' }
    pool.query.mockResolvedValueOnce({ rows: [{ id: 5, ...input }] })

    const newFlight = await Flight.create(input)

    expect(newFlight).toBeInstanceOf(Flight)
    expect(newFlight.id).toBe(5)
    expect(newFlight.routeId).toBe(input.routeId)
    expect(newFlight.departureTime).toBe(input.departureTime)
    expect(newFlight.arrivalTime).toBe(input.arrivalTime)
  })

  test('delete a flight', async () => {
    const mockFlight = { id: 1, routeId: 1, departureTime: '2025-09-25T10:00:00Z', arrivalTime: '2025-09-25T12:00:00Z' }
    pool.query.mockResolvedValueOnce({ rows: [mockFlight] })

    const deleted = await Flight.delete(1)

    expect(deleted).toBeInstanceOf(Flight)
    expect(deleted.id).toBe(1)
    expect(deleted.routeId).toBe(mockFlight.routeId)
    expect(deleted.departureTime).toBe(mockFlight.departureTime)
    expect(deleted.arrivalTime).toBe(mockFlight.arrivalTime)
  })

  test('delete returns null if flight not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })

    const deleted = await Flight.delete(999)
    expect(deleted).toBeNull()
  })
})
