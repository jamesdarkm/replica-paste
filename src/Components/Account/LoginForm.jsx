import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
    doSignInWithEmailAndPassword,
    doSignInWithGoogle,
    doSignInWithApple
} from '../../../auth';
import { useAuth } from '../../Context/authContext/index';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password);
            // doSendEmailVerification()
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch((err) => {
                setIsSigningIn(false);
            });
        }
    };

    const onAppleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithApple();
        }
    }

    return (
        <>
            {userLoggedIn && <Navigate to={'/onboard'} replace={true} />}

            <button
                disabled={isSigningIn}
                onClick={(e) => {
                    onGoogleSignIn(e);
                }}
                className={`mt-5 w-full flex items-center justify-center gap-x-3 py-4 border rounded-full border-gray-200 border-solid text-sm font-bold ${
                    isSigningIn
                        ? 'cursor-not-allowed'
                        : 'hover:border-gray-600 transition duration-300 active:bg-gray-100'
                }`}
            >
                <img src='./src/Components/Assets/google-logo.svg' className="w-5" />
                {isSigningIn ? 'Signing In...' : 'Continue with Google'}
            </button>
{/* 
            <button
                disabled={isSigningIn}
                onClick={(e) => {
                    onAppleSignIn(e);
                }}
                className={`mt-5 w-full flex items-center justify-center gap-x-3 py-4 border rounded-full border-gray-200 border-solid text-sm font-bold ${
                    isSigningIn
                        ? 'cursor-not-allowed'
                        : 'hover:border-gray-600 transition duration-300 active:bg-gray-100'
                }`}
            >
                <img src='./src/Components/Assets/apple-logo.png' className="w-8.5 h-5 -ml-5" />
                {isSigningIn ? 'Signing In...' : 'Continue with Apple'}
            </button> */}

            <div className="my-5 flex items-center"> 
                <hr className="flex-grow border-t border-gray-300" /> 
                <span className="px-3 text-sm text-gray-500"> 
                    Or better yet...
                </span> 
                <hr className="flex-grow border-t border-gray-300" /> 
            </div>

            <form onSubmit={onSubmit}>
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

                {errorMessage && (
                    <span className='text-red-600 font-bold'>
                        {errorMessage}
                    </span>
                )}

                <button
                    type='submit'
                    disabled={isSigningIn}
                    className={`mt-4 w-full px-4 py-4 text-sm font-bold text-white rounded-full ${
                        isSigningIn
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-900 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                    }`}
                >
                    {isSigningIn ? 'Logging In...' : 'Log in with Paste Replica'}
                </button>
            </form>
        </>
    );
};

export default Login;
