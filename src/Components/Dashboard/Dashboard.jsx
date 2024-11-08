import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/authContext'
import './Dashboard.css'

/* Compontents */
import Aside from '../NavBar/Aside'
import CreateDeck from '../Popups/DeckCreate'
import Teams from '../Decks/Teams'

const DashboardTeams = () => {
    /**
     * Login state
     */
    const { currentUser } = useAuth()

    const navigate = useNavigate()
    useEffect(() => {
        if (!currentUser) {
            navigate('/', { replace: true })
        }
    }, [currentUser, navigate])



    /**
     * States
     */
    const [modal, setModal] = useState(false)



    /**
     * User ID
     */
    const uid = currentUser?.uid



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
                <Aside currentUser={currentUser} />

                <Teams uid={uid} toggleCreateDeckPopup={toggleCreateDeckPopup} />
            </section>

            <CreateDeck isOpen={isCreateDeckOpen} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} uid={uid} popupType="team" />
        </>
    )
}

export default DashboardTeams;