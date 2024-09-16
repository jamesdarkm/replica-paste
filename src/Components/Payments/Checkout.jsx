import React, { useState, useRef, useEffect } from 'react'

export default function Checkout() {
    const [platformMerchantId, setPlatformMerchantId] = useState(import.meta.env.VITE_MERCHANT_ID);
    const [platformMerchantKey, setPlatformMerchantkey] = useState(import.meta.env.VITE_MERCHANT_KEY);
    const [amount, setAmount] = useState('1450.00');
    const [passPhrase, setPassphrase] = useState(import.meta.env.VITE_PASSPHRASE);
    const [payFastSignature, setPayFastSignature] = useState('');
    const paymentForm = useRef(null);

    const generatePayFastSignature = async (e) => {
      e.preventDefault();

      try {
          const response = await fetch('http://localhost:5000/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({passPhrase: passPhrase})
          });
          if (response.ok) {
              const signatureResponse = await response.json();
              setPayFastSignature(signatureResponse.signature)
              // console.log(signatureResponse.signature)
              console.log(payFastSignature)
              paymentForm.current.submit();
          } else {
            console.error('Error generating signature');
          }
      } catch (error) {
        console.error('Error generating signature:', error);
      }
      // console.log(payFastSignature)
    }

    useEffect(() => {
      console.log(platformMerchantId, platformMerchantKey, amount)
    }, [])

    return (
      <form ref={paymentForm} action="https://sandbox.payfast.co.za​/eng/process" method="post" onSubmit={(event) => generatePayFastSignature(event)}>
        <input type="hidden" name="merchant_id" value={platformMerchantId} />
        <input type="hidden" name="merchant_key" value={platformMerchantKey} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="item_name" value="Social Paste" />
        <input type="hidden" name="return_url" value="https://f96a-197-184-176-59.ngrok-free.app/return" />
        <input type="hidden" name="cancel_url" value="https://f96a-197-184-176-59.ngrok-free.app/cancel" />
        <input type="hidden" name="notify_url" value="https://webhook.site/7e8f25b8-b293-424b-9bb3-7b2a6784def3" />
        <input type="hidden" name="signature" value={payFastSignature} />
        <input type="submit" value="Pay Now"/>
      </form>
    )
}
