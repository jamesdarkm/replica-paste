import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import InviteTeamMember from './InviteTeamMember';
import Profile from './Profile';
import CreateDeck from './DeckCreate';
import Decks from './Decks.jsx';
import Teams from './Teams.jsx'
import { useAuth } from '../../Context/authContext';
import { doSignOut } from '../../../auth';
import { db, storage } from '../../../firebase';
import { doc, addDoc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

import Logo from '../Icons/Logo.jsx'
import DashboardIcon from '../Icons/DashboardIcon.jsx'
import QuestionIcon from '../Icons/QuestionIcon.jsx'
import LightningIcon from '../Icons/LightningIcon.jsx'

const DashboardTeams = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [avatar, setAvatar] = useState(currentUser?.photoURL); // remove


    /**
     * Display picture
     * Use Google's user's profile picture if the avatar is blank
     */
    let displayPicture = currentUser.additionalInformation.avatar
    if (displayPicture == '') {
        displayPicture = currentUser?.photoURL
    }
    
    /**
     * User ID
     */
    const uid = currentUser?.uid


    /**
     * Truncate the string if it contains more than 10 characters.
     */
    const displayName = currentUser.additionalInformation.firstName
    const truncatedDisplayName = displayName.length > 10 ? `${displayName.substring(0, 10)}...` : displayName


    /**
     * 
     */
    
    
    console.log(currentUser)


    /**
     * Hide the scrollbar when modal is active
     */
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }

    const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false);
    const toggleCreateDeckPopup = () => {
        setIsCreateDeckOpen(!isCreateDeckOpen);
    };


    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const toggleProfilePopup = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    
    return (
        <>
            <section className='flex bg-[#F6F7F5]'>
                <aside className='py-6 px-4 z-5 flex flex-col justify-between w-64 h-screen bg-white'>
                    <div>
                        <Link to='/' className='mb-8 block'><Logo className='w-3/5' /></Link>

                        <Link to='/' className='p-3 flex items-center rounded-full border-2 border-solid border-white bg-white hover:bg-[#F6F7F5] hover:border-[#F6F7F5]'>
                            <DashboardIcon className='w-12' />
                            <span className='ml-2 text-sm font-semibold'>Dashboard</span>
                        </Link>

                        <Link to='https://support.socialpaste.io' className='mt-2 p-3 flex items-center rounded-full border-2 border-solid border-white bg-white hover:bg-[#F6F7F5] hover:border-[#F6F7F5]' target='_blank'>
                            <QuestionIcon className='w-12' />
                            <span className='ml-2 text-sm font-semibold'>Help</span>
                        </Link>
                    </div>

                    <div>
                        <Link to='/checkout' className='p-3 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-[#F6F7F5] hover:text-white hover:bg-socialpaste-purple'>
                            <LightningIcon className='w-12 hover:invert' />
                            <span className='ml-2 text-sm font-semibold'>Upgrade to Pro</span>
                        </Link>

                        <Link to='/' className='mt-2 p-1 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-white hover:bg-[#F6F7F5]'>
                            <img className='w-9 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                            <span className='ml-2 text-sm font-semibold'>{truncatedDisplayName}</span>
                        </Link>
                    </div>
                </aside>
                <div className='flex flex-1 py-2 pr-6'>
                    <div className='flex justify-center w-full'>
                        <div className='flex flex-col gap-10 justify-center items-center w-[394px] text-center'>
                            <h1 className='text-5xl font-black'>Ready. Set. Paste</h1>
                            <p className='text-lg'>When you make your first team, it will show up here. Ready to make beautiful slides in seconds?</p>
                            <button type='button' className='px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark' onClick={toggleCreateDeckPopup}>Create new team</button>
                        </div>
                    </div>
                </div>
            </section>

            <Profile isOpen={isProfileOpen} onClose={toggleProfilePopup} uid={uid} currentUser={currentUser} />
            <CreateDeck isOpen={isCreateDeckOpen} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} uid={uid} popupType="team" />

            <div className='flex bg-[#F6F7F5]'>
                <div className='h-screen w-64 p-4 z-5'>
                    <div className='flex items-center justify-between'>
                        <Link
                            to='/'
                            className='flex items-center justify-between'
                        >
                            <div className='flex items-center justify-center w-10 h-10 rounded-md p-6 bg-purple-500 font-bold'>
                                {currentUser?.displayName.charAt(0)}
                            </div>

                            <span className='ml-3 text-base font-bold'>
                                {currentUser?.displayName.split(' ')[0]}
                            </span>
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
                                to='/checkout'
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
                    <div className='w-full flex items-center justify-between z-10 '>
                        <div className='py-4  border-solid border-b-2 border-slate-200 ml-8 items-center w-full justify-between flex'>
                            <div>
                                <ion-icon
                                    size='small'
                                    name='search-outline'
                                ></ion-icon>
                                <input
                                    type='text'
                                    className='w-96 ml-3 rounded border-none bg-transparent'
                                    placeholder='Search decks'
                                />
                            </div>

                            <div>
                                <div className='justify-between flex content-end'>
                                    <div className='ml-4 '>
                                        <button onClick={toggleProfilePopup} className='flex content-end'><div className='mt-3 mr-5'>Online</div> <img className='w-10 rounded-full' src={avatar || displayPhoto} referrerPolicy="no-referrer" />

                                            {avatar == '' && displayPhoto == null && <ion-icon className='mr-5' name='person-circle-outline' style={{ fontSize: '40px' }}></ion-icon>}
                                        </button>
                                    </div>
                                    <div>
                                        <Link
                                            to='/'
                                            className='ml-10 flex items-center justify-center w-10 h-10 rounded-full border-solid border-2 border-slate-200 rounded-full font-bold hover:bg-slate-200'
                                        >
                                            <ion-icon
                                                size='small'
                                                name='help-outline'
                                            ></ion-icon>
                                        </Link>
                                    </div>

                                    <button
                                        type='button'
                                        className='ml-4 font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 hover:bg-violet-900 bg-violet-800'
                                        onClick={toggleCreateDeckPopup}
                                    >
                                        New team
                                    </button>

                                    {currentUser && (
                                        <>
                                            <button
                                                onClick={() => doSignOut()}
                                                className='ml-4 font-bold text-slate-50 rounded border-solid border-2 border-red-600 hover:border-red-900 px-3 py-2 hover:bg-red-900 bg-red-600'
                                            >
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Teams uid={uid} toggleCreateDeckPopup={toggleCreateDeckPopup} />
                </div>
            </div>
        </>
    );
};

export default DashboardTeams;