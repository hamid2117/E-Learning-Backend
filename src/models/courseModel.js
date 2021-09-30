import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: false,
  }
)
const learnSchema = mongoose.Schema(
  {
    point: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  }
)
const requirementSchema = mongoose.Schema(
  {
    point: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  }
)
const materialSchema = mongoose.Schema(
  {
    heading: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  }
)
const videoSchema = mongoose.Schema(
  {
    _id: { type: String },
    heading: { type: String },
    time: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  }
)
const courseDataSchema = mongoose.Schema(
  {
    heading: { type: String },
    video: [videoSchema],
  },
  {
    timestamps: true,
    _id: false,
  }
)
const targetSchema = mongoose.Schema(
  {
    point: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  }
)

const courseSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    heading: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, required: true },
    enrolled: { type: Number, required: true, default: 0 },
    star: { type: Number, required: true, default: 0 },
    review: { type: Number, required: true, default: 0 },
    lessons: { type: Number, required: true, default: 0 },
    duration: { type: Number, required: true, default: 0 },
    maxStudent: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true, default: '/teacher.jpg' },
    learn: [learnSchema],
    requirement: [requirementSchema],
    courseData: [courseDataSchema],
    target: [targetSchema],
    material: [materialSchema],
  },
  { timestamps: true }
)

const Product = mongoose.model('Course', courseSchema)

export default Product
