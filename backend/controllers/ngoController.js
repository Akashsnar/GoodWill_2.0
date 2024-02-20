const asyncHandler = require("express-async-handler");

const checkout_session= asyncHandler(async (req, res)=>{
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: { currency: 'inr', product_data: { name: 'NGO-DONATION' }, unit_amount: 257619 },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/user',
    });
  
    res.redirect(303, session.url);
})


module.exports={
  checkout_session,

}
