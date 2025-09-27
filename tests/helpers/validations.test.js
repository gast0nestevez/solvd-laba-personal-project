import {
  validateAirport,
  validateRoute,
  validateAirline,
  validateFlight
} from '../../src/helpers/validations.js'

describe('Validations', () => {
  describe('validateAirport', () => {
    test('valid airport passes', () => {
      expect(() =>
        validateAirport('EZE', 'Ministro Pistarini', 'Buenos Aires', 'Argentina', -34.82, -58.53)
      ).not.toThrow()
    })

    test('throws when fields missing', () => {
      expect(() =>
        validateAirport(null, 'Ministro Pistarini', 'Buenos Aires', 'Argentina', -34.82, -58.53)
      ).toThrow('All fields are required')
    })

    test('throws on invalid IATA code', () => {
      expect(() =>
        validateAirport('EZ', 'Ministro Pistarini', 'Buenos Aires', 'Argentina', -34.82, -58.53)
      ).toThrow('Invalid IATA code')
    })

    test('throws on invalid coordinates', () => {
      expect(() =>
        validateAirport('EZE', 'Ministro Pistarini', 'Buenos Aires', 'Argentina', -100, -200)
      ).toThrow('Latitude or longitude out of range')
    })
  })

  describe('validateRoute', () => {
    test('valid route passes', () => {
      expect(() => validateRoute(1, 2, 180, 200, 1)).not.toThrow()
    })

    test('throws when origin equals destination', () => {
      expect(() => validateRoute(1, 1, 180, 200, 1))
        .toThrow('Origin and destination cannot be the same')
    })

    test('throws when duration negative', () => {
      expect(() => validateRoute(1, 2, -10, 200, 1))
        .toThrow('`price` and `duration` must be positive integers')
    })

    test('throws when price negative', () => {
      expect(() => validateRoute(1, 2, 180, -50, 1))
        .toThrow('`price` and `duration` must be positive integers')
    })
  })

  describe('validateAirline', () => {
    test('valid airline passes', () => {
      expect(() => validateAirline('Delta')).not.toThrow()
    })

    test('throws when name missing', () => {
      expect(() => validateAirline(null)).toThrow('All fields are required')
    })
  })

  describe('validateFlight', () => {
    test('valid flight passes', () => {
      const departure = new Date('2025-09-25T10:00:00Z')
      const arrival = new Date('2025-09-25T14:00:00Z')
      expect(() => validateFlight(departure, arrival)).not.toThrow()
    })

    test('throws when departure after arrival', () => {
      const departure = new Date('2025-09-25T16:00:00Z')
      const arrival = new Date('2025-09-25T14:00:00Z')
      expect(() => validateFlight(departure, arrival))
        .toThrow('Departure time must be earlier than arrival time')
    })
  })
})
