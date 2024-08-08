import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import './Deck.css';
import './Modal.css';
import { useAuth } from '../../Context/authContext';
import DropZone from './DropZone.jsx';
import './DropZone.css';
import Posts from './Posts.jsx';
import './Posts.css';
import { db, storage } from '../../../firebase';
import {
    doc,
    addDoc,
    setDoc,
    getDoc,
    collection,
    getDocs,
} from 'firebase/firestore';
const Deck = () => {
    const { currentUser } = useAuth();
    const [heading, setHeading] = useState([]);
    const [decks, setDecks] = useState([]);
    const [didUploadDeck, setDidUploadDeck] = useState(false);
    const [modal, setModal] = useState(false);
    const [toggle, setToggle] = useState(1);
    const { id } = useParams();
    const uid = currentUser.uid;

    if (!currentUser) {
        return <Navigate to='/' replace={true} />;
    }


    const changeUploadState = () => {
        setDidUploadDeck(!didUploadDeck)
    }
    

    useEffect(() => {
        async function getDeckSubCollectionDocument() {
            console.log('reached')
            try {
                // Reference to the main document in 'decks' collection
                const mainDocRef = doc(
                    db,
                    'decks',
                    uid
                );

                // Reference to the 'decksSubCollection' subcollection within the main document
                const subCollectionRef = collection(
                    mainDocRef,
                    'decksSubCollection'
                );

                // Reference to the specific document within the 'decksSubCollection'
                const subDocRef = doc(subCollectionRef, id);

                // Fetch the document
                const docSnap = await getDoc(subDocRef);

                if (docSnap.exists()) {
                    // Access the data in the document
                    const data = docSnap.data();

                    setDecks(data.decks)
                    setHeading(data.heading)
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }

        getDeckSubCollectionDocument();
    }, [didUploadDeck]);



    /**
     * Hide the scrollbar when modal is active
     */
    if (decks) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }

    const [isDropZoneOpen, setIsDropZoneOpen] = useState(false);
    const toggleDropZonePopup = () => {
        console.log('here')
        setIsDropZoneOpen(!isDropZoneOpen);
    };

    return (
        <>
            <DropZone isOpen={isDropZoneOpen} onClose={toggleDropZonePopup} uid={uid} id={id} changeUploadState={changeUploadState}/>

            <div className='flex-1'>
                <div className='w-full flex items-center justify-between z-10 '>
                    <div className='p-4 px-6 items-center w-full justify-between flex'>
                        <div className='flex items-center justify-center'>
                            <Link to='/dashboard'>
                                <ion-icon
                                    style={{ fontSize: '20px' }}
                                    name='chevron-back-outline'
                                ></ion-icon>
                            </Link>

                            <div className='pl-4'>
                                <h1 className=' text-3xl font-bold'>{heading}</h1>
                                <span>Group</span>
                            </div>
                        </div>

                        <div>
                            <div className='justify-between flex content-end'>
                                <div className='ml-4 '>
                                    <button className='flex content-end'>
                                        <div className='mt-3 mr-5'>Online</div>
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
                                    className='ml-6 font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 hover:bg-violet-900 bg-violet-800'
                                >
                                    Share deck
                                </button>

                                <button
                                    type='button'
                                    className='ml-4 font-bold rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 text-violet-700 hover:text-gray-50 hover:bg-violet-900 '
                                >
                                    Present
                                </button>

                                <button className='ml-4'>
                                    <ion-icon
                                        name='ellipsis-horizontal-outline'
                                        size='small'
                                    ></ion-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Posts decks={decks} toggleDropZonePopup={toggleDropZonePopup} />
        </>
    );
};

export default Deck;
