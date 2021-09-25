import express from 'express'
import CourseModel from '../models/courseModel.js'
import asyncHandler from 'express-async-handler'
import { protect, admin } from './../auth/authMiddleware.js'
// import ClassModel from '../models/classesModel.js'
import UserModel from '../models/userModel.js'

const router = express.Router()

// //*@desc Create a course
// //*@Api Post /api/v1/course
// //*@Access Private

router.post(
  '/course',
  protect,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id)
    const {
      heading,
      price,
      lessons,
      level,
      category,
      duration,
      language,
      description,
    } = req.body
    console.log(user.name)

    const course = new CourseModel({
      user: req.user._id,
      name: user.name,
      heading,
      price,
      lessons,
      level,
      category,
      duration,
      language,
      description,
    })
    const createdCourse = await course.save()
    if (createdCourse) {
      res.status(200).json({ message: 'Course is created' })
    } else {
      res.status(404).json({ message: 'Course is not create at this moment .' })
    }
  })
)

// //*@desc Get all courses
// //*@Api GET /api/v1/courses
// //*@Access Private

router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const data = await CourseModel.find()
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json({ message: 'Data not found' })
    }
  })
)

//*@desc get each course
//*@Api GET /api/v1/course/:id
//*@Access Private

router.get(
  '/course/:id',
  asyncHandler(async (req, res) => {
    const classs = await CourseModel.findById(req.params.id)
    if (classs) {
      res.status(200).json(classs)
    } else {
      res.status(404)
      throw new Error('classes not Found')
    }
  })
)
//*@desc get each course
//*@Api GET /api/v1/course/:id
//*@Access Private

router.get(
  '/courseuser',
  protect,
  asyncHandler(async (req, res) => {
    const classes = await CourseModel.find({ user: req.user._id })
    if (classes) {
      res.status(200).json(classes)
    } else {
      res.status(404)
      throw new Error('classes not Found')
    }
  })
)

//*@desc put each course
//*@Api put /api/v1/course/:id
//*@Access Private

router.put(
  '/course/:id',
  protect,
  asyncHandler(async (req, res) => {
    const course = await CourseModel.findById(req.params.id)
    if (course) {
      course.heading = req.body.heading || course.heading
      course.price = req.body.price || course.price
      course.lessons = req.body.lessons || course.lessons
      course.level = req.body.level || course.level
      course.description = req.body.description || course.description
      course.language = req.body.language || course.language
      course.duration = req.body.duration || course.duration
      course.category = req.body.category || course.category
      course.maxStudent = req.body.maxStudent || course.maxStudent
      course.image = req.body.image || course.image
      course.learn = req.body.learn || course.learn
      course.courseData = req.body.courseData || course.courseData
      course.material = req.body.material || course.material
      course.target = req.body.target || course.target
      course.requirement = req.body.requirement || course.requirement

      const updatedCourse = await course.save()

      res.status(200).json(updatedCourse)
    } else {
      res.status(404)
      throw new Error('User not Found')
    }
  })
)

//*@desc Delete course by admin
//*@Api GET /api/v1/course/:id
//*@Access Admin

router.delete(
  '/course/:id',
  protect,
  asyncHandler(async (req, res) => {
    const course = await CourseModel.findById(req.params.id)
    // const classs = await ClassModel.deleteMany({ course: req.params.id })
    if (course) {
      await course.remove()
      res.json({ message: 'Course removed' })
    } else {
      res.status(404)
      throw new Error('Course not Found')
    }
  })
)

export default router
