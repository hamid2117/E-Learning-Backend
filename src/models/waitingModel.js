import mongoose from 'mongoose'

const watingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    aprove: false,
  },
  { timestamps: true }
)

const Order = mongoose.model('Wait', watingSchema)

export default Order
