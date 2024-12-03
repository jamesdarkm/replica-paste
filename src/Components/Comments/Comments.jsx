import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context/authContext'

/* Firebase */
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'

/* CSS */
import './Comments.css'
import 'react-comments-section/dist/index.css'

/* Icons */
import EmojiIcon from '../Icons/EmojiIcon'

/* Components */
import { CommentSection } from 'react-comments-section'

const Comments = ({ deckId, cardId }) => {
     /**
     * States
     */
    const [openCommentBox, setOpenCommentBox] = useState(false)
    const [postCommentsData, setPostCommentsData] = useState([])

    const { currentUser } = useAuth()

    const isGoogleProvider = currentUser.providerData[0].providerId === 'google.com'
    const displayName = isGoogleProvider ? currentUser.displayName : `${currentUser.additionalInformation.firstName}${currentUser.additionalInformation.lastName}`



    /**
     * userData required in order to edit, delete or send a comment
     */
    const userData = {
        currentUserId: currentUser.uid,
        currentUserImg: 'https://ui-avatars.com/api/name=Riya&background=random',
        currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
        currentUserFullName: displayName,
    }



    /**
     * On page load fetch the comments of a specific post 
     * set and display the comments of that post
     */
    useEffect(() => {
        async function getPostComments() {
            const docRef = doc(db, 'decks', deckId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const documentData = docSnap.data()
                const comments = documentData.decks[cardId].comments
                console.log(comments)
                const validComments = (comments && Array.isArray(comments) && comments.length === 0) ? [] : comments
                setPostCommentsData(validComments)
            }

        }

        getPostComments()
    }, [])



    /**
     * On user add, edit, delete, update comment data of the card
     * and submit data to firebase
     */
    const processComments = async (data) => {
        if (data.length > 0) {
            console.log('currentData is:', data, deckId)

            const docRef = doc(db, 'decks', deckId)
            const modifiedCommentsData = { [`decks.${cardId}.comments`]: data }
            await updateDoc(docRef, modifiedCommentsData)
            setPostCommentsData(data)
            console.log('Document successfully written!')
        }

    }
    


    /**
     * Custom no comment text
     */
    const customNoComment = () => (
        <div className='mt-7 no-com text-center'>No comments here. Be the first one to comment!</div>
    )

    return (
        <>
            <div className='mt-[100px]'>
                {!openCommentBox && (
                    <button type='' className='fixed bottom-[23px] left-1/2 transform -translate-x-1/2 z-10 flex gap-[26px] items-center py-[16px] px-[20px] w-[calc(100%-40px)] md:w-[692px] border border-solid border-2 border-socialpaste-grey rounded-[5px] bg-white shadow-xl' 
                    onClick={() => setOpenCommentBox(true)}>
                        <EmojiIcon className='w-[31px] group-hover:invert' />

                        <span className='text-socialpaste-lightergray'>Add a comment</span>
                    </button>
                )}

                {openCommentBox && (
                    <div className='w-full border border-solid border-2 border-socialpaste-grey rounded-[10px] shadow-xl fixed bottom-[23px] z-10 bg-white max-h-[400px] overflow-y-auto'>
                        <div className='sticky top-0 py-[16px] px-[18px] flex justify-between items-center font-semibold text-[16px] border-solid border-b-2 border-socialpaste-grey bg-white z-10'>
                            <span>Comments</span>
                            <button
                                className='flex items-center justify-center'
                                onClick={() => setOpenCommentBox(false)}
                            >
                                <ion-icon
                                    size='large'
                                    name='close-outline'
                                ></ion-icon>
                            </button>
                        </div>
                        <CommentSection
                            currentUser={userData}
                            logIn={{
                                loginLink: import.meta.env.VITE_ROOT,
                                signupLink: import.meta.env.VITE_ROOT
                            }}
                            showTimestamp={true}
                            commentData={postCommentsData}
                            placeholder={'Add a comment'}
                            onSubmitAction={(data) => console.log('')}
                            currentData={processComments}
                            customNoComment={() => customNoComment()}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default Comments