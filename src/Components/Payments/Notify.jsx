import React, { useEffect } from 'react'

export default function Notify() {
  useEffect(() => {
    async function confirmPaymentStatus() {
      console.log('gii')
      try {
        const response = await fetch('https://pink-days-send.loca.lt/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({passPhrase: 'jt7NOE43FZPn'})
        });

        if (response.ok) {
            const signatureResponse = await response.json();
            // setPayFastSignature(signatureResponse.signature)
            // console.log(signatureResponse.signature)
            // console.log(payFastSignature)
            console.log(signatureResponse)
            // paymentForm.current.submit();
        } else {
          console.error('Error generating signature');
        }

      } catch (error) {
        console.error('Error generating signature:', error);
      }
      // console.log(payFastSignature)
    }
    confirmPaymentStatus();
  }, [])

  return (
    <div>Notify</div>
  )
}
