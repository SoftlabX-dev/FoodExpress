import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CardPayment from "./CardPayment";
const PUBLIC_KEY = "pk_test_51STUmYAwJKDGUmZXegQiIzmYXxfpfX5kjrodRGNhMGGstBg2AjmFxOt7EJKNPZT7ybiP4cPi1wDbvjg8QZCs5WxZ00jfBBZyv2";
const stripePromise = loadStripe(PUBLIC_KEY);

const Stripe = () => (
  <Elements stripe={stripePromise}>
    <CardPayment />
  </Elements>
);

export default Stripe;

