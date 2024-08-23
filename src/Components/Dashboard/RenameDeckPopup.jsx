import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const RenameDeckPopup = ({ isOpen, onClose, deckId, currentName }) => {
    const [newName, setNewName] = useState(currentName);
    const [response, setResponse] = useState('');

    const handleRename = async (e) => {
        e.preventDefault();

        if (newName.trim()) {
            try {
                const deckRef = doc(db, 'decks', deckId);
                await updateDoc(deckRef, {
                    heading: newName,
                });
                setResponse('Deck renamed successfully!');
                window.location.reload(); // Refresh the page to show the name change
            } catch (error) {
                setResponse('Failed to rename the deck. Please try again.');
            }
        } else {
            setResponse('Deck name cannot be empty.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className='relative z-10'>
            <div className='fixed inset-0 bg-gray-900 bg-opacity-75' />
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center items-center'>
                    <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl my-8 w-full max-w-lg'>
                        <div className='bg-white p-6'>
                            <div>
                                <div className='flex items-center justify-between pb-3 border-solid border-b-2 border-slate-200'>
                                    <div className='text-base font-semibold leading-6 text-gray-900'>
                                        Rename Deck
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
                                    <form onSubmit={handleRename}>
                                        <p className='mb-4 font-bold'>
                                            What would you like your deck to be renamed to?
                                        </p>
                                        <div className='flex flex-row gap-3'>
                                            <input
                                                className='basis-3/4 border-slate-300 rounded'
                                                type='text'
                                                value={newName}
                                                onChange={(e) =>
                                                    setNewName(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type='submit'
                                                className='basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                                            >
                                                Rename
                                            </button>
                                        </div>
                                    </form>
                                    {response && (
                                        <div
                                            className={`mt-4 text-sm text-center rounded-lg p-4 ${response.includes('successfully') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
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

export default RenameDeckPopup;
