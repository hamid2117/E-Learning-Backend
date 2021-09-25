import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Class',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    paymentMethod: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
