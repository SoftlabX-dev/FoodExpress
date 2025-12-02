import React, { useEffect, useRef } from "react";

function PayPalButton({ amount, onSuccess }) {
  const paypalRef = useRef();

  useEffect(() => {
     if (!paypalRef.current) return;
  // empêche double rendu
  if (paypalRef.current.hasChildNodes()) return;

    window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        },

        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          // Notifie ton backend laravel
          onSuccess(order);
        },
      })
      .render(paypalRef.current);
  }, []);

  return <div ref={paypalRef}></div>;
}

export default PayPalButton;
