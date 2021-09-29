import express from 'express'
const router = express.Router()
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import { protect } from '../auth/authMiddleware.js'

//*@desc Fetch order for each user
//*@Api GET /api/v1/order/myorder
//*@Access private

router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    if (orders) {
      res.json(orders)
    } else {
      res.status(404)
    }
  })
)

//*@desc save orders in database
//*@Api POST /api/v1/orders
//*@Access Private

router.post(
  '/orders',
  protect,
  asyncHandler(async (req, res) => {
    const { cart, total_items, total_amount, paymentMethod, shippingAddress } =
      req.body
    if (cart && cart.length === 0) {
      res.status(400)
      throw new Error('No order items')
    } else {
      const order = new Order({
        cart,
        user: req.user._id,
        total_items,
        total_amount,
        paymentMethod,
        shippingAddress,
      })
      const createdOrder = await order.save()
      res.status(201).json(createdOrder)
    }
  })
)

//*@desc Fetch each order
//*@Api GET /api/v1/order/:id
//*@Access private

router.get(
  '/order/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    ) //to get email...
    if (order) {
      res.json(order)
    } else {
      res.status(404)
    }
  })
)

//*@desc update order
//*@Api GET /api/v1/order/:id/pay
//*@Access private

router.put(
  '/order/:id/pay',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      }
      const updatedOrder = await order.save()

      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order is not found')
    }
  })
)

router.get('/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
})

export default router
