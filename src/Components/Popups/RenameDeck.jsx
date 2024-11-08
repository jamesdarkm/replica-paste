import React, { useState } from 'react'

/** Firebase */
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'

/**
 * Props passed from /src/Components/Dashboard/DashboardTeams.jsx
 * @param {string} deckId - The ID of the deck to be renamed.
 * @param {string} currentName - The current name of the deck.
 * @param {function} fetchDecks - Function to fetch updated decks list after renaming.
 */
const RenameDeck = ({ isOpen, onClose, deckId, currentName, fetchDecks }) => {
    const [newName, setNewName] = useState(currentName)
    const [response, setResponse] = useState('')

    const handleRename = async (e) => {
        e.preventDefault()

        if (newName.trim()) {
            try {
                const deckRef = doc(db, 'decks', deckId)
                await updateDoc(deckRef, {
                    heading: newName,
                })

                fetchDecks()
                setResponse('Deck renamed successfully!')
            } catch (error) {
                setResponse('Failed to rename the deck. Please try again.')
            }
        } else {
            setResponse('Deck name cannot be empty.')
        }
    }

    if (!isOpen) return null

    return (
        <div className='relative z-[9999]'>
            <div className='fixed inset-0 bg-gray-900 bg-opacity-75' />

            <div className='fixed inset-0 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center items-center'>
                    <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl my-8 w-full max-w-[872px]'>
                        <div className='bg-white p-[40px]'>
                            <div>
                                <div className='flex items-center justify-between'>
                                    <div className='text-[16px] font-semibold text-black'>
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
                                <div className='mt-[14px]'>
                                    <form onSubmit={handleRename}>
                                        <p className='mb-3 text-socialpaste-gray'>
                                            What would you like your deck to be renamed to?
                                        </p>
                                        <div className='flex-col lg:flex-row flex flex-row gap-3'>
                                            <input
                                                className='basis-3/4 rounded-[5px] py-[12px] px-[16px] text-[14[px] border-none outline-none focus:ring-transparent bg-socialpaste-lightergray'
                                                type='text'
                                                placeholder=''
                                                value={newName}
                                                onChange={(e) =>
                                                    setNewName(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type='submit NEW ONE'
                                                disabled={!newName.trim()}
                                                className={`p-4 basis-1/4 rounded justify-center rounded-full text-sm font-semibold shadow-sm font-bold text-slate-50 ${newName.trim() ? 'bg-socialpaste-purple hover:bg-socialpaste-purple-dark' : 'text-socialpaste-chinese-white bg-socialpaste-lightergray cursor-not-allowed'
                                                    }`}
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
    )
}

export default RenameDeck