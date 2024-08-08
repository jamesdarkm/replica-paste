import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../../firebase';

import {
    doc,
    addDoc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';

const CreateDeck = ({ isOpen, onClose, uid }) => {
    if (!isOpen) return null;
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const deckDocRef = doc(db, 'decks', uid);
            const deckCollectionRef = collection(deckDocRef, 'decksSubCollection');
            
            const docRef = await addDoc(deckCollectionRef, {
                heading: title,
                title: 'ttle',
                timestamp: serverTimestamp(),
            });

            const newFireBaseDocId = docRef.id;
            navigate(`/dashboard/deck/${newFireBaseDocId}`);
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
                <div className='flex min-h-full items-end justify-center p-4 text-center items-center'>
                    <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl my-8 w-full max-w-lg'>
                        <div className='bg-white p-6'>
                            <div>
                                <div className='flex items-center justify-between pb-3  border-solid border-b-2 border-slate-200 '>
                                    <div className='text-base font-semibold leading-6 text-gray-900'>
                                        Create New Deck
                                    </div>

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
                                <div className='mt-7'>
                                    <form onSubmit={handleSubmit}>
                                        <p className='mb-4 font-bold'>What would you like your new deck to be called?</p>
                                        <div className='flex flex-row gap-3'>
                                           
                                            <input
                                                className='basis-3/4 border-slate-300 rounded'
                                                type='text'
                                                placeholder=''
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type='submit'
                                                className='basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </form>
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

export default CreateDeck;