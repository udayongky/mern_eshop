import type { NextFunction, Request, Response } from 'express'

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'The user is not authorized' })
  }

  if (err.name === 'ValidationError') {
    return res.status(401).json({ message: 'The user is not valid' })
  }

  return res.status(500).json({ message: err })
}
