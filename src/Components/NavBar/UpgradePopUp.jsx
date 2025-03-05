import React from 'react';
import tick from '../../assets/tick.png';
import proImage from '../../assets/ProImage.png';
import { Link } from 'react-router-dom';

export default function UpgradePopUp({ isOpen, onClose, uid, popupType }) {
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
                <div className='mt-[14px] flex justify-between'>
                  <div className=' pl-[40px] w-[80%]'>
                    <h1 className='mt-3 mb-8 text-3xl font-bold'>Go Pro. Cancel anytime.</h1>

                    <p className='my-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                    <div className='text-wrapper flex items-center gap-[15px]'>
                      <img src={tick} alt='' className='h-[12px] w-[15px]' />
                      <p>Unlimited decks</p>
                    </div>

                    <div className='text-wrapper flex items-center gap-[15px]'>
                      <img src={tick} alt='' className='h-[12px] w-[15px]' />
                      <p>Cancel anytime</p>
                    </div>

                    <div className='text-wrapper flex items-center gap-[15px]'>
                      <img src={tick} alt='' className='h-[12px] w-[15px]' />
                      <p>Full features</p>
                    </div>

                    <p className='text-1xl font-semibold text-[#676B5F] my-4'>Pro is just R99 ZAR/month</p>

                    <Link to='/checkout' className='mt-5 w-full font-bold text-slate-50 rounded-full py-4 bg-violet-800 px-6 block text-center'>
                      Try Pro
                    </Link>
                  </div>

                  <div className="proImage">
                    <img src={proImage} alt="" className='w-[200px] bottom-[0] left-[0] static'/>
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
