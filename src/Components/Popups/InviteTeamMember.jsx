import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../../axios'
import { v4 as uuidv4 } from 'uuid'

/** Firebase */
import { db } from '../../../firebase'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

/**
 * Props passed from /src/Components/Dashboard/DashboardTeams.jsx
 */
const InviteTeamMember = ({ isOpen, onClose }) => {
    if (!isOpen) return null



    /**
     * States
     */
    const [email, setEmail] = useState('')
    const [response, setResponse] = useState('')
    const { teamId } = useParams()



    /**
     * Send invitation email
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/send-email', {
                email: email,
            })

            setEmail('')
            setResponse('Invitation successfully sent!')
        } catch (error) {
            setResponse(
                'Failed to send email, please reach out to support@paste-replica.io'
            )
        }
    }



    /**
     * Send invite
     */
    const inviteMember = async () => {
        const teamsRef = doc(db, 'teams', teamId)
        const teamDoc = await getDoc(teamsRef)
        const teamData = teamDoc.data()
        const invitations = teamData.invitations
        const uniqueId = uuidv4() // Generate a unique token
        // console.log(invitations)

        const verifyEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (verifyEmailRegex.test(email)) {
            const memberToInvite = { email, token: uniqueId, teamId: teamDoc.id }

            if (!invitations.includes(email)) {
                invitations.push(memberToInvite)

                try {
                    await updateDoc(teamsRef, { invitations })
                    const response = await fetch('http://localhost:5000/send-invite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(memberToInvite),
                    })
                    console.log(response)
                    if (!response.ok) {

                        throw new Error(`Error: ${response.statusText}`)
                    }
                } catch (error) {
                    alert('error uploading the doc:', error)
                }

            } else {
                throw new Error('There was an error. A team member with that email already exists.')
            }

        } else {
            throw new Error('There was an error. Please ensure that you have entered the correct email.')
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
                                        Share this file
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
                                    <form onSubmit={handleSubmit}>
                                        <p className='mb-3 text-socialpaste-gray'>
                                            What would you like your new deck to be called?
                                        </p>
                                        <div className='flex-col lg:flex-row flex flex-row gap-3'>
                                            <input
                                                className='basis-3/4 rounded-[5px] py-[12px] px-[16px] text-[14[px] border-none outline-none focus:ring-transparent bg-socialpaste-lightergray'
                                                type='email'
                                                placeholder='Email'
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type='submit NEW ONE'
                                                onClick={inviteMember}
                                                disabled={!email.trim()}
                                                className={`p-4 basis-1/4 rounded justify-center rounded-full text-sm font-semibold shadow-sm font-bold text-slate-50 ${email.trim() ? 'bg-socialpaste-purple hover:bg-socialpaste-purple-dark' : 'text-socialpaste-chinese-white bg-socialpaste-lightergray cursor-not-allowed'
                                                    }`}
                                            >
                                                Invite
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

export default InviteTeamMember