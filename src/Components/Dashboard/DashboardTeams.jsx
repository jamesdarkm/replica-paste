import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../Context/authContext/index.jsx'

/* Firebase */
import { db } from '../../../firebase.js'
import {
    doc, getDoc, collection, getDocs, query, where
} from 'firebase/firestore'

/* Compontents */
import Aside from '../NavBar/Aside'
import CreateDeck from '../Popups/DeckCreate'
import Decks from '../Decks/Decks'
import InviteTeamMember from '../Popups/InviteTeamMember'

const Dashboard = () => {
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
    const [avatar, setAvatar] = useState(null)
    const [teamName, setTeamName] = useState('My decks')
    const [teams, setTeams] = useState([])
    const [posts, setPosts] = useState([])
    const { teamId } = useParams()
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



    /**
     * Invite team member popup
     */
    const [isInviteTeamMemberPopupOpen, setIsInviteTeamMemberPopupOpen] = useState(false)
    const toggleInviteTeamMemberPopup = () => {
        setIsInviteTeamMemberPopupOpen(!isInviteTeamMemberPopupOpen)
    }



    /**
     * Fetch decks data based on the team ID
     */
    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const docTeamRef = doc(db, 'teams', teamId)
                const docNameSnap = await getDoc(docTeamRef)

                if (docNameSnap.exists()) {
                    setTeamName(docNameSnap.data().name + '\'s team')
                }

                const decksRef = collection(db, 'decks')
                const q = query(decksRef, where('teamId', '==', teamId))
                const querySnapshot = await getDocs(q)
                const decksData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                
                setPosts(decksData)
            } catch (error) {
                console.error("Error fetching decks:", error)
            }
        }

        fetchDecks()
    }, [teamId])

    return (
        <>
            <section className='lg:flex'>
                <Aside currentUser={currentUser} toggleInviteTeamMemberPopup={toggleInviteTeamMemberPopup} />

                <Decks teamName={teamName} posts={posts} setPosts={setPosts} uid={uid} toggleCreateDeckPopup={toggleCreateDeckPopup} />
            </section>

            <InviteTeamMember isOpen={isInviteTeamMemberPopupOpen} onClose={toggleInviteTeamMemberPopup} />
            <CreateDeck isOpen={isCreateDeckOpen} teams={teams} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} uid={uid} popupType="deck" />
        </>
    )
}

export default Dashboard;