import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Context/authContext';

/* Firebase */
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

/* Icons */
import ChevronIcon from '../Icons/ChevronIcon'
import EllipsisIcon from '../Icons/EllipsisIcon'

/* CSS */
import './Deck.css';
import './Modal.css';
import './DropZone.css';
import './Posts.css';

/* Compontents */
import DropZone from './DropZone.jsx';
import Posts from './Posts.jsx';

const Deck = () => {
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
    const [heading, setHeading] = useState([]);
    const [decks, setDecks] = useState([]);
    const [deckID, setDeckID] = useState('');
    const [deckCount, setDeckCount] = useState([]);
    const [didUploadDeck, setDidUploadDeck] = useState(false);
    const [cardIndex, setCardIndex] = useState(null);

    const { id } = useParams();
    const hasDecks = Object.keys(decks).length !== 0;



    /**
     * Naigate to the previous page
     */
    const goBack = () => {
        navigate(-1);
    };



    /**
     * Document it
     */
    const changeUploadState = () => {
        setDidUploadDeck(!didUploadDeck)
    }



    /**
    * Fetch deck heading based on ID
    */
    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const docTeamRef = doc(db, 'decks', id)
                const docNameSnap = await getDoc(docTeamRef)

                if (docNameSnap.exists()) {
                    setHeading(docNameSnap.data().heading)
                }


            } catch (error) {
                console.error("Error fetching decks:", error)
            }
        }

        fetchDecks()
    }, [id])


    /**
     * Verify if I can delete this
     */
    useEffect(() => {
        async function getDeckSubCollectionDocument() {
            try {
                // Reference to the main document in 'decks' collection
                const mainDocRef = doc(
                    db,
                    'decks',
                    id
                );

                // Reference to the 'decksSubCollection' subcollection within the main document
                // const subCollectionRef = collection(
                //     mainDocRef,
                //     'decksSubCollection'
                // );

                // Reference to the specific document within the 'decksSubCollection'
                // const subDocRef = collection(mainDocRef);

                // Fetch the document
                const docSnap = await getDoc(mainDocRef);

                if (docSnap.exists()) {
                    // Access the data in the document
                    const data = docSnap.data();
                    const deckObjectToArray = Object.entries(data.decks);
                    // console.log(deckObjectToArray)

                    setDecks(deckObjectToArray)
                    setHeading(data.heading)
                    setDeckCount(Object.keys(data.decks).length)
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


    /**
     * Dropzone popup
     */
    const [isDropZoneOpen, setIsDropZoneOpen] = useState(false);
    const toggleDropZonePopup = (cardIndex) => {
        setCardIndex(cardIndex)
        setIsDropZoneOpen(!isDropZoneOpen);
    };

    return (
        <>
        <DropZone isOpen={isDropZoneOpen} onClose={toggleDropZonePopup} deckCount={deckCount} id={id} changeUploadState={changeUploadState} deckID={deckID} decks={decks} setCardIndex={setCardIndex} cardIndex={cardIndex} />

            <div className='p-4 px-6 items-center w-full justify-between flex'>
                <div className='flex gap-[19px] items-center justify-center'>
                    <button className='w-[46px] h-[46px] text-center  border-2 border-solid rounded-full border-[#F6F7F5] hover:bg-[#F6F7F5]' onClick={goBack}>
                        <ChevronIcon className='w-[8px] mx-auto' />
                    </button>

                    <h1 className='text-[16px] font-semibold'>{heading}</h1>
                </div>

                <div>
                    <div className='gap-[16px] justify-between flex content-end'>
                        <button type='button' className='px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark'>Share deck</button>


                        <button type='button' className='px-8 py-4 rounded-full font-bold border-2 border-solid border-[#F6F7F5] bg-white hover:bg-[#F6F7F5]'>Present</button>

                        <button className='border-2 border-solid rounded-full border-[#F6F7F5] hover:bg-[#F6F7F5]'>
                            <EllipsisIcon className='w-14 rotate-90' />
                        </button>
                    </div>
                </div>
            </div>

            
            <Posts hasDecks={hasDecks} decks={decks} toggleDropZonePopup={toggleDropZonePopup} setDeckID={setDeckID} />
        </>
    );
};

export default Deck;
