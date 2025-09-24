import { jest } from '@jest/globals'
import pool from '../../utils/db.js'
import { Flight } from '../../models/flight.model.js'

jest.mock('../../utils/db.js')

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
    expect(flights[0]).toBeInstanceOf(Flight)
    expect(flights[0].departureTime).toBe('2025-09-25T10:00:00Z')
    expect(flights[1].departureTime).toBe('2025-09-25T14:00:00Z')
  })

  test('getAll with departureDate filter', async () => {
    const mockRows = [
      { id: 3, route_id: 3, originId: 1, destinationId: 3, duration: 240, departureTime: '2025-09-26T08:00:00Z', arrivalTime: '2025-09-26T12:00:00Z', price: 300, airline_id: 1 }
    ]
    pool.query.mockResolvedValueOnce({ rows: mockRows })

    const flights = await Flight.getAll({ departureDate: '2025-09-26' })

    expect(flights).toHaveLength(1)
    expect(flights[0]).toBeInstanceOf(Flight)
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
