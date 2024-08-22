import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    doc,
    getDocs,
    collection,
    query,
    where,
    updateDoc,
    deleteDoc,
    addDoc
} from 'firebase/firestore';
import { db } from '../../../firebase';
import RenameDeckPopup from './RenameDeckPopup';

const Decks = ({ uid, toggleCreateDeckPopup }) => {
    const [posts, setPosts] = useState([]);
    const { teamId } = useParams();
    const [menuOpen, setMenuOpen] = useState(null);
    const [renamePopupOpen, setRenamePopupOpen] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);

    const PostImages = ({ post }) => {
        const placeholderImage = '/src/Components/Assets/placeholder-deck-image.jpg';
        const imageUrl = post.thumbnail || placeholderImage;

        // Function to handle menu actions
        const handleMenuClick = (action) => {
            if (action === 'duplicate') {
                duplicateDeck(post);
            } else if (action === 'rename') {
                setSelectedDeck(post);  // Set the selected deck for renaming
                setRenamePopupOpen(true);  // Open the rename popup
            } else if (action === 'delete') {
                deleteDeck(post.id);
            }
            setMenuOpen(null); // Close menu after action
        };

        return (
            <div className='relative'>
                <Link
                    to={`/dashboard/deck/${post.id}`}
                    className='mt-5'
                    key={post.id}
                >
                    <div
                        className='min-h-48 rounded bg-center bg-cover'
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    ></div>
                    <p className='mt-3 text-lg font-bold'>{post.heading}</p>
                </Link>
                {/* Three dots menu */}
                <button
                    className='absolute top-2 right-2'
                    onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                >
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </button>
                {/* Dropdown Menu */}
                {menuOpen === post.id && (
                    <div className='absolute top-10 right-2 bg-white shadow-md rounded'>
                        <button onClick={() => handleMenuClick('duplicate')} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Duplicate</button>
                        <button onClick={() => handleMenuClick('rename')} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Rename</button>
                        <button onClick={() => handleMenuClick('delete')} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Delete</button>
                    </div>
                )}
            </div>
        );
    };

    // Function to duplicate a deck and prompt for renaming
    const duplicateDeck = async (post) => {
        const newName = prompt('Enter a name for the duplicated deck:', `${post.heading} (Copy)`);
        if (newName) {
            const newDeck = {
                ...post,
                heading: newName,
                createdAt: new Date(), // Update creation date
            };

            delete newDeck.id; // Remove the ID so Firestore generates a new one

            await addDoc(collection(db, 'decks'), newDeck);
            fetchDecks(); // Refresh the decks
        }
    };


    // Function to delete a deck
    const deleteDeck = async (deckId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this deck?');
        if (confirmDelete) {
            const deckRef = doc(db, 'decks', deckId);
            await deleteDoc(deckRef);
            fetchDecks(); // Refresh the decks
        }
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

        setPosts(decksData);
    };

    useEffect(() => {
        fetchDecks();
    }, []);

    return (
        <>
            {posts.length === 0 ? (
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
                            Create new deck
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className='my-6 mx-auto max-w-screen-2xl'>
                        <div className='grid grid-cols-4 gap-4'>
                            <button type='button' onClick={toggleCreateDeckPopup}
                                className='mt-5'
                            >
                                <div className='flex justify-center items-center min-h-48 rounded border-2 border-solid border-slate-100'>
                                    <ion-icon
                                        size='large'
                                        name='add-outline'
                                    ></ion-icon>
                                </div>
                                <p className='mt-3 text-lg font-bold'>
                                    Empty Deck
                                </p>
                            </button>

                            {posts.map((post) => (
                                <React.Fragment key={post.id}>
                                    <PostImages post={post}/>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* RenameDeckPopup Component */}
            {renamePopupOpen && (
                <RenameDeckPopup
                    isOpen={renamePopupOpen}
                    onClose={() => setRenamePopupOpen(false)}
                    deckId={selectedDeck.id}
                    currentName={selectedDeck.heading}
                />
            )}
        </>
    );
};

export default Decks;
