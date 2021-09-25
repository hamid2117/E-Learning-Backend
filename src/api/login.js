import express from 'express'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../auth/genrateToken.js'

//*@desc Auth the user
//*@Api GET /api/v1/login
//*@Access Public

const router = express.Router()

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ message: 'Email is not found !' })

    if (user && user.confirmation === false) {
      return res.status(409).json({ message: 'Please confirm your email .' })
    }

    if (user && password && (await user.matchPassword(password))) {
      res.json({
        name: user.name,
        email: user.email,
        address: user.address,
        teacher: user.teacher,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      return res.status(403).json({ message: 'Wronge password!' })
    }
  })
)

export default router
