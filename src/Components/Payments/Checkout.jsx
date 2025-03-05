import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/authContext';

export default function Checkout() {
    const [platformMerchantId, setPlatformMerchantId] = useState(import.meta.env.VITE_MERCHANT_ID);
    const [platformMerchantKey, setPlatformMerchantkey] = useState(import.meta.env.VITE_MERCHANT_KEY);
    const [amount, setAmount] = useState('1450.00');
    const [passPhrase, setPassphrase] = useState(import.meta.env.VITE_PASSPHRASE);
    const [payFastSignature, setPayFastSignature] = useState('');
    const [today, setToday] = useState(null);
    const paymentForm = useRef(null);
    const { currentUser } = useAuth();
    const baseURL = 'https://3aad-41-216-202-52.ngrok-free.app';


  // Current date
  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    setToday(formattedDate);
  }, []);

  const generatePayFastSignature = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passPhrase: passPhrase })
      });
      if (response.ok) {
        const signatureResponse = await response.json();
        setPayFastSignature(signatureResponse.signature)
        paymentForm.current.submit();
      } else {
        console.error('Error generating signature');
      }
    } catch (error) {
      console.error('Error generating signature:', error);
    }
  }

  return (
    <>
      <div className='p-10'>
        <div>
          <Link to='/billing-overview' className='text-violet-700 font-bold hover:text-gray-400 flex block'>&lt; Back to Billing Overview</Link>
        </div>

        <h1 className='mt-3 mb-8 text-3xl font-bold'>Go Pro. Cancel anytime.</h1>

        <p>Unlimited decks</p>
        <p className='my-4'>Cancel anytime</p>
        <p>Full features</p>

        <div className='mt-8 p-5 border-2 border-solid border-slate-200'>
          <p className='mb-4 font-bold'>Your subscription</p>

          <p className='mb-4'>SocialPaste Pro &middot; R{amount}</p>
          <p className='mt-3 mb-8 text-3xl font-bold'>Due today &middot; R{amount}</p>

          <form ref={paymentForm} action="https://sandbox.payfast.co.za​/eng/process" method="post" onSubmit={(event) => generatePayFastSignature(event)}>
            <input type="hidden" name="merchant_id" value={platformMerchantId} />
            <input type="hidden" name="merchant_key" value={platformMerchantKey} />
            <input type="hidden" name="amount" value={amount} />
            <input type="hidden" name="item_name" value="Social Paste PRO" />
            <input type="hidden" name="return_url" value={`${baseURL}/return`} />
            <input type="hidden" name="cancel_url" value={`${baseURL}/cancel`} />
            <input type="hidden" name="notify_url" value={`${baseURL}/notify`} />
            <input type="hidden" name="signature" value={payFastSignature} />
            <input type="hidden" name="custom_str1" value={currentUser.uid} />
            <input type="hidden" name="subscription_type" value="1" />
            <input type="hidden" name="email_address" value='aaaasds@gmail.com' />
            <input type="hidden" name="billing_date" value={today} />
            <input type="hidden" name="recurring_amount" value={amount} />
            <input type="hidden" name="frequency" value="3" />
            <input type="hidden" name="cycles" value="12" />
            <input type="hidden" name="subscription_notify_email" value="true" />
            <input type="hidden" name="subscription_notify_webhook" value="true" />
            <input type="hidden" name="subscription_notify_buyer" value="true" />
            <input type="submit" className='w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800' value="Pay Now" />
          </form>
        </div>
      </div>
    </>
  )
}
