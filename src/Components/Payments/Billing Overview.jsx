import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LightningIcon from '../Icons/LightningIcon';
import Card from '../../assets/Card.png';
import Coin from '../../assets/Coin.png';
import Lightning from '../../assets/Lightning.png';
import BillingHistoryPopUp from '../NavBar/BillingHistoryPopUp';

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
        body: JSON.stringify({ uid: uid, subscriptionToken: subscriptionToken }),
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
        body: JSON.stringify({ uid: uid, subscriptionToken: subscriptionToken, planStatus: planStatus }),
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

  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
  const toggleCreateDeckPopup = () => {
      setIsCreateDeckOpen(!isCreateDeckOpen)
  }

  return (
    <div className='bg-[#F6F7F5] '>
      <Transactions isOpen={isTransactionsPopupOpen} onClose={toggleTransactionsPopup} ownerId={uid} />
      {/* <BillingHistoryPopUp isOpen={isCreateDeckOpen} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} popupType="team" /> */}

      <div className='p-10'>
        <div>
          <Link to='/dashboard' className='text-violet-700 font-bold hover:text-gray-400 flex block'>
            &lt; Back to dashboard
          </Link>
        </div>
        {/* {plan} */}

        <div className='bg-[#fff] rounded-[10px] p-[10px] mt-[53px]'>
          <h1 className='mt-3 mb-8 text-3xl font-bold'>Subscription</h1>

          {plan === 'FREE' && (
            <>
              Current Plan: {plan}
              <br />
              <br />
              Every month on the 1st, R199 (inclu.VAT)
              <Link to='/checkout' className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center'>
                Try Pro
              </Link>
            </>
          )}

          {plan === 'PRO' && (
            <>
              <div className='text-wrapper flex items-center gap-[15px]'>
                <img src={Lightning} alt='' className='h-[14px] w-[10px] static' />
                <p>Current Plan: {plan}</p>
              </div>
              <br />
              <br />
              <div className='text-wrapper flex items-center gap-[15px]'>
                <img src={Coin} alt='' className='h-[16px] w-[16px] static' />
                <p>Plan Status: {planStatus}</p>
              </div>
              <br />
              <br />
              <div className='text-wrapper flex items-center gap-[15px]'>
                <img src={Card} alt='' className='h-[11px] w-[14px] static' />
                <p>Plan Status: {planStatus}</p>
              </div>
              <br />
              <br />
              Every month on the 1st, R199 (inclu.VAT)
              <button
                type='button'
                className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center'
                onClick={pausePlan}
              >
                {planStatus === 'ACTIVE' ? 'Pause' : 'Unpause'}
              </button>
              <button
                type='button'
                className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center'
                onClick={cancelPlan}
              >
                Cancel subscription
              </button>
            </>
          )}
        </div>

        {plan === 'PRO' && (
            <div className='mt-[50px] bg-[#fff] rounded-[10px] p-[10px]'>
              <strong>Billing history</strong>

              <button
                type='button'
                className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center'
                onClick={toggleTransactionsPopup}
              >
                View History
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
