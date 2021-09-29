import stripe from 'stripe'

const processPayment = asyncHandler(async (req, res, next) => {
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
