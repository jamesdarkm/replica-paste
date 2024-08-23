import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../../../firebase';

import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default function Invite() {
    const location = useLocation();
    const navigate = useNavigate();

    // we get the token and team id from the query parameters
    // then we verify the token from firebase db
    useEffect(() => {
        async function inviteMember() {
            // Parse the query parameters
            const queryParams = new URLSearchParams(location.search);
        
            // Get specific query parameters
            const tokenParam = queryParams.get('token');
            const teamIdParam = queryParams.get('team');
    
            const docRef = doc(db, 'teams', teamIdParam);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const invitations = docSnap.data().invitations;
                const sharedWith =  docSnap.data().sharedWith;
                const verifyToken = invitations.find((member) => member.token === tokenParam);
                
                if (verifyToken) {
                    // add member to sharedWith array. indicating that they have been successfully invited(team was shared with them)
                    // then remove the user from the invitations array
                    const { email, teamId, token } = verifyToken;

                    console.log(sharedWith, email)

                    if(!sharedWith.includes(email)){
                        const updatedInvitationsData  = invitations.filter(member => member.token !== tokenParam);
                        sharedWith.push(email);
    
                        await updateDoc(docRef, { invitations: updatedInvitationsData, sharedWith });

                        navigate('/dashboard')
                        // console.log({ updatedInvitationsData, sharedWith })
                    } else {
                        console.log('user already part of the team')
                        throw new Error('user already part of the team')
                    }

                } else {
                    alert('invalid token')
                    console.error("Token not found");
                    throw new Error("Invalid token");
                }

            } else {
              console.log("No such doc!");
            }
            
        }

        inviteMember();
    }, [])

    return (
      <div>Invite</div>
    )
}
