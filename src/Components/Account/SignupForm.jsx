import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/authContext/index';
import { doSignInWithGoogle, doCreateUserWithEmailAndPassword } from '../../../auth';
import TermsOfService from '../Legal/TermsOfService';
import PrivacyPolicy from '../Legal/PrivacyPolicy';
const SignUp = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const authContext = useAuth();
    const userLoggedIn = authContext ? authContext.userLoggedIn : false;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            await doCreateUserWithEmailAndPassword(firstName, lastName, email, password);
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            doSignInWithGoogle().catch((err) => {
                setIsRegistering(false);
            });
        }
    };

    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const toggleTermsPopup = () => {
        setIsTermsOpen(!isTermsOpen);
    };

    const togglePrivacyPopup = () => {
        setIsPrivacyOpen(!isPrivacyOpen);
    };
    
    return (
        <>
            {userLoggedIn && <Navigate to={'/onboard'} replace={true} />}
            
            <TermsOfService isOpen={isTermsOpen} onClose={toggleTermsPopup} />
            <PrivacyPolicy isOpen={isPrivacyOpen} onClose={togglePrivacyPopup} />
            
            <button
                disabled={isRegistering}
                onClick={(e) => {
                    onGoogleSignIn(e);
                }}
                className={`mt-5 w-full flex items-center justify-center gap-x-3 py-4 border rounded-full border-gray-200 border-solid text-sm font-bold ${
                    isRegistering
                        ? 'cursor-not-allowed'
                        : 'hover:border-gray-600 transition duration-300 active:bg-gray-100'
                }`}
            >
                <img
                    src='./src/Components/Assets/google-logo.svg'
                    className='w-5'
                />
                {isRegistering ? 'Signing In...' : 'Continue with Google'}
            </button>

            <div className='my-5 flex items-center'>
                <hr className='flex-grow border-t border-gray-300' />
                <span className='px-3 text-sm text-gray-500'>
                    Or better yet...
                </span>
                <hr className='flex-grow border-t border-gray-300' />
            </div>

            <form onSubmit={onSubmit} className='space-y-4'>
                <div className='relative'>
                    <input
                        className='w-full pl-10 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        placeholder='First Name'
                        type='text'
                        required
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                        }}
                    />
                    <div
                        className='absolute inset-y-0 pl-3  
                            flex items-center  
                            pointer-events-none'
                    >
                        <ion-icon name="person-outline"></ion-icon>
                    </div>
                </div>

                <div className='relative'>
                    <input
                        className='w-full pl-10 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        placeholder='Last Name'
                        type='text'
                        required
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                        }}
                    />
                    <div
                        className='absolute inset-y-0 pl-3  
                            flex items-center  
                            pointer-events-none'
                    >
                        <ion-icon name="person-outline"></ion-icon>
                    </div>
                </div>

                <div className='relative'>
                    <input
                        className='w-full pl-10 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        placeholder='Email'
                        type='email'
                        autoComplete='email'
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <div
                        className='absolute inset-y-0 pl-3  
                            flex items-center  
                            pointer-events-none'
                    >
                        <ion-icon name='mail-outline'></ion-icon>
                    </div>
                </div>

                <div className='mt-3 relative'>
                    <input
                        disabled={isRegistering}
                        type='password'
                        className='w-full pl-10 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        autoComplete='current-password'
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder='Password'
                    />
                    <div
                        className='absolute inset-y-0 pl-3  
                            flex items-center  
                            pointer-events-none'
                    >
                        <ion-icon name="lock-closed-outline"></ion-icon>
                    </div>
                </div>

                <div className='mt-3 relative'>
                    <input
                        disabled={isRegistering}
                        type='password'
                        className='w-full pl-10 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        autoComplete='current-password'
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                            setconfirmPassword(e.target.value);
                        }}
                        placeholder='Confirm Password'
                    />
                    <div
                        className='absolute inset-y-0 pl-3  
                            flex items-center  
                            pointer-events-none'
                    >
                        <ion-icon name="lock-closed-outline"></ion-icon>
                    </div>
                </div>


                {errorMessage && (
                    <span className='text-red-600 font-bold'>
                        {errorMessage}
                    </span>
                )}

                <div className='text-sm text-center'>
                    By creating an account, you agree to our <button type="button" onClick={toggleTermsPopup} className='text-center text-sm underline'>Terms of Service</button> and <button type="button" onClick={togglePrivacyPopup} className='text-center text-sm underline'>Privacy & Cookie Statement</button>
                </div>
            
                <button
                    type='submit'
                    disabled={isRegistering}
                    className={`mt-4 w-full px-4 py-4 text-sm font-bold text-white rounded-full ${
                        isRegistering
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-900 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                    }`}
                >
                    {isRegistering ? 'Creating your account...' : 'Create Paste Replica'}
                </button>
            </form>
        </>
    );
};

export default SignUp;
