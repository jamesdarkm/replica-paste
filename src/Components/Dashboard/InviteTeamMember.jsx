import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import axios from '../../../axios';
import { v4 as uuidv4 } from 'uuid';

const InviteTeamMember = ({ isOpen, onClose, teams }) => {
    if (!isOpen) return null;

    const [email, setEmail] = useState('');
    const [response, setResponse] = useState('');
    const { teamId } = useParams();
    console.log( teamId )

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

    // we need to invite a user to a specific team
    // meaning, when a user selects a team, we need that teams id, update its invitatons  array
    // in the invitaions array is an object that contains the invited memebers email, the token that attached to a member
    // we are then going to send the email, token and folderId to the server to send out the email to the member
    const inviteMember = async () => {
        const teamsRef = doc(db, 'teams', teamId);
        const teamDoc = await getDoc(teamsRef);
        const teamData = teamDoc.data();
        const invitations = teamData.invitations;
        const uniqueId = uuidv4(); // Generate a unique token
        // console.log(invitations)

        const verifyEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(verifyEmailRegex.test(email)){
            const memberToInvite = { email, token: uniqueId, teamId: teamDoc.id }

            if (!invitations.includes(email)) {
                invitations.push(memberToInvite);
    
                try {
                    await updateDoc(teamsRef, { invitations });
                    const response = await fetch('http://localhost:5000/send-invite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(memberToInvite),
                      });
                      console.log(response)
                      if (!response.ok) {
                        
                        throw new Error(`Error: ${response.statusText}`);
                    }
                } catch (error) {
                    alert('error uploading the doc:', error)
                }
    
            } else {
                throw new Error('There was an error. A team member with that email already exists.')
            }

        } else{
            throw new Error('There was an error. Please ensure that you have entered the correct email.')
        }

    }

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
                                <div className='mt-7'>
                                    <form onSubmit={handleSubmit}>
                                        <div className='flex flex-row gap-3'>
                                            <input
                                                className='basis-3/4 border-slate-300 rounded'
                                                type='email'
                                                placeholder='Email'
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                            />
                                            <button
                                                type='submit'
                                                onClick={inviteMember}
                                                className='basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
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
    );
};

export default InviteTeamMember;