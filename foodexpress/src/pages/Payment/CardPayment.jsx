import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CardPayment = () => {
  const stripe = useStripe();       // ✅ lowercase
  const elements = useElements();   // ✅ hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe n'est pas encore prêt !");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      console.log("Token / PaymentMethod:", paymentMethod);
      alert("Paiement prêt à être envoyé au serveur !");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Payer
      </button>
    </form>
  );
};

export default CardPayment;
