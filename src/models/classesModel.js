import mongoose from 'mongoose'
//Already implement in coures ...
const videoSchema = mongoose.Schema(
  {
    heading: { type: String, required: true, default: '' },
    time: { type: String, required: true, default: '1:00' },
  },
  {
    timestamps: true,
  }
)

const classSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    heading: { type: String, required: true, default: '' },
    video: [videoSchema],
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Class', classSchema)

export default Product
