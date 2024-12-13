import React from 'react';
import tick from '../../assets/tick.png';
import proImage from '../../assets/ProImage.png';
import { Link } from 'react-router-dom';

export default function BillingHistoryPopUp({ isOpen, onClose, uid, popupType }) {
  if (!isOpen) return null;

  return (
    <div className='relative z-[9999]'>
      <div className='fixed inset-0 bg-gray-900 bg-opacity-75' />

      <div className='fixed inset-0 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center items-center'>
          <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl my-8 w-full max-w-[872px]'>
            <div className='bg-white'>
              <div>
                <div className='flex items-center justify-between'>
                  <div className='text-[16px] font-semibold text-black pl-[40px] pt-[40px]'>Upgrade To Pro</div>

                  <button className='flex items-center justify-center pr-[40px] pt-[40px]' onClick={onClose}>
                    <ion-icon size='large' name='close-outline'></ion-icon>
                  </button>
                </div>
                <div className='my-[14px]'>
                  <div className=' pl-[40px] w-[80%]'>
                    <h1 className='mt-3 mb-8 text-3xl font-bold'>Go Pro. Cancel anytime.</h1>

                    <div className='flex justify-between'>
                        <p className='text-1xl font-semibold w-[90px]'>Date</p>
                        <p className='text-1xl font-semibold w-[90px]'>Paid</p>
                        <p className='text-1xl font-semibold w-[90px]'>Invoice</p>
                    </div>

                    <div className='flex justify-between mt-[25px]'>
                        <p className='text-1xl w-[90px]'>09/13/2024</p>
                        <p className='text-1xl w-[90px]'>R199</p>
                        <p className='text-1xl w-[90px]'>Download</p>
                    </div>

                    <div className='flex justify-between mt-[25px]'>
                        <p className='text-1xl w-[90px]'>09/13/2024</p>
                        <p className='text-1xl w-[90px]'>R199</p>
                        <p className='text-1xl w-[90px]'>Download</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
