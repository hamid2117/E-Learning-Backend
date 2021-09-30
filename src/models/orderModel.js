import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    cart: [
      {
        heading: { type: String, required: true },
        amount: { type: Number, required: true },
        duration: { type: Number, required: true },
        lessons: { type: Number, required: true },
        price: { type: Number, required: true },
        id: { type: String, required: true },
      },
    ],
    paymentMethod: {
      type: String,
    },
    shippingAddress: {
      email: { type: String, required: true },
      debitCard: { type: String, required: true },
      address: { type: String, required: true },
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total_items: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

export default Order
