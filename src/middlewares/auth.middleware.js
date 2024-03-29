import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization

  if (!authorization) return res.json(console.log(401, 'Not authorized'))

  const splits = authorization.split(' ')

  if (splits.length !== 2 && splits[0] !== 'Bearer') return res.json(setError(400, 'Not Bearer'))

  const jwtStringify = splits[1]

  jwt.verify(jwtStringify, process.env.SECRET, (err, verifiedJwt) => {
    if (err) {
      console.log(500, 'Token invalid')
    } else {
      const authority = {
        id: verifiedJwt.id,
        name: verifiedJwt.name
      }

      req.authority = authority

      next()
    }
  })
}
