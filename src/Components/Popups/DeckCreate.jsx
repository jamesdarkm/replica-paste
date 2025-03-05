import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/* Firebase */
import { db } from '../../../firebase'
import {
    addDoc,
    collection,
    serverTimestamp
} from 'firebase/firestore'

/**
 * Props passed from /src/Components/Dashboard/Dashboard.jsx & /src/Components/DashboardTeams.jsx
 * @param {function} currentUser - Array containing current user details
 * @param {function} toggleInviteTeamMemberPopup - Function to fetch show the invite Team member popup
 */
const CreateDeck = ({ isOpen, onClose, uid, popupType }) => {
    if (!isOpen) return null
    const navigate = useNavigate()
    const { teamId } = useParams()


    /* States */
    const [title, setTitle] = useState('')
    const [response, setResponse] = useState('')



    /**
     * Add new teams document
     * 
     * Attached to dashboard.jsx
     */
    const handleTeamCreation = async (e) => {
        e.preventDefault()

        try {
            const teamDocRef = collection(db, 'teams')

            const docRef = await addDoc(teamDocRef, {
                name: title,
                ownerId: uid,
                sharedWith: [],
                invitations: [],
                timestamp: serverTimestamp(),
            })

            const teamDocId = docRef.id
            navigate(`/dashboard/${teamDocId}`)
        } catch (error) {
            setResponse(
                'Failed to send email, please reach out to support@paste-replica.io'
            )
        }
    }



    /**
     * Add new teams document
     * 
     * Attached to dashboardTeams.jsx
     */
    const handleDeckCreation = async (e) => {
        e.preventDefault()

        try {
            const deckCollectionRef = collection(db, 'decks')

            const docRef = await addDoc(deckCollectionRef, {
                heading: title,
                teamId: teamId,
                timestamp: serverTimestamp(),
            })

            const deckDocId = docRef.id
            navigate(`/dashboard/deck/${deckDocId}`)
        } catch (error) {
            setResponse(
                'Failed to send email, please reach out to support@paste-replica.io'
            )
        }
    }



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
                                        {popupType === "deck" ? ('Create New Deck') : ('Create New Team')}
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
                                    <form onSubmit={popupType === "deck" ? handleDeckCreation : handleTeamCreation}>
                                        <p className='mb-3 text-socialpaste-gray'>
                                            {popupType === "deck" ? ('What would you like your new deck to be called?') : ('What would you like your team to be called?')}
                                        </p>
                                        <div className='flex-col lg:flex-row flex flex-row gap-3'>
                                            <input
                                                className='basis-3/4 rounded-[5px] py-[12px] px-[16px] text-[14[px] border-none outline-none focus:ring-transparent bg-socialpaste-lightergray'
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
                                                disabled={!title.trim()}
                                                className={`p-4 basis-1/4 rounded justify-center rounded-full text-sm font-semibold shadow-sm font-bold text-slate-50 ${title.trim() ? 'bg-socialpaste-purple hover:bg-socialpaste-purple-dark' : 'text-socialpaste-chinese-white bg-socialpaste-lightergray cursor-not-allowed'
                                                    }`}
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
    )
}

export default CreateDeck