import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Tests = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);

    /**
     * Test data
     */
    useEffect(() => {
        fetch('./src/Components/Dashboard/test-data.json')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    /**
     * Modal toggle
     */
    const toggleModal = () => {
        setModal(!modal);
    };

    /**
     * Hide the scrollbar when modal is active
     */
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }

    return (
        <>
            <div className='flex'>
                <div class='h-screen w-64 p-4 z-10'>
                    <div className='flex items-center justify-between'>
                        <Link
                            to='/'
                            className='flex items-center justify-between'
                        >
                            <div className='flex items-center justify-center w-10 h-10 rounded-md p-6 bg-purple-500 font-bold'>
                                N
                            </div>

                            <span className='ml-3 text-base font-bold'>
                                ND's Team
                            </span>
                        </Link>
                        <Link
                            to='/'
                            className='flex items-center justify-center w-10 h-10 rounded-full border-solid border-2 border-slate-200 rounded-full font-bold'
                        >
                            <ion-icon
                                size='small'
                                name='notifications-outline'
                            ></ion-icon>
                        </Link>
                    </div>

                    <ul role='list' className='mt-10 space-y-4'>
                        <li>
                            <Link
                                to='/'
                                className='hover:text-gray-400 flex block'
                            >
                                <ion-icon
                                    size='small'
                                    name='brush-outline'
                                ></ion-icon>
                                <span className='ml-3 text-base'>
                                    Brand theme
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='hover:text-gray-400 flex block'
                            >
                                <ion-icon
                                    size='small'
                                    name='person-outline'
                                ></ion-icon>
                                <span className='ml-3 text-base'>
                                    Invite members
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='hover:text-gray-400 flex block'
                            >
                                <ion-icon
                                    size='small'
                                    name='flash-outline'
                                ></ion-icon>
                                <span className='ml-3 text-base'>
                                    Upgrade to Pro
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className=' flex-1 py-2 pr-6'>
                    <div class='w-full flex items-center justify-between z-50 '>
                        <div className='py-4  border-solid border-b-2 border-slate-200 ml-8 items-center w-full justify-between flex'>
                            <div>
                                <ion-icon
                                    size='small'
                                    name='search-outline'
                                ></ion-icon>
                                <input
                                    type='text'
                                    class='border-none bg-transparent text-pink-500'
                                    placeholder='Search decks'
                                />
                            </div>

                            <div>
                                <div className='justify-between flex'>
                                    <div>
                                        <Link
                                            to='/'
                                            className='flex items-center justify-center w-10 h-10 rounded-full border-solid border-2 border-slate-200 rounded-full font-bold'
                                        >
                                            <ion-icon
                                                size='small'
                                                name='help-outline'
                                            ></ion-icon>
                                        </Link>
                                    </div>
                                    <button
                                        type='button'
                                        class='ml-6 font-bold rounded border-solid border-2 border-violet-800 px-3 py-2 text-violet-800 dark:hover:bg-neutral-900 '
                                    >
                                        Invite team member
                                    </button>

                                    <button
                                        type='button'
                                        class='ml-4 font-bold text-slate-50 rounded border-solid border-2 border-violet-700 px-3 py-2 dark:hover:bg-neutral-900 bg-violet-800'
                                    >
                                        New deck
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='my-6 mx-auto max-w-screen-xl bg-[#4b5563]'>
                        <p className='text-lg'>Content area</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tests;