import crypto from 'crypto'

const base64urlEncode = input =>
  Buffer.from(input).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

const base64urlDecode = input => {
  const pad = 4 - (input.length % 4 || 4)
  const str = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  return Buffer.from(str, 'base64').toString()
}

const signHS256 = (data, secret) =>
  crypto.createHmac('sha256', secret).update(data).digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

export const createToken = (payload, { secret, expiresInSeconds = 3600 }) => {
  if (!secret) throw new Error('JWT secret required')

  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expiresInSeconds

  const fullPayload = { ...payload, iat, exp }

  const encodedHeader = base64urlEncode(JSON.stringify(header))
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload))
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const signature = signHS256(signingInput, secret)

  return `${signingInput}.${signature}`
}

export const verifyToken = (token, { secret }) => {
  if (!secret) throw new Error('JWT secret required')
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('Invalid token format')
  }

  const [encodedHeader, encodedPayload, signature] = token.split('.')
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const expectedSig = signHS256(signingInput, secret)

  // timing-safe compare
  const a = Buffer.from(signature)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Invalid signature')
  }

  const header = JSON.parse(base64urlDecode(encodedHeader))
  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new Error('Unsupported JWT header')
  }

  const payload = JSON.parse(base64urlDecode(encodedPayload))
  const now = Math.floor(Date.now() / 1000)
  if (typeof payload.exp === 'number' && now >= payload.exp) {
    throw new Error('Token expired')
  }
  return payload
}
