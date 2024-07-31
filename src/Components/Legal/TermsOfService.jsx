import React, { useState } from 'react';

const TermsOfService = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className='relative z-10'>
            <div className='fixed inset-0 bg-gray-900 bg-opacity-75' />
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex justify-end text-center'>
                    <div className='relative h-screen transform overflow-hidden bg-white text-left shadow-xl w-11/12'>
                        <div className='bg-white'>
                            <div>
                                <div className=' border-solid border-b-2 border-slate-200 py-4 px-6 '>
                                    <button
                                        className='flex items-center justify-center'
                                        onClick={onClose}
                                    >
                                        <ion-icon
                                            size='large'
                                            name='close-outline'
                                        ></ion-icon>
                                    </button>
                                </div>
                                <div className='mt-7 m-auto w-6/12'>
                                    <h2 className='text-4xl font-bold'>
                                        Terms of Services
                                    </h2>

                                    <p className='mt-8 mb-5 leading-8'>
                                       Terms of services copy goes here...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;