import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Popup from './Popup';
import Profile from './Profile';
import Decks from './Decks.jsx';
import { useAuth } from '../../Context/authContext';
import { doSignOut } from '../../../auth';
import { db, storage } from '../../../firebase';

import {
    doc,
    addDoc,
    setDoc,
    getDoc, collection, getDocs
} from 'firebase/firestore';

const Tests = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const { currentUser } = useAuth();
    console.log(currentUser)

    const navigate = useNavigate();  
    if (!currentUser) {
       return <Navigate to="/" replace={true} />;
    }

    const displayPhoto = currentUser.photoURL;
    const uid = currentUser.uid;

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

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };


    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const toggleProfilePopup = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    useEffect(() => {
        async function getUserAvatar() {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userAvatar = docSnap.data().avatar;
                console.log(userAvatar)
                setAvatar(userAvatar)
            } else {
              console.log("No such doc!");
            }
        }
        getUserAvatar();
    }, [])

      
    return (
        <>
            {!currentUser && <Navigate to="/" replace={true} />}
            
            <Popup isOpen={isPopupOpen} onClose={togglePopup} />
            <Profile isOpen={isProfileOpen} onClose={toggleProfilePopup} uid={uid} currentUser={currentUser} />
            
            <div className='flex'>
                <div className='h-screen w-64 p-4 z-5'>
                    <div className='flex items-center justify-between'>
                        <Link
                            to='/'
                            className='flex items-center justify-between'
                        >
                            <div className='flex items-center justify-center w-10 h-10 rounded-md p-6 bg-purple-500 font-bold'>
                                {currentUser.displayName.charAt(0)}
                            </div>

                            <span className='ml-3 text-base font-bold'>
                                {currentUser.displayName.split(' ')[0] +
                                      "'s"}
                                
                                Team
                                
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
                            <button
                                className='hover:text-gray-400 flex block'
                                onClick={togglePopup}
                            >
                                <ion-icon
                                    size='small'
                                    name='person-outline'
                                ></ion-icon>
                                <span className='ml-3 text-base'>
                                    Invite members
                                </span>
                            </button>
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
                                        <button onClick={toggleProfilePopup} className='flex content-end'><div className='mt-3 mr-5'>Online</div> <img className='w-10 rounded-full' src={displayPhoto} referrerPolicy="no-referrer" />
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
                                        onClick={togglePopup}
                                        type='button'
                                        className='ml-6 font-bold rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 text-violet-700 hover:text-gray-50 hover:bg-violet-900 '
                                    >
                                        Invite team member
                                    </button>

                                    <button
                                        type='button'
                                        className='ml-4 font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 hover:bg-violet-900 bg-violet-800'
                                    >
                                        New deck
                                    </button>

                                    {currentUser && (
                                    <>
                                        <button
                                            onClick={() => {
                                                doSignOut().then(() => {
                                                    navigate('/');
                                                });
                                            }}
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

                    <Decks uid={uid} />
                </div>
            </div>
        </>
    );
};

export default Tests;