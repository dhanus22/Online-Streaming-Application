import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-subscription", async (req, res) => {
  const { email, paymentMethodId } = req.body;

  const customer = await stripe.customers.create({
    email,
    payment_method: paymentMethodId,
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_PRICE_ID }],
    expand: ["latest_invoice.payment_intent"],
  });

  res.json({ subscription });
});
