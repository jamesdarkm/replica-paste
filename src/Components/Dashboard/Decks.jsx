import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc , collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
// import moment from 'moment'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const postImages = (post) => {
        const post_images = post.images?.map((file) => (
            <>
            <Link to={`/dashboard/deck/${post.heading}`} className="mt-5" key={post.id}>
                <div className="min-h-48 rounded bg-cover" style={{ backgroundImage: `url(${file})` }}></div> 
                <p className="mt-3 text-lg font-bold">{post.heading}</p>
                <span>{post.id} | Group placeholder</span>
            </Link>
            </>
        ));
        return post_images;
    };

    useEffect(() => {
        
        async function fdsad() {
            const docRef = doc(db, "decks");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
            // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
    
        fdsad();
        const collectionRef = collection(db, 'decks');
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
        <>
            {posts.map((post) => postImages(post))}
        </>
    );
};

export default Posts;