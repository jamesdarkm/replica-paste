import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/authContext'

/* Compontents */
import Aside from '../NavBar/Aside'
import CreateDeck from './DeckCreate'
import Teams from './Teams.jsx'

const DashboardTeams = () => {
    const [modal, setModal] = useState(false)

    const { currentUser } = useAuth()
    
    /**
     * Redirect if user isn't logged in
     */
    const navigate = useNavigate()
    useEffect(() => {
        if (!currentUser) {
            navigate('/', { replace: true })
        }
    }, [currentUser, navigate])
    


    /**
     * Display picture
     * Use Google's user's profile picture if the avatar is blank
     */
    let displayPicture = currentUser.additionalInformation.avatar
    if (displayPicture === '' || displayPicture === null) {
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
     * !!!NOT WORKING!!!
     * Hide the scrollbar when modal is active
     */
    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }



    /**
     * Create Deck popup
     */
    const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
    const toggleCreateDeckPopup = () => {
        setIsCreateDeckOpen(!isCreateDeckOpen)
    }

    return (
        <>
            <section className='lg:flex'>
                <Aside displayPicture={displayPicture} truncatedDisplayName={truncatedDisplayName} />
                
                <Teams uid={uid} toggleCreateDeckPopup={toggleCreateDeckPopup} />
            </section>

            <CreateDeck isOpen={isCreateDeckOpen} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} uid={uid} popupType="team" />
        </>
    )
}

export default DashboardTeams;