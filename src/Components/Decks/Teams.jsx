import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/authContext'

/* Firebase */
import {
    getDocs,
    collection,
    query,
    where,
    limit
} from 'firebase/firestore'
import { db } from '../../../firebase'


/**
 * Props passed from /src/Components/Dashboard/Dashboard.jsx
 */
const Team = ({ team }) => {
    /* 
     * States
    */
    const [teamBanner, setTeamBanner] = useState('/src/Components/Assets/placeholder-deck-image.jpg')



    /**
     * Fetch decks associated with the team Id
     *
     * Get banner images for the first deck that'll be displayed as a banner
     */
    const fetchDecks = async () => {
        const decksRef = collection(db, `decks/`)
        const q = query(decksRef, where('teamId', '==', team.id), limit(1))
        const querySnapshot = await getDocs(q)

        const decksData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        const decksDataBannerProperty = Object.keys(decksData[0].decks)
        const decksDataBanner = decksData[0].decks[decksDataBannerProperty]

        setTeamBanner(decksDataBanner.thumbnail)
    }

    fetchDecks()

    return (
        <>
            {team.name && (
                <Link
                    to={`/dashboard/${team.id}`}
                    className='mt-1'
                    key={team.id}
                >
                    <div
                        className='relative px-5 min-h-48 rounded-[10px] bg-white bg-center bg-cover'
                        style={{ backgroundImage: `url(${teamBanner})` }}
                    >
                        <p className='mt-3 absolute bottom-4 text-lg font-bold'>{team.name}</p>
                    </div>
                </Link>
            )}
        </>
    )
}

export default function Teams({ uid, toggleCreateDeckPopup }) {
    /* 
     * States
    */
    const { currentUser } = useAuth()
    const [teams, setTeams] = useState([])



    /**
     * Fetch teams where the user is either owner or shared with
     */
    useEffect(() => {
        const fetchTeams = async () => {
            const teamsRef = collection(db, 'teams')

            const ownerQuery = query(teamsRef, where('ownerId', '==', uid))
            const sharedQuery = query(teamsRef, where('sharedWith', 'array-contains', currentUser.email))

            const ownerSnapshot = await getDocs(ownerQuery)
            const sharedSnapshot = await getDocs(sharedQuery)

            const ownerTeams = ownerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            const sharedTeams = sharedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            const allTeams = [...ownerTeams, ...sharedTeams]

            setTeams(allTeams)
        }

        fetchTeams()
    }, [])

    return (
        <>
            {teams.length === 0 ? (
                <div className='container mx-auto flex flex-1 pt-64 pb-2 lg:py-2 px-4'>
                    <div className='flex justify-center w-full'>
                        <div className='flex flex-col gap-10 justify-center items-center w-[394px] text-center'>
                            <h1 className='text-5xl font-black'>Ready. Set. Paste</h1>
                            <p className='text-lg text-socialpaste-gray'>When you make your first team, it will show up here. Ready to make beautiful slides in seconds?</p>
                            <button type='button' className='px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark' onClick={toggleCreateDeckPopup}>Create new team</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='container pt-[220px] lg:pt-[80px] pb-2 px-4 lg:y-16 mx-auto max-w-full lg:max-w-screen-2xl'>
                    <h1 className='mb-16 text-3xl font-black'>My teams</h1>
                    <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        <button type="button" onClick={toggleCreateDeckPopup}
                            className='mt-1'
                        >
                            <div className='relative px-5 flex justify-center items-center min-h-48 rounded-[10px] bg-white'>
                                <div className='absolute'><ion-icon
                                    size='large'
                                    name='add-outline'
                                ></ion-icon>
                                </div>
                                <p className='mt-3 absolute bottom-4 text-lg font-bold'>
                                    Add Team
                                </p>
                            </div>
                        </button>

                        {teams.map((team) => (
                            <React.Fragment key={team.id}>
                                {<Team team={team} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
