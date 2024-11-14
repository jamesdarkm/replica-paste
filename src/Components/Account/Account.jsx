import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../Context/authContext'

/* Firebase */
import { db, storage } from '../../../firebase'
import { ref, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { doSignOut } from '../../../auth'

/* Compontents */
import Aside from '../NavBar/Aside'

const Profile = () => {
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
    const [firstName, setFirstName] = useState(currentUser.additionalInformation.firstName)
    const [lastName, setLastName] = useState(currentUser.additionalInformation.lastName)
    const [email, setEmail] = useState(currentUser.reloadUserInfo.email)
    const [firstLastNameResponse, setFirstLastNameResponse] = useState('')
    const [response, setResponse] = useState('')
    const [avatar, setAvatar] = useState(currentUser.additionalInformation.avatar)
    const [resetResponse, setResetResponse] = useState('')
    const [deleteResponse, setDeleteResponse] = useState('')
    const uid = currentUser?.uid



    /**
     * Display picture
     * Use Google's user's profile picture if the avatar is blank
     */
    let displayPicture = currentUser.additionalInformation.avatar
    if (displayPicture === '' || displayPicture === null) {
        displayPicture = currentUser?.photoURL
    }



    /**
     * Update first & last name
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        const docRef = doc(db, 'users', uid)

        setFirstLastNameResponse('Updating details, please wait...')
        try {
            await updateDoc(docRef, {
                firstName: firstName,
                lastName: lastName,
            })

            setFirstName(firstName)
            setLastName(lastName)

            const updatedUser = {
                ...currentUser,
                additionalInformation: {
                    ...currentUser.additionalInformation,
                    firstName: firstName,
                    lastName: lastName,
                },
            }

            setFirstLastNameResponse('Details updated')
        } catch (error) {
            setFirstLastNameResponse(
                'Failed to send email, please reach out to support@paste-replica.io'
            )
        }
    }



    /**
     * Change display photo
     */
    const fileInputRef = useRef(null)

    const handleDivClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0]

        if (!file) {
            alert('Please select a file first')
            return
        }

        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await fetch(
                'http://localhost:5000/optimize-image',
                {
                    method: 'POST',
                    body: formData,
                }
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const imageResponse = await response.json()
            const downloadedImage = await getDownloadURL(
                ref(storage, `avatars/${imageResponse.firebaseImage}`)
            )

            const docRef = doc(db, 'users', currentUser.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                await updateDoc(docRef, { avatar: downloadedImage })
                setAvatar(downloadedImage)
            } else {
                await setDoc(docRef, { avatar: downloadedImage })
                console.log('No such avatar!')
            }
        } catch (error) {
            console.error('Error uploading the image:', error)
        }
    }



    /**
     * Change password
     */
    const PasswordReset = async () => {
        setResetResponse('Sending password reset link to ' + currentUser.email + ', please wait...')

        try {
            const res = await fetch('http://localhost:5001/generate-reset-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: currentUser.email }),
            })

            if (!res.ok) {
                throw new Error('Failed to send reset link')
            }

            setResetResponse('We have sent you a password reset link to: ' + currentUser.email + '. You will be logged out in a few seconds.')

            setTimeout(() => {
                doSignOut().then(() => {
                    navigate('/')
                })
            }, 3000)
        } catch (error) {
            setResetResponse('There was an error trying to reset the password. Please try again.')
        }
    }



    /**
     * Delete account
     */
    const DeleteAccount = async () => {
        setDeleteResponse('Deleting account, please wait...')

        const docRef = doc(db, 'users', uid)

        try {
            await updateDoc(docRef, {
                status: 'Inactive'
            })

            setDeleteResponse('Account successfully deleted. You will be logged out in a few seconds.')

            setTimeout(() => {
                doSignOut().then(() => {
                    navigate('/')
                })
            }, 3000)
        } catch (error) {
            setDeleteResponse(
                'Failed to send delete account, please reach out to support@paste-replica.io'
            )
        }
    }

    return (
        <>
            <section className='lg:flex'>
                <Aside currentUser={currentUser} />

                <div className='container pt-[220px] lg:pt-[80px] pb-2 px-4 lg:y-16 mx-auto max-w-full lg:max-w-screen-2xl'>
                    <div className='mb-[50px] py-[20px] px-[24px] w-full flex items-center gap-10 rounded-[10px] bg-white'>
                        <div
                            className='flex items-center justify-center w-[80px] h-[80px] rounded-full text-3xl font-bold'
                        >
                            <input
                                type='file'
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept='image/png, image/jpeg'
                                onChange={handleFileChange}
                            />
                            <img className='block w-full h-full object-contain rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col gap-4 flex-grow">
                            <button
                                type='button'
                                className='w-full px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark'
                                onClick={handleDivClick}
                            >
                                Pick an image
                            </button>
                            <button
                                type='button'
                                className='w-full px-8 py-4 rounded-full font-bold border-2 border-solid border-[#F6F7F5] bg-white hover:bg-[#F6F7F5]'
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className='mb-[50px] py-[20px] px-[24px] w-full rounded-[10px] bg-white'>
                        <p className='font-bold text-[16px]'>My information</p>

                        <form className='mt-5' onSubmit={handleSubmit}>
                            <label htmlFor='first_name' className='block mb-[11px] text-[14px] text-socialpaste-gray'>First name</label>
                            <input
                                type='text'
                                id='first_name'
                                className='mb-[14px] py-[12px] px-[14px] text-[14px] w-full bg-socialpaste-lightergray border border-socialpaste-lightergray dark:placeholder-socialpaste-gray text-sm rounded-lg focus:ring-socialpaste-purple focus:border-socialpaste-purple'
                                placeholder='John'
                                required
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(
                                        e.target.value
                                    )
                                }}
                            />

                            <label htmlFor='last_name' className='block mb-[11px] text-[14px] text-socialpaste-gray'>
                                Last name
                            </label>
                            <input
                                type='text'
                                id='last_name'
                                className='mb-[14px] py-[12px] px-[14px] text-[14px] w-full bg-socialpaste-lightergray border border-socialpaste-lightergray dark:placeholder-socialpaste-gray text-sm rounded-lg focus:ring-socialpaste-purple focus:border-socialpaste-purple'
                                placeholder='Doe'
                                required
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(
                                        e.target.value
                                    )
                                }}
                            />

                            <label htmlFor='email' className='block mb-[11px] text-[14px] text-socialpaste-gray'>
                                Email address
                            </label>
                            <p
                                id='email'
                                className='mb-[14px] py-[12px] px-[14px] text-[14px] w-full bg-socialpaste-lightergray border border-socialpaste-lightergray dark:placeholder-socialpaste-gray text-sm rounded-lg focus:ring-socialpaste-purple focus:border-socialpaste-purple'
                            >
                                {email}
                            </p>

                            <div className='flex flex-row gap-3'>
                                <button
                                    type='submit'
                                    className='px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark'
                                >
                                    Save details
                                </button>
                            </div>

                            <p className='mt-4 text-socialpaste-gray font-bold'>
                                {firstLastNameResponse}
                            </p>
                        </form>
                    </div>

                    <div className='mb-[50px] py-[20px] px-[24px] w-full rounded-[10px] bg-white'>
                        <p className='mb-[11px] font-bold text-[16px]'>Change your password</p>

                        <p className='mb-[16px] text-socialpaste-gray'>Need a little (password) change? We got you. Just hit the button below and we'll send an email to{' '}
                            {currentUser.reloadUserInfo.email} with a link to change your password.</p>

                        <button
                            type='button'
                            onClick={PasswordReset}
                            className='w-full px-8 py-4 rounded-full font-bold text-white bg-socialpaste-purple hover:bg-socialpaste-purple-dark'
                        >
                            Reset password
                        </button>

                        <p className='mt-4 text-socialpaste-gray font-bold'>
                            {resetResponse}
                        </p>
                    </div>

                    <div className='mb-[50px] py-[20px] px-[24px] w-full rounded-[10px] bg-white'>
                        <p className='mb-[11px] font-bold text-[16px]'>Delete forever</p>

                        <p className='mb-[16px] text-socialpaste-gray'>Permanently delete your account and all your slides and teams deck.</p>

                        <button type='button' onClick={DeleteAccount} className='w-full px-8 py-4 rounded-full font-bold text-white bg-socialpaste-red'>
                            Delete account
                        </button>

                        <p className='mt-4 text-socialpaste-gray font-bold'>
                            {deleteResponse}
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Profile
