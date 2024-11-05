import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    doc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
    limit
} from 'firebase/firestore';
import { useAuth } from '../../Context/authContext';
import { db } from '../../../firebase';

const Team = ({ team }) => {
    const placeholderImage = '/src/Components/Assets/placeholder-deck-image.jpg';
    const [teamBanner, setTeamBanner] = useState(placeholderImage)
    // console.log(team.id)

    // Function to fetch decks associated with a user based on team Id
    const fetchDecks = async () => {
        const decksRef = collection(db, `decks/`);
        const q = query(decksRef, where('teamId', '==', team.id), limit(1));
        const querySnapshot = await getDocs(q);
        const decksData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Get banner images for the first deck that'll be displayed as a banner
        const decksDataBannerProperty = Object.keys(decksData[0].decks);
        const decksDataBanner = decksData[0].decks[decksDataBannerProperty];
        // console.log(decksDataBanner.thumbnail)
        setTeamBanner(decksDataBanner.thumbnail)
    };

    fetchDecks();

    return (
        <>
            {team.name && (
                <Link
                    to={`/dashboard/${team.id}`}
                    className='mt-1'
                    key={team.id} // Use the post ID as the key
                >
                    <div
                        className='relative px-5 w-full lg:min-w-80 min-h-48 rounded-[10px] bg-white bg-center bg-cover'
                        style={{ backgroundImage: `url(${teamBanner})` }}
                    >
                        <p className='mt-3 absolute bottom-4 text-lg font-bold'>{team.name}</p>
                    </div>
                    
                </Link>
            )}
        </>
    );
};

export default function Teams({ uid, toggleCreateDeckPopup }) {
    const { currentUser } = useAuth();
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsRef = collection(db, 'teams');

            // Fetch teams where the user is either owner or shared with
            const ownerQuery = query(teamsRef, where('ownerId', '==', uid));
            const sharedQuery = query(teamsRef, where('sharedWith', 'array-contains', currentUser.email));

            const ownerSnapshot = await getDocs(ownerQuery);
            const sharedSnapshot = await getDocs(sharedQuery);

            const ownerTeams = ownerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sharedTeams = sharedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const allTeams = [...ownerTeams, ...sharedTeams];


            // console.log(allTeams)
            setTeams(allTeams)

        };

        // Call the function with a specific uid
        fetchTeams();
    }, []);

    return (
        <>
            {teams.length === 0 ? (
                <div className='flex flex-1 pt-64 pb-2 lg:py-2 pr-6'>
                    <div className='flex justify-center w-full'>
                        <div className='flex flex-col gap-10 justify-center items-center w-[394px] text-center'>
                            <h1 className='text-5xl font-black'>Ready. Set. Paste</h1>
                            <p className='text-lg'>When you make your first team, it will show up here. Ready to make beautiful slides in seconds?</p>
                            <button type='button' className='px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark' onClick={toggleCreateDeckPopup}>Create new team</button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className='pt-60 pb-2 px-4 lg:y-16 mx-auto max-w-full lg:max-w-screen-2xl'>
                        <h1 className='mb-16 text-3xl font-black'>My teams</h1>
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                            <button type="button" onClick={toggleCreateDeckPopup}
                                className='mt-1'
                            >
                                <div className='relative px-5 flex justify-center items-center w-full lg:min-w-80 min-h-48 rounded-[10px] bg-white'>
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
                </>
            )}
        </>
    )
}
