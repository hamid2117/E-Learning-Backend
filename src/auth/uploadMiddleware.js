import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    //path.extname() will add .jpg .png in last ....
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname.toLowerCase()))
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Image only')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

export { upload }

// const upload = multer({
//   storage: Storage,
// }).single('image') //name of input (frontend)

// const Storage = multer.diskStorage({
//   destination: './public',
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + '_' + Date.now() + path.extname(file.originalname)
//     )
//   },
// })

// const upload = multer({
//   storage: Storage,
// }).single('image') //name of input (frontend)

//*@desc To upload an image
//*@Api PUT /api/v1/nationalidimg/:id   (User id )
//*@Access private (no token needed)

// router.put(
//   '/nationalidimg/:id',
//   asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id)

//     if (user) {
//       upload(req, res, async (err) => {
//         if (err) {
//           console.log(err)
//           console.log(req.file)
//           res.status(380).json(err)
//         } else {
//           user.img = req.file.path
//           await user.save()
//           res.status(205).json(req.file.path)
//         }
//       })
//     } else {
//       res.status(404).send({ message: 'User does not exist . ' })
//     }
//   })
// )
