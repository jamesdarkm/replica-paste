import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import { db, storage } from '../../../firebase';

import {
    doc,
    addDoc,
    setDoc,
    getDoc, collection, getDocs
} from 'firebase/firestore';




const Profile = ({ isOpen, onClose, uid, userData }) => {
    if (!isOpen) return null;

    const [email, setEmail] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/send-email', {
                email: email,
            });

            setEmail('');
            setResponse('Invitation successfully sent!');
        } catch (error) {
            setResponse(
                'Failed to send email, please reach out to support@paste-replica.io'
            );
        }
    };


    

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
                                   <h2 className="text-4xl font-bold">Profile and security</h2>

                                    <hr className='mt-8 mb-5 flex-grow border-t border-gray-300' />

                                    <p className="mb-6 text-lg font-bold">Profile</p>
                                    <div className='flex items-center justify-center w-10 h-10 rounded-full p-10 text-3xl bg-purple-500 font-bold'>
                                        JL
                                    </div>
                                    
                                    <form className="mt-5" onSubmit={handleSubmit}>
                                    <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</label>
            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required  />
        </div>
        <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</label>
            <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
        </div>
    </div>
    <div className="mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required />
    </div> 
                                        <div className='flex flex-row gap-3'>
                                            
                                            <button
                                                type='submit'
                                                className='py-4 basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>

                                    <hr className='mt-8 mb-8 flex-grow border-t border-gray-300' />

                                    <h4 className="mb-6 text-lg font-bold">Change your password</h4>

                                    <p className='mb-5 leading-8'>Need a little (password) change? We got you. Just hit the button below and we’ll send an email to james@darkm.co.za with a link to change your password.</p>

                                    <button
                                                type='submit'
                                                className='py-4 px-8 basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                                            >
                                                Send email
                                            </button>
                                    {response && (
                                        <div
                                            className='mt-4 bg-green-500 text-sm text-white text-center rounded-lg p-4'
                                            role='alert'
                                        >
                                            {response}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;