import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../Context/authContext';
import Transactions from './Transactions';
export default function BillingOverview() {
  const { currentUser } = useAuth();

  const [plan, setPlan] = useState(currentUser.additionalInformation.plan);
  const [planStatus, setPlanStatus] = useState(currentUser.additionalInformation.planStatus);

  const [isTransactionsPopupOpen, setIsTransactionsPopupOpen] = useState(false);
  const toggleTransactionsPopup = () => {
    setIsTransactionsPopupOpen(!isTransactionsPopupOpen);
  };

  const uid = currentUser.uid;
  const subscriptionToken = currentUser.additionalInformation.subscriptionToken;

  const cancelPlan = async () => {
    try {
      const response = await fetch('http://localhost:5000/cancel-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uid, subscriptionToken: subscriptionToken }) 
      });
      if (response.ok) {
        setPlan('FREE');
        setPlanStatus('CANCELLED');
        const data = await response.json(); 
        console.log('herer');
        console.log(data);
      } else {
        console.error('Error generating signature');
      }
    } catch (error) {
      console.error('Error generating signature:', error);
    }
  };

  const pausePlan = async () => {
    try {
      const response = await fetch('http://localhost:5000/pause-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: uid, subscriptionToken: subscriptionToken, planStatus: planStatus }) 
      });
      if (response.ok) {
        const data = await response.json();         
        setPlanStatus(data.planStatus);
      } else {
        console.error('Error generating signature');
      }
    } catch (error) {
      console.error('Error generating signature:', error);
    }
  };
  
  return (
    <>
      <Transactions isOpen={isTransactionsPopupOpen} onClose={toggleTransactionsPopup} ownerId={uid} />

      <div className='p-10'>
        <div>
          <Link to='/dashboard' className='text-violet-700 font-bold hover:text-gray-400 flex block'>&lt; Back to dashboard</Link>
        </div>
        {plan}
        <h1 className='mt-3 mb-8 text-3xl font-bold'>Subscription</h1>

        {plan === 'FREE' && (
          <>
            Current Plan: {plan}<br /><br />
            Every month on the 1st, R199 (inclu.VAT)

            <Link to='/checkout' className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center'>Try Pro</Link>
          </>
        )
        }

        {plan === 'PRO' && (
          <>
            Current Plan: {plan}<br /><br />
            Plan Status: {planStatus}<br /><br />
            Every month on the 1st, R199 (inclu.VAT)

            <button type="button" className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center' onClick={pausePlan}>{planStatus === 'ACTIVE' ? 'Pause' : 'Unpause'}</button>
            
            <button type="button" className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-red-800 px-6 block text-center' onClick={cancelPlan}>Cancel subscription</button>

            <br /><br /><br /><br />
            <strong>Billing history</strong><br /><br />
            <button type="button" className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center' onClick={toggleTransactionsPopup}>View History</button>
          </>
        )
        }

      </div>
    </>
  )
}
