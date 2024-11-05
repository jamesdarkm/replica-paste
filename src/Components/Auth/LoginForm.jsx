import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../auth';
import { useAuth } from '../../Context/authContext/index';

const LoginForm = () => {
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

    return (
        <>
            {userLoggedIn && <Navigate to={'/onboard'} replace={true} />}
            <form onSubmit={onSubmit} className='my-5'>
                <div className='relative'>
                    <input
                        className='w-full pl-5 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        placeholder='Email'
                        type='email'
                        autoComplete='email'
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>

                <div className='mt-3 relative'>
                    <input
                        type='password'
                        className='w-full pl-4 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        autoComplete='current-password'
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        placeholder='Password'
                    />
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
                            ? 'bg-socialpaste-purple cursor-not-allowed'
                            : 'bg-socialpaste-purple hover:shadow-xl transition duration-300'
                    }`}
                >
                    {isSigningIn ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <div className="my-5 flex items-center justify-center"> 
                <p className="px-3 text-sm text-white-500 text-center"> 
                    OR
                </p> 
            </div>

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

            <div className="mt-12 flex items-center justify-center"> 
                <Link to='/forgot-password' className="px-3 text-sm text-socialpaste-purple"> 
                    <span className='text-socialpaste-gray'>Don't have an account?</span> Sign up
                </Link> 
            </div>
        </>
    );
};

export default LoginForm;
