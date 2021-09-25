import express from 'express'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../auth/genrateToken.js'
import { protect } from './../auth/authMiddleware.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

//*@desc update profile
//*@Api PUT /api/v1/profile
//*@Access Private

const router = express.Router()

router.put(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
      user.name = req.body.name || user.name
      user.address = req.body.address || user.address
      user.email = req.body.email || user.email
      user.teacher = req.body.teacher
      const updatedUser = await user.save()

      res.status(200).json({
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        address: updatedUser.address,
        teacher: updatedUser.teacher,
        token: generateToken(user._id),
      })
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

//*@desc update password
//*@Api PUT /api/v1/api/changepassword
//*@Access Private

router.post(
  '/changepassword',
  protect,
  asyncHandler(async (req, res) => {
    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
      return res
        .status(390)
        .json({ status: 'error', error: 'Invalid password' })
    }

    if (!token) {
      return res.status(400).json({ error: 'Authentication Error is occured' })
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: 'error',
        error: 'Password too small. Should be atleast 6 characters',
      })
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET)
      const _id = user.id

      const password = await bcrypt.hash(plainTextPassword, 10)

      await User.updateOne(
        { _id },
        {
          $set: { password },
        }
      )
      res.status(201).json({ status: 'ok' })
    } catch (error) {
      console.log(error)
      res.status(398).json({ status: 'error', error: ';))' })
    }
  })
)

router.post(
  '/updatepassword',
  protect,
  asyncHandler(async (req, res) => {
    const { token, newpassword: plainTextPassword, oldpassword } = req.body
    const userIdentity = await User.findById(req.user._id)
    console.log(req.user)
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
      return res
        .status(390)
        .json({ status: 'error', error: 'Invalid password' })
    }

    if (!token) {
      return res.status(400).json({ error: 'Authentication Error is occured' })
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: 'error',
        error: 'Password too small. Should be atleast 6 characters',
      })
    }
    console.log(oldpassword)
    if (oldpassword && (await userIdentity.matchPassword(oldpassword))) {
      try {
        const user = jwt.verify(token, 'dimahdani9530')
        const _id = user.id
        const userData = await User.findById(user.id)
        const password = await bcrypt.hash(plainTextPassword, 10)
        await User.updateOne(
          { _id },
          {
            $set: { password },
          }
        )
        res.status(200).json({
          name: userData.name,
          email: userData.email,
          isAdmin: userData.isAdmin,
          address: userData.address,
          teacher: userData.teacher,
          token: generateToken(user.id),
        })
      } catch (error) {
        console.log(error)
        res.status(398).json({ status: 'error', error: ';))' })
      }
    } else {
      return res.status(380).json({ error: 'Wronge Password' })
    }
  })
)

router.post(
  '/forgetpassword',
  asyncHandler(async (req, res) => {
    const { email } = req.body
    const alreadyExist = await User.findOne({ email })
    if (!alreadyExist) {
      return res
        .status(404)
        .json({ status: 'error', error: 'email is Registered yet.' })
    } else {
      if (alreadyExist) {
        let emailToken = generateToken(alreadyExist._id)
        const url = `http://localhost:5000/api/v1/updatepassword/${emailToken}`
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'hamidmehmood2117@gmail.com',
            pass: 'dimah9530',
          },
        })
        const mailOptions = {
          from: 'vindication@enron.com',
          to: email,
          subject: 'Confirm Email',
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
        }
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log('Email sent: ' + info.response)
          }
        })
        res.status(201).json({
          message: 'Done',
        })
      }
    }
    return res.status(500).json({
      status: 'error',
      error: 'Cannot do this  at the moment',
    })
  })
)

//*@desc update password
//*@Api PUT /api/v1/api/changepassword
//*@Access Private

router.get(
  '/updatepassword/:token',
  asyncHandler(async (req, res) => {
    const decode = jwt.verify(req.params.token, 'dimahdani9530')
    let code = decode.id
    const user = await User.findById(code)

    if (!user) return res.status(404).json({ message: 'Email is not found !' })
    const token = generateToken(user._id)
    if (user) {
      return res.redirect(`http://localhost:3000/updatepassword/${token}`)
    }
  })
)

export default router
