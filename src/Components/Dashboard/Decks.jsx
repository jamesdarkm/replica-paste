import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    doc,
    getDoc,
    getDocs,
    collection
} from 'firebase/firestore';
import { db } from '../../../firebase';
// import moment from 'moment'

const Decks = ({ uid, toggleCreateDeckPopup  }) => {
    const [posts, setPosts] = useState([]);

    console.log(toggleCreateDeckPopup)
    const postImages = (post) => {
        const placeholderImage = '/src/Components/Assets/placeholder-deck-image.jpg';
        const imageUrl = post.thumbnail || placeholderImage;

        return (
            <>
                {post.heading && (
                <Link
                    to={`/dashboard/deck/${post.id}`}
                    className='mt-5'
                    key={post.id} // Use the post ID as the key
                >
                    <div
                        className='min-h-48 rounded bg-center bg-cover'
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    ></div>
                    <p className='mt-3 text-lg font-bold'>{post.heading}</p>
                </Link>
                )}
            </>
        );
    };


    useEffect(() => {
        const fetchDecks = async (uid) => {
            const docRef = doc(db, 'decks', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const subCollectionRef = collection(
                    docRef,
                    'decksSubCollection'
                );

                
                // Retrieve all documents from the decksSubCollection sub-collection
                const subCollectionSnapshot = await getDocs(subCollectionRef);

                const decksArray = subCollectionSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log(decksArray)
                setPosts(decksArray);
            } else {
               console.log('Parent document does not exist.');
            }
        };

        // Call the function with a specific uid
        fetchDecks(uid);
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
                                    Empty Deck
                                </p>
                            </button>

                            {posts.map((post) => (
                                <React.Fragment key={post.id}>
                                    {postImages(post)}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Decks;