import { compareSync, hashSync } from 'bcrypt'
import { type Request, type Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const userList = await User.find().select('-passwordHash')

  if (!userList) {
    res.status(500).json({ success: false })
  }
  res.send(userList)
})

router.get('/:id', async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-passwordHash')

  if (!user) {
    res
      .status(500)
      .json({ message: 'The user with the given ID was not found' })
  }
  res.status(200).send(user)
})

router.post('/', async (req: Request, res: Response) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })

  user = await user.save()

  if (!user) {
    return res.status(404).send('The user cannot be created')
  }
  res.send(user)
})

router.post('/login', async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email })
  const secret = process.env.SECRET || 'secret'

  if (!user) {
    res.status(400).send('The user not found')
  }

  if (user && compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: '1d' },
    )
    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send('Password is wrong')
  }

  //   return res.status(200).send(user)
})

export default router
