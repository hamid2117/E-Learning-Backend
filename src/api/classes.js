import express from 'express'
import asyncHandler from 'express-async-handler'
import { protect } from './../auth/authMiddleware.js'
import ClassModel from '../models/classesModel.js'

const router = express.Router()

// //*@desc Create a class
// //*@Api POST /api/v1/class
// //*@Access Private

router.post(
  '/class/:id',
  protect,
  asyncHandler(async (req, res) => {
    const {
      coursetitle,
      charges,
      lecturelink,
      coursedescription,
      maxstudents,
      timepayment,
    } = req.body

    const course = new ClassModel({
      user: req.user._id,
      course: req.params.id,
      coursetitle,
      charges,
      lecturelink,
      coursedescription,
      maxstudents,
      timepayment,
    })
    const createdClass = await course.save()
    if (createdClass) {
      res.status(200).json({ message: 'Course is created' })
    } else {
      res.status(404).json({ message: 'Course is not create at this moment .' })
    }
  })
)

// //*@desc Get all classes
// //*@Api GET /api/v1/classes
// //*@Access Private

router.get(
  '/classes',
  protect,
  asyncHandler(async (req, res) => {
    const data = await ClassModel.find()
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json({ message: 'Data not found' })
    }
  })
)

//*@desc get each classes of specific Course
//*@Api GET /api/v1/classes/:id
//*@Access Private

router.get(
  '/classes/:id',
  protect,
  asyncHandler(async (req, res) => {
    const classs = await ClassModel.find({ course: req.params.id })
    if (classs) {
      res.status(200).json(classs)
    } else {
      res.status(404)
      throw new Error('classes not Found')
    }
  })
)

//*@desc get each User Classes
//*@Api GET /api/v1/classuser
//*@Access Private

router.get(
  '/classuser',
  protect,
  asyncHandler(async (req, res) => {
    const classes = await ClassModel.find({ user: req.user._id })
    if (classes) {
      res.status(200).json(classes)
    } else {
      res.status(404)
      throw new Error('classes not Found')
    }
  })
)

//*@desc put each classes
//*@Api put /api/v1/classes/:id
//*@Access Private

router.put(
  '/classes/:id',
  protect,
  asyncHandler(async (req, res) => {
    const classes = await ClassModel.findById(req.params.id)
    if (classes) {
      classes.coursetitle = req.body.coursetitle || classes.coursetitle
      classes.charges = req.body.charges || classes.charges
      classes.lecturelink = req.body.lecturelink || classes.lecturelink
      classes.maxstudents = req.body.maxstudents || classes.maxstudents
      classes.timepayment = req.body.timepayment || classes.timepayment
      classes.couresdescription =
        req.body.couresdescription || classes.couresdescription
      const updatedCourse = await classes.save()

      res.status(200).json({
        _id: updatedCourse._id,
        coursetitle: updatedCourse.coursetitle,
        charges: updatedCourse.charges,
        lecturelink: updatedCourse.lecturelink,
        maxstudents: updatedCourse.maxstudents,
        timepayment: updatedCourse.timepayment,
        couresdescription: updatedCourse.couresdescription,
      })
    } else {
      res.status(404)
      throw new Error('class not Found')
    }
  })
)

//*@desc Delete class
//*@Api GET /api/v1/class/:id
//*@Access Private

router.delete(
  '/class/:id',
  protect,
  asyncHandler(async (req, res) => {
    const classes = await ClassModel.findById(req.params.id)

    if (classes) {
      await classes.remove()
      res.json({ message: 'Class removed' })
    } else {
      res.status(404)
      throw new Error('Class not Found')
    }
  })
)

export default router
