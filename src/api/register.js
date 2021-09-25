import express from 'express'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import nodemailer from 'nodemailer'
import generateToken from '../auth/genrateToken.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, address, teacher, email, password } = req.body
    const alreadyExist = await User.findOne({ email })
    if (alreadyExist) {
      return res
        .status(409)
        .json({ status: 'error', error: 'email already in use' })
    } else {
      const user = await User.create({
        name,
        address,
        teacher,
        email,
        password,
      })
      if (user) {
        let emailToken = generateToken(user._id)
        const url = `http://localhost:5000/api/v1/confirmation/${emailToken}`
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
      error: 'Cannot register user at the moment',
    })
  })
)

router.get(
  '/confirmation/:token',
  asyncHandler(async (req, res) => {
    const decode = jwt.verify(req.params.token, 'dimahdani9530')
    let code = decode.id
    const user = await User.findById(code)
    if (user) {
      user.confirmation = true
      await user.save()
      return res.redirect('http://localhost:3000/account')
    }
  })
)

export default router
