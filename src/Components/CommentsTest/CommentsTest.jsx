import React, { useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { CommentSection} from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import { useAuth } from '../../Context/authContext';
import './CustomComments.css'

const CommentsTest = ({ deckId, cardId }) => {
    const [postCommentsData, setPostCommentsData] = useState([]);
    const { currentUser } = useAuth();
    const isGoogleProvider = currentUser.providerData[0].providerId === 'google.com';
    const displayName = isGoogleProvider ? currentUser.displayName : `${currentUser.additionalInformation.firstName}${currentUser.additionalInformation.lastName}`;

    // this userData is needed in order and, edit, delete or send a comment
    const userData = {
        currentUserId: currentUser.uid,
        currentUserImg: 'https://ui-avatars.com/api/name=Riya&background=random',
        currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
        currentUserFullName: displayName,
    }
    
    // console.log(displayName);
  
    // when page loads we fetch the comments of a specific post
    // then we set and display the comments of that post.
    useEffect(() => {
        async function getPostComments(){
            const docRef = doc(db, 'decks', deckId);
            const docSnap = await getDoc(docRef);
          
            if (docSnap.exists()) {
                const documentData = docSnap.data();
                const comments = documentData.decks[cardId].comments;
                console.log(comments)
                const validComments = (comments && Array.isArray(comments) && comments.length === 0) ? [] : comments;
                setPostCommentsData(validComments);
            }
              
        }

      getPostComments();

    },[])

    // when a user adds, edits, deletes a comment, we update the comments data of the card then send that data to firebase
    const processComments = async (data) => {
      if(data.length > 0){
          console.log('currentData is:', data, deckId)
  
          const docRef = doc(db, 'decks', deckId);
          const modifiedCommentsData =  { [`decks.${cardId}.comments`]: data}
          await updateDoc(docRef, modifiedCommentsData);
          setPostCommentsData(data);
          console.log('Document successfully written!');
      }
  
    }
  
    return(
        <>
        <CommentSection
            currentUser={userData}
            logIn={{
              loginLink: import.meta.env.VITE_ROOT,
              signupLink: import.meta.env.VITE_ROOT
            }}
            commentData={postCommentsData}
            onSubmitAction={(data) => console.log('')}
            currentData={processComments}
        />
        </>
    )
}

export default CommentsTest