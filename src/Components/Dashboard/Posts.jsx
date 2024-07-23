import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {collection, onSnapshot, where, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
// import moment from 'moment'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get('post');

    // const { id } = useParams();
    console.log(postId, searchParams)

    const postImages = (post) => {
        console.log(post)
        const post_images = post.images?.map((file) => (
            <a href="/dashboard/deck/dropzone"
                className='card-preview-deck'
                key={post.id}
            >
                <div>
                {post.title}
                    <img src={file} alt='' />
                </div>
                <a href="/dashboard/deck/dropzone" className="card-preview-deck-add"><ion-icon name="add-outline"></ion-icon></a>
            </a>
            
        ));
        return post_images;
    };

    useEffect(() => {
        async function getPost() {
            const docRef = doc(db, "decks", postId);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                // console.log("Document data:", [docSnap.data()]);
                setPosts([docSnap.data()])
            } else {
            // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
    
        getPost();
    }, []);

    return (
        <div className='card-preview-container-deck'>
            {posts.map((post) => postImages(post))}
        </div>
    );
};

export default Posts;