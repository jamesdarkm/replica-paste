import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* Firebase */
import {
    doc,
    getDocs,
    collection,
    query,
    where,
    deleteDoc,
    addDoc
} from 'firebase/firestore'
import { db } from '../../../firebase'

/* Components */
import RenameDeck from '../Popups/RenameDeck'

/**
 * Props passed from /src/Components/Dashboard/DashboardTeams.jsx
 */
const Decks = ({ teamName, posts, setPosts, toggleCreateDeckPopup }) => {
    /* 
     * States
     */
    const [menuOpen, setMenuOpen] = useState(null)
    const [renamePopupOpen, setRenamePopupOpen] = useState(false)
    const [dupicatePopupOpen, setDupicatePopupOpen] = useState(false)
    const [selectedDeck, setSelectedDeck] = useState(null)



    /**
     * 
     */
    const PostImages = ({ post }) => {
        const decksDataBannerProperty = Object.keys(post?.decks || {})
        const decksDataBanner = post?.decks?.[decksDataBannerProperty]
        const banner = typeof decksDataBanner === 'undefined' ? { thumbnail: '/src/Components/Assets/placeholder-deck-image.jpg' } : decksDataBanner

        // Menu actions
        const handleMenuClick = (action) => {
            switch (action) {
                case 'duplicate':
                    duplicateDeck(post)
                    setDupicatePopupOpen(true)
                    break

                case 'rename':
                    setSelectedDeck(post)
                    setRenamePopupOpen(true)
                    break

                case 'delete':
                    deleteDeck(post.id)
                    break
            }

            setMenuOpen(null)
        }

        return (
            <div className='relative'>
                <Link
                    to={`/dashboard/deck/${post.id}`}
                    className='mt-1'
                    key={post.id}
                >
                    <div
                        className='relative px-5 min-h-48 rounded-[10px] bg-white bg-center bg-cover'
                        style={{ backgroundImage: `url(${banner.thumbnail})` }}
                    >
                        <p className='mt-3 absolute bottom-4 text-lg font-bold'>{post.heading}</p>
                    </div>
                </Link>

                <button
                    className='absolute top-2 right-2'
                    onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                >
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </button>

                {menuOpen === post.id && (
                    <div className='absolute top-10 flex flex-col text-left right-2 bg-white shadow-xl rounded-[10px] py-[13px]'>
                        <button onClick={() => handleMenuClick('duplicate')} className='py-[5px] px-[20px] text-[14px] text-left text-socialpaste-gray hover:bg-gray-100'>Duplicate</button>
                        <button onClick={() => handleMenuClick('rename')} className='py-[5px] px-[20px] text-[14px] text-left text-socialpaste-gray hover:bg-gray-100'>Rename</button>
                        <button onClick={() => handleMenuClick('delete')} className='py-[5px] px-[20px] text-[14px] text-left text-socialpaste-red hover:bg-gray-100'>Delete</button>
                    </div>
                )}
            </div>
        )
    }



    /**
     * Menu actions
     * 
     * Duplicate a deck and prompt for renaming
     */
    const duplicateDeck = async (post) => {
        const newName = prompt('Enter a name for the duplicated deck:', `${post.heading} (Copy)`)
        if (newName) {
            const newDeck = {
                ...post,
                heading: newName,
                createdAt: new Date(),
            }

            delete newDeck.id

            await addDoc(collection(db, 'decks'), newDeck)
            fetchDecks()
        }
    }



    /**
     * Menu actions
     * 
     * Delete a deck
     */
    const deleteDeck = async (deckId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this deck?')
        if (confirmDelete) {
            const deckRef = doc(db, 'decks', deckId)
            await deleteDoc(deckRef)
            fetchDecks()
        }
    }



    /**
     * Fetch decks associated with the team Id
     */
    const fetchDecks = async () => {
        console.log('here')
        const decksRef = collection(db, `decks/`)
        const q = query(decksRef, where('teamId', '==', 'xKXK3x3NEU4ihrx47GRE'))

        const querySnapshot = await getDocs(q)
        const decksData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        setPosts(decksData)
    }

    return (
        <>
            {posts.length === 0 ? (
                <div className='container mx-auto flex flex-1 pt-64 pb-2 lg:py-2 px-4'>
                    <div className='flex justify-center w-full'>
                        <div className='flex flex-col gap-10 justify-center items-center w-[394px] text-center'>
                            <h1 className='text-5xl font-black'>{teamName}</h1>
                            <p className='text-lg text-socialpaste-gray'>When you make your first deck, it will show up here.
                                Ready to make beautiful slides in seconds?</p>
                            <button type='button' className='px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark' onClick={toggleCreateDeckPopup}>Create new deck</button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className='container pt-[220px] lg:pt-[80px] pb-2 px-4 lg:y-16 mx-auto max-w-full lg:max-w-screen-2xl'>
                        <h1 className='mb-16 text-3xl font-black'>{teamName}</h1>
                        <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-4'>
                            <button type="button" onClick={toggleCreateDeckPopup}
                            >
                                <div className='relative px-5 flex justify-center items-center min-h-48 rounded-[10px] bg-white'>
                                    <div className='absolute'><ion-icon
                                        size='large'
                                        name='add-outline'
                                    ></ion-icon>
                                    </div>
                                    <p className='mt-3 absolute bottom-4 text-lg font-bold'>
                                        Empty Deck
                                    </p>
                                </div>
                            </button>

                            {posts.map((post, i) => {
                                return (
                                    <React.Fragment key={post.id}>
                                        <PostImages post={post} />
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}

            {renamePopupOpen && (
                <RenameDeck
                    isOpen={renamePopupOpen}
                    onClose={() => setRenamePopupOpen(false)}
                    deckId={selectedDeck.id}
                    currentName={selectedDeck.heading}
                    fetchDecks={fetchDecks}
                />
            )}
        </>
    )
}

export default Decks
