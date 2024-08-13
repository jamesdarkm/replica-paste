import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    doc,
    getDoc,
    getDocs,
    collection,
    query, 
    where,
} from 'firebase/firestore';
import { db } from '../../../firebase';

export default function Teams({ uid, toggleCreateDeckPopup  }) {
    const [posts, setPosts] = useState([]);
    const [teams, setTeams] = useState([]);
    
    const Team = ({ team }) => {
        const placeholderImage = '/src/Components/Assets/placeholder-deck-image.jpg';
        const imageUrl = team.thumbnail || placeholderImage;

        console.log(team)

        return (
            <>
                {team.name && (
                <Link
                    to={`/dashboard/decks`}
                    className='mt-5'
                    key={team.id} // Use the post ID as the key
                >
                    <div
                        className='min-h-48 rounded bg-center bg-cover'
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    ></div>
                    <p className='mt-3 text-lg font-bold'>{team.name}</p>
                </Link>
                )}
            </>
        );
    };;

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsRef = collection(db, 'teams');

            // Fetch teams where the user is either owner or shared with
            const ownerQuery = query(teamsRef, where('ownerId', '==', uid));
            const sharedQuery = query(teamsRef, where('sharedWith', 'array-contains', uid));
    
            const ownerSnapshot = await getDocs(ownerQuery);
            const sharedSnapshot = await getDocs(sharedQuery);

            const ownerTeams = ownerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sharedTeams = sharedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
            const allTeams = [...ownerTeams, ...sharedTeams];
    

            console.log(allTeams)
            setTeams(allTeams)

        };

        // Call the function with a specific uid
        fetchTeams();
    }, []);
    
  return (
    <>
    {teams.length === 0 ? (
        <div className='my-6 flex max-w-screen-2xl'>
            <div className='mx-auto h-dvh text-center content-center max-w-72'>
                <h1 className='font-bold text-3xl leading-7'>
                    Ready. Set. Paste.
                </h1>

                <p className='mt-4 mb-14 text-gray-400 leading-7'>
                    When you make your first deck, it will show up here.
                    Ready to make beautiful slides in seconds?
                </p>

                <button
                    type='button'
                    className='font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-5 py-4 hover:bg-violet-900 bg-violet-800'
                    onClick={toggleCreateDeckPopup}
                >
                    Create new team
                </button>
            </div>
        </div>
    ) : (
        <>
            <div className='my-6 mx-auto max-w-screen-2xl'>
                <div className='grid grid-cols-4 gap-4'>
                    <button type="button" onClick={toggleCreateDeckPopup}
                        className='mt-5'
                    >
                        <div className='flex justify-center items-center min-h-48 rounded border-2 border-solid border-slate-100'>
                            <ion-icon
                                size='large'
                                name='add-outline'
                            ></ion-icon>
                        </div>
                        <p className='mt-3 text-lg font-bold'>
                            Add Team
                        </p>
                    </button>

                    {teams.map((team) => (
                        <React.Fragment key={team.id}>
                            {<Team team={team}/>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    )}
    </>
  )
}
