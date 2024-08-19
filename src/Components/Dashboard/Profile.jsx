import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../axios';
import { db, storage } from '../../../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { getAuth, updateEmail } from 'firebase/auth';
import { useAuth } from '../../Context/authContext';
import {
    doc,
    addDoc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

const Profile = ({ isOpen, onClose, uid, currentUser, setCurrentUser }) => {
    if (!isOpen) return null;

    const [firstName, setFirstName] = useState(
        currentUser.additionalInformation?.firstName?.trim() ||
            currentUser.displayName.split(' ')[0]
    );

    const [lastName, setLastName] = useState(
        currentUser.additionalInformation?.lastName?.trim() ||
            currentUser.displayName.split(' ')[1]
    );

    const [email, setEmail] = useState(currentUser.reloadUserInfo.email);
    const [response, setResponse] = useState('');
    const [avatar, setAvatar] = useState(null);

    // Verify the email first
    // const auth = getAuth();
    // const user = auth.currentUser;
    // updateEmail(user, 'jacktraler@gmail.com').then(() => {
    //     console.log('Email updated successfully');
    // }).catch((error) => {
    //     console.error('Error updating email:', error);
    // });
    const handleSubmit = async (e) => {
        e.preventDefault();

        const docRef = doc(db, 'users', uid);

        try {
            await updateDoc(docRef, {
                firstName: firstName,
                lastName: lastName,
            });
    
            // Assuming you want to update the local state with the new names
            setFirstName(firstName);
            setLastName(lastName);
            
            // Update the currentUser state with the new information
            const updatedUser = {
                ...currentUser,
                additionalInformation: {
                    ...currentUser.additionalInformation,
                    firstName: firstName,
                    lastName: lastName,
                }
            };

            setCurrentUser(updatedUser);
    
            // Uncomment and configure if you're sending an email
            // const response = await axios.post('/send-email', {
            //     email: email,
            // });
    
            // setEmail(''); // Uncomment if you want to reset the email state
            setResponse('Invitation successfully sent!');
        } catch (error) {
            setResponse(
                'Failed to send email, please reach out to support@paste-replica.io'
            );
        }
    };

    const fileInputRef = useRef(null);

    const handleDivClick = () => {
        // Trigger the file input click
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(
                'http://localhost:5000/optimize-image',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const imageResponse = await response.json();
            const downloadedImage = await getDownloadURL(
                ref(storage, `avatars/${imageResponse.firebaseImage}`)
            );
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            console.log(downloadedImage, docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, { avatar: downloadedImage });
                setAvatar(downloadedImage);
            } else {
                await setDoc(docRef, { avatar: downloadedImage });
                console.log('No such avatar!');
            }
        } catch (error) {
            console.error('Error uploading the image:', error);
        }
    };

    useEffect(() => {
        async function getUserAvatar() {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userAvatar = docSnap.data().avatar;
                console.log(userAvatar);
                setAvatar(userAvatar);
            } else {
                console.log('No such doc!');
            }
        }
        getUserAvatar();
    }, []);

    return (
        <div className='relative z-10'>
            <div className='fixed inset-0 bg-gray-900 bg-opacity-75' />
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex justify-end text-center'>
                    <div className='relative pb-20 h-screen transform overflow-hidden bg-white text-left shadow-xl w-11/12 overflow-y-auto'>
                        <div className='bg-white'>
                            <div>
                                <div className=' border-solid border-b-2 border-slate-200 py-4 px-6 '>
                                    <button
                                        className='flex items-center justify-center'
                                        onClick={onClose}
                                    >
                                        <ion-icon
                                            size='large'
                                            name='close-outline'
                                        ></ion-icon>
                                    </button>
                                </div>
                                <div className='mt-7 m-auto w-6/12'>
                                    <h2 className='text-4xl font-bold'>
                                        Profile and security
                                    </h2>

                                    <hr className='mt-8 mb-5 flex-grow border-t border-gray-300' />

                                    <p className='mb-6 text-lg font-bold'>
                                        Profile
                                    </p>
                                    <div
                                        className={
                                            avatar
                                                ? 'flex items-center justify-center w-[80px] h-[80px] rounded-full text-3xl bg-white font-bold'
                                                : 'flex items-center justify-center w-[80px] h-[80px] rounded-full text-3xl bg-purple-500 font-bold'
                                        }
                                    >
                                        <input
                                            type='file'
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept='image/png, image/jpeg'
                                            onChange={handleFileChange}
                                        />
                                        {avatar ? (
                                            <img
                                                className='block w-full h-full object-contain'
                                                src={avatar}
                                                referrerPolicy='no-referrer'
                                            />
                                        ) : (
                                            <ion-icon
                                                onClick={handleDivClick}
                                                name='cloud-upload-outline'
                                                style={{
                                                    color: 'white',
                                                    width: '25px',
                                                    height: '25px',
                                                }}
                                            ></ion-icon>
                                        )}
                                    </div>

                                    <form
                                        className='mt-5'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='grid gap-6 mb-6 md:grid-cols-2'>
                                            <div>
                                                <label
                                                    htmlFor='first_name'
                                                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                                                >
                                                    First name
                                                </label>
                                                <input
                                                    type='text'
                                                    id='first_name'
                                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                    placeholder='John'
                                                    required
                                                    value={firstName}
                                                    onChange={(e) => {
                                                        setFirstName(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor='last_name'
                                                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                                                >
                                                    Last name
                                                </label>
                                                <input
                                                    type='text'
                                                    id='last_name'
                                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                    placeholder='Doe'
                                                    required
                                                    value={lastName}
                                                    onChange={(e) => {
                                                        setLastName(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='mb-6'>
                                            <label
                                                htmlFor='email'
                                                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                                            >
                                                Email address
                                            </label>
                                            <input
                                                type='email'
                                                id='email'
                                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                                placeholder='john.doe@company.com'
                                                required
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <button
                                                type='submit'
                                                className='py-4 basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>

                                    <hr className='mt-8 mb-8 flex-grow border-t border-gray-300' />

                                    <h4 className='mb-6 text-lg font-bold'>
                                        Change your password
                                    </h4>

                                    <p className='mb-5 leading-8'>
                                        Need a little (password) change? We got
                                        you. Just hit the button below and we’ll
                                        send an email to{' '}
                                        {currentUser.reloadUserInfo.email} with
                                        a link to change your password.
                                    </p>

                                    <button
                                        type='submit'
                                        className='py-4 px-8 basis-1/4 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                                    >
                                        Send email
                                    </button>
                                    {response && (
                                        <div
                                            className='mt-4 bg-green-500 text-sm text-white text-center rounded-lg p-4'
                                            role='alert'
                                        >
                                            {response}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
