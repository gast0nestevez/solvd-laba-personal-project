import { jest } from '@jest/globals'
import pool from '../../src/utils/db.js'
import { Route } from '../../src/models/route.model.js'

jest.mock('../../src/utils/db.js')

describe('Route model', () => {
  beforeEach(() => {
    pool.query = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await pool.end()
  })

  test('getAll returns list of routes', async () => {
    const mockRows = [
      { id: 1, originId: 1, destinationId: 2, duration: 120, price: 150, airlineId: 1 },
      { id: 2, originId: 2, destinationId: 3, duration: 180, price: 200, airlineId: 2 }
    ]
    pool.query.mockResolvedValueOnce({ rows: mockRows })

    const routes = await Route.getAll()

    expect(routes).toHaveLength(2)
    expect(routes[0]).toBeInstanceOf(Route)
    expect(routes[0].duration).toBe(120)
  })

  test('create a new route', async () => {
    const input = { originId: 1, destinationId: 3, duration: 240, price: 300, airlineId: 2 }
    pool.query.mockResolvedValueOnce({ rows: [{ id: 3, ...input }] })

    const newRoute = await Route.create(input)

    expect(newRoute).toBeInstanceOf(Route)
    expect(newRoute.id).toBe(3)
    expect(newRoute.originId).toBe(input.originId)
    expect(newRoute.destinationId).toBe(input.destinationId)
    expect(newRoute.duration).toBe(input.duration)
    expect(newRoute.price).toBe(input.price)
    expect(newRoute.airlineId).toBe(input.airlineId)
  })

  test('delete a route', async () => {
    const mockRoute = { id: 1, originId: 1, destinationId: 2, duration: 120, price: 150, airlineId: 1 }
    pool.query.mockResolvedValueOnce({ rows: [mockRoute] })

    const deleted = await Route.delete(1)

    expect(deleted).toBeInstanceOf(Route)
    expect(deleted.id).toBe(1)
    expect(deleted.originId).toBe(mockRoute.originId)
    expect(deleted.destinationId).toBe(mockRoute.destinationId)
    expect(deleted.duration).toBe(mockRoute.duration)
    expect(deleted.price).toBe(mockRoute.price)
    expect(deleted.airlineId).toBe(mockRoute.airlineId)
  })

  test('delete returns null when route not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const deleted = await Route.delete(999)
    expect(deleted).toBeNull()
  })
})
