import express from 'express'
const router = express.Router()
import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Course from '../models/courseModel.js'
import { protect } from '../auth/authMiddleware.js'
import stripe from 'stripe'

/**
@desc Fetch order for each user
@Api GET /api/v1/order/myorder
@Access private
*/
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

/**
@desc save orders in database
@Api POST /api/v1/orders
@Access Private
*/
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

/**
@desc Fetch each order
@Api GET /api/v1/order/:id
@Access private
*/

router.get(
  '/order/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email') //to get email...
    if (order) {
      res.json(order)
    } else {
      res.status(404)
    }
  })
)

/** 
 @desc update order
 @Api GET /api/v1/order/:id/pay
 @Access private
*/
router.put(
  '/order/:id/pay',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()

      const updatedOrder = await order.save()

      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order is not found')
    }
  })
)

/** 
 @desc strip test api
 @Api POST /api/v1/payment/process
 @Access private
*/

router.post(
  '/payment/process',
  protect,
  asyncHandler(async (req, res) => {
    const stripee = new stripe(
      'sk_test_51JeelRHccMwtVSnhVu2rd6SdLOVFJljeIxuPerltqVidIl3s2WPhLKjfaJXSuKa9y8LnWYhq9C4p7H4H2tmyjV9z004H0yuh5p'
    )
    const paymentIntent = await stripee.paymentIntents.create({
      amount: req.body.total_amount,
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' },
    })
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    })
  })
)
router.get(
  '/stripekey',
  protect,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      apiKey:
        'pk_test_51JeelRHccMwtVSnhoI75VrnYVltM482LwOoJutShgdEF1DKfS8WjrCf4aRwP8KfCNXP6htRYjO7ktJMIfUSIEFiw00UIP4KzEf',
    })
  })
)
router.get(
  '/video/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order.isPaid) {
      const data = order.cart[0].id
      const course = await Course.findById(data)
      console.log(course)
      res
        .status(200)
        .json({ courseData: course.courseData, heading: course.heading })
    } else {
      res.status(378).json('not paid')
    }
    res.status(500).json('somthing wronge')
  })
)

export default router
