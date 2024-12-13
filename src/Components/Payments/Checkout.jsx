import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tick from '../../assets/tick.png';
import { useAuth } from '../../Context/authContext';
import LightningIcon from '../Icons/LightningIcon';

export default function Checkout() {
  // const [platformMerchantId, setPlatformMerchantId] = useState(import.meta.env.VITE_MERCHANT_ID);
  // const [platformMerchantKey, setPlatformMerchantkey] = useState(import.meta.env.VITE_MERCHANT_KEY);
  // const [amount, setAmount] = useState('1450.00');
  // const [passPhrase, setPassphrase] = useState(import.meta.env.VITE_PASSPHRASE);
  // const [payFastSignature, setPayFastSignature] = useState('');
  // const paymentForm = useRef(null);
  // const baseURL = 'https://3aad-41-216-202-52.ngrok-free.app';

  // // Current date
  // useEffect(() => {
  //   const currentDate = new Date();
  //   const formattedDate = currentDate.toISOString().split('T')[0];
  //   setToday(formattedDate);
  // }, []);

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
        console.log(signatureResponse)
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

  // useEffect(() => {
  //   console.log(platformMerchantId, platformMerchantKey, amount)
  // }, [])

  return (
    <section className='lg:flex'>
    
      <div className='p-10'>
        <div>
          <Link to='/dashboard/billing-overview' className='text-violet-700 font-bold hover:text-gray-400 flex block'>
            &lt; Back to plans
          </Link>
        </div>

        <div className='wrapper pl-[140px] mt-[53px]'>
          <h1 className='mt-3 mb-8 text-3xl font-bold'>Go Pro. Cancel anytime.</h1>

          <div className='text-wrapper flex items-center gap-[15px]'>
            <img src={tick} alt='' className='h-[12px] w-[15px] static' />
            <p>Unlimited decks</p>
          </div>

          <div className='text-wrapper flex items-center gap-[15px]'>
            <img src={tick} alt='' className='h-[12px] w-[15px] static' />
            <p>Cancel anytime</p>
          </div>

          <div className='text-wrapper flex items-center gap-[15px]'>
            <img src={tick} alt='' className='h-[12px] w-[15px] static' />
            <p>Full features</p>
          </div>
          
          <p className='my-4'>Cancel anytime</p>
          <p>Full features</p>

          <div className='w-[522px] border-[1px] border-[solid] border-[border] rounded-[26px] mt-[53px]'>
            <div className='border-b-[1px] border-[border] p-[25px]'>
              <p className='text-1xl font-semibold'>Your Subscription</p>
            </div>
            <div className='border-b-[1px] border-[border] p-[25px]'>
              <p className='text-1xl font-semibold text-[#676B5F]'>SocialPaste Pro</p>
            </div>
            <div className='flex justify-between p-[25px]'>
              <p className='text-3xl font-extrabold'>Due Today</p>
              <p className='text-3xl font-extrabold'>R99</p>
            </div>

            <div className=' p-[25px]'>
              <button className='flex  justify-center items-center p-[15px] bg-[#F6F7F5] rounded-[100px] text-[#E0E2D9] w-[100%]'>
                <LightningIcon className='w-12 group-hover:invert' />
                Update to Pro
              </button>

              <p className='mx-[auto] mt-[20px] text-center'>You can cancel anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
