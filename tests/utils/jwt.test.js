import { createToken, verifyToken } from '../../src/utils/jwt.js'

describe('JWT utils', () => {
  const secret = 'mysecret'
  const payload = { userId: 1 }

  test('createToken returns a string with 3 parts', () => {
    const token = createToken(payload, { secret, expiresInSeconds: 3600 })
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  test('verifyToken returns the original payload', () => {
    const token = createToken(payload, { secret, expiresInSeconds: 3600 })
    const decoded = verifyToken(token, { secret })
    expect(decoded.userId).toBe(payload.userId)
    expect(decoded.iat).toBeDefined()
    expect(decoded.exp).toBeDefined()
  })

  test('verifyToken throws on invalid signature', () => {
    const token = createToken(payload, { secret, expiresInSeconds: 3600 })
    const parts = token.split('.')
    parts[2] = 'invalidsignature' // modify sign
    const badToken = parts.join('.')
    expect(() => verifyToken(badToken, { secret })).toThrow('Invalid signature')
  })

  test('verifyToken throws on expired token', () => {
    const token = createToken(payload, { secret, expiresInSeconds: -10 })
    expect(() => verifyToken(token, { secret })).toThrow('Token expired')
  })

  test('verifyToken throws on invalid token format', () => {
    expect(() => verifyToken('invalid.jwt', { secret })).toThrow('Invalid token format')
  })

  test('verifyToken throws without secret', () => {
    const token = createToken(payload, { secret })
    expect(() => verifyToken(token, { secret: null })).toThrow('JWT secret required')
  })
})
