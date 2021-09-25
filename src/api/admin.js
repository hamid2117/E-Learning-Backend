import express from 'express'
import User from '../models/userModel.js'
import CourseModel from '../models/courseModel.js'
import asyncHandler from 'express-async-handler'
import { protect, admin } from './../auth/authMiddleware.js'
const router = express.Router()

//*@desc admin user
//*@Api GET /api/v1/users
//*@Access Admin

router.get(
  '/users',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const user = await User.find({})
    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

router.get(
  '/trainer',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.find({})
    const trianer = user.filter((data) => {
      return data.trainer === true
    })
    if (trianer) {
      res.json(trianer)
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)
router.get(
  '/trainercourses/:id',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select([
      '-password',
      '-isAdmin',
      '-createdAt',
      '-updatedAt',
    ])
    const courses = await CourseModel.find({ user: req.params.id })
    const trianer = {
      user,
      courses,
    }
    if (trianer) {
      res.json(trianer)
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

//*@desc Delete user by admin
//*@Api GET /api/v1/user/:id
//*@Access Admin

router.delete(
  '/user/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      await user.remove()
      res.json({ message: 'User removed' })
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

//*@desc admin user
//*@Api GET /api/v1/users
//*@Access Admin

router.get(
  '/user/:id',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-passowrd')

    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

//*@desc admin user
//*@Api Put /api/v1/user/:id
//*@Access Admin

router.put(
  '/user/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin
      user.trainer = req.body.trainer

      const updatedUser = await user.save()

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        createdAt: user.createdAt,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

export default router
