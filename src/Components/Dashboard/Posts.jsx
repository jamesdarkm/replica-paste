import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
// import moment from 'moment'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const postImages = (post) => {
        const post_images = post.images?.map((file) => (
            <a href="/dashboard/deck/dropzone"
                className='card-preview-deck'
                key={post.id}
            >
                <div>
                    <img src={file} alt='' />
                </div>
                <a href="/dashboard/deck/dropzone" className="card-preview-deck-add"><ion-icon name="add-outline"></ion-icon></a>
            </a>
            
        ));
        return post_images;
    };

    useEffect(() => {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setPosts(
                querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                    timestamp: doc.data().timestamp?.toDate().getTime(),
                }))
            );
        });

        return unsubscribe;
    }, []);

    return (
        <div className='card-preview-container-deck'>
            {posts.map((post) => postImages(post))}
        </div>
    );
};

export default Posts;