import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import InviteTeamMember from './InviteTeamMember';
import Profile from './Profile';
import CreateDeck from './DeckCreate';
import Decks from './Decks.jsx';
import Teams from './Teams.jsx'
import { useAuth } from '../../Context/authContext';
import { doSignOut } from '../../../auth';
import { db } from '../../../firebase';
import { doc, getDoc, collection, getDocs, 
    setDoc, query, where } from 'firebase/firestore';

const Tests = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [teams, setTeams] = useState([]);
    const [posts, setPosts] = useState([]);
    const { currentUser } = useAuth();
    const { teamId } = useParams();

    // console.log(teamId)

    const navigate = useNavigate();  
    if (!currentUser) {
       return <Navigate to="/" replace={true} />;
    }

    
    const displayPhoto = currentUser.photoURL;
    const uid = currentUser.uid;

    // const createUserDocumentXXX = async () => {
    //     const docRef = doc(db, 'users', user.uid);
    //     const docSnap = await getDoc(docRef);

    //     console.log('her')
    //     console.log(docSnap);
    //     if (!docSnap.exists()) {
    //         const datax = {
    //             creationDate: serverTimestamp(),
    //         };

    //         //await setDoc(docRef, datax);
    //     }
    // };

    // createUserDocumentXXX();

    /**
     * Hide the scrollbar when modal is active
     */
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }


    const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false);
    const toggleCreateDeckPopup = () => {
        
        setIsCreateDeckOpen(!isCreateDeckOpen);
    };

    const [isInviteTeamMemberPopupOpen, setIsInviteTeamMemberPopupOpen] = useState(false);
    const toggleInviteTeamMemberPopup = () => {
        setIsInviteTeamMemberPopupOpen(!isInviteTeamMemberPopupOpen);
    };


    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const toggleProfilePopup = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // Function to fetch decks associated with a user based on team Id
    const fetchDecks = async () => {
        const decksRef = collection(db, `decks/`);
        const q = query(decksRef, where('teamId', '==', teamId));

        const querySnapshot = await getDocs(q);
        const decksData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(decksData)

        setPosts(decksData);
    };

    // const fetchTeam = async () => {
    //     const teamsRef = collection(db, 'teams');

    //     // Fetch teams where the user is either owner or shared with
    //     const ownerQuery = query(teamsRef, where('ownerId', '==', uid));
    //     const sharedQuery = query(teamsRef, where('sharedWith', 'array-contains', uid));

    //     const ownerSnapshot = await getDocs(ownerQuery);
    //     const sharedSnapshot = await getDocs(sharedQuery);

    //     const ownerTeams = ownerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //     const sharedTeams = sharedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //     const allTeams = [...ownerTeams, ...sharedTeams];
    //     const teamId = allTeams[0].id;   
    //     // console.log(allTeams)

    //     // console.log(allTeams, teamId)
    //     setTeams(allTeams)
        
    // };

    useEffect(() => {
        //function gets the users avatar, associated data about teams and their associated decks
        async function getAvatarTeamsDecks() {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userAvatar = docSnap.data().avatar;

                setAvatar(userAvatar);
                
                
                fetchDecks();

            } else {
              console.log("No such doc!");
            }
        }

        getAvatarTeamsDecks();
    }, [])
      
    return (
        <>
            {!currentUser && <Navigate to="/" replace={true} />}
            
            <InviteTeamMember isOpen={isInviteTeamMemberPopupOpen} onClose={toggleInviteTeamMemberPopup} />
            <Profile isOpen={isProfileOpen} onClose={toggleProfilePopup} uid={uid}  />
            <CreateDeck isOpen={isCreateDeckOpen} teams={teams} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} uid={uid} popupType="deck"/>

            <div className='flex'>
                <div className='h-screen w-64 p-4 z-5'>
                    <div className='flex items-center justify-between'>
                        <Link
                            to='/'
                            className='flex items-center justify-between'
                        >
                            <div className='flex items-center justify-center w-10 h-10 rounded-md p-6 bg-purple-500 font-bold'>
                                {/* {currentUser.displayName.charAt(0)} */}
                            </div>

                            <span className='ml-3 text-base font-bold'>
                                {/* {currentUser.displayName.split(' ')[0] +
                                      "'s"} */}
                                
                                Team
                                
                            </span>
                        </Link>
                    </div>

                    <ul role='list' className='mt-10 space-y-4'>
                        <li>
                            <Link
                                to='/'
                                className='hover:text-gray-400 flex block'
                            >
                                <ion-icon
                                    size='small'
                                    name='brush-outline'
                                ></ion-icon>
                                <span className='ml-3 text-base'>
                                    Brand theme
                                </span>
                            </Link>
                        </li>
                        <li>
                        <button
                            onClick={toggleInviteTeamMemberPopup}
                            type='button'
                            className='ml-6 font-bold rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 text-violet-700 hover:text-gray-50 hover:bg-violet-900 '
                        >
                            Invite team member
                        </button>
                        </li>
                        <li>
                            <Link
                                to='/'
                                className='hover:text-gray-400 flex block'
                            >
                                <ion-icon
                                    size='small'
                                    name='flash-outline'
                                ></ion-icon>
                                <span className='ml-3 text-base'>
                                    Upgrade to Pro
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className=' flex-1 py-2 pr-6'>
                    <div className='w-full flex items-center justify-between z-10 '>
                        <div className='py-4  border-solid border-b-2 border-slate-200 ml-8 items-center w-full justify-between flex'>
                            <div>
                                <ion-icon
                                    size='small'
                                    name='search-outline'
                                ></ion-icon>
                                <input
                                    type='text'
                                    className='w-96 ml-3 rounded border-none bg-transparent'
                                    placeholder='Search decks'
                                />
                            </div>

                            <div>
                                <div className='justify-between flex content-end'>
                                    <div className='ml-4 '>
                                        <button onClick={toggleProfilePopup} className='flex content-end'><div className='mt-3 mr-5'>Online</div> <img className='w-10 rounded-full' src={avatar || displayPhoto} referrerPolicy="no-referrer" />
                                        </button>
                                    </div>
                                    <div>
                                        <Link
                                            to='/'
                                            className='ml-10 flex items-center justify-center w-10 h-10 rounded-full border-solid border-2 border-slate-200 rounded-full font-bold hover:bg-slate-200'
                                        >
                                            <ion-icon
                                                size='small'
                                                name='help-outline'
                                            ></ion-icon>
                                        </Link>
                                    </div>

                                    <button
                                        type='button'
                                        className='ml-4 font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 hover:bg-violet-900 bg-violet-800'
                                        onClick={toggleCreateDeckPopup}
                                    >
                                        New deck
                                    </button>

                                    {currentUser && (
                                    <>
                                        <button
                                            onClick={() => {
                                                doSignOut().then(() => {
                                                    navigate('/');
                                                });
                                            }}
                                            className='ml-4 font-bold text-slate-50 rounded border-solid border-2 border-red-600 hover:border-red-900 px-3 py-2 hover:bg-red-900 bg-red-600'
                                        >
                                            Logout
                                        </button>
                                    </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Decks posts={posts} uid={uid} toggleCreateDeckPopup={toggleCreateDeckPopup} />
                </div>
            </div>
        </>
    );
};

export default Tests;