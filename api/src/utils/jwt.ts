import type { Request, Response } from 'express'
import { expressjwt } from 'express-jwt'
import type jwt from 'jsonwebtoken'

interface JwtPayload {
  isAdmin: boolean
}

export default function authJwt() {
  const secret = process.env.SECRET || 'secret'
  const apiUrl = process.env.API_URL

  expressjwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevokedCallback,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      `${apiUrl}/users/login`,
      `${apiUrl}/users/register`,
    ],
  })
}

async function isRevokedCallback(
  req: Request,
  token: jwt.JwtPayload | undefined,
): Promise<boolean> {
  if (token && !token.isAdmin) {
    return true
  }

  return false
}
