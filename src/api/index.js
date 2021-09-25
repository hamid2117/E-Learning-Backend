import express from 'express'
import registerApi from './register.js'
import loginApi from './login.js'
import courseApi from './course.js'
import adminApi from './admin.js'
import UpdateProfileApi from './UpdateProfile.js'
import classesApi from './classes.js'
const router = express.Router()

router.use(courseApi)
router.use(classesApi)
router.use(courseApi)
router.use(registerApi)
router.use(loginApi)
router.use(adminApi)
router.use(UpdateProfileApi)
export default router
