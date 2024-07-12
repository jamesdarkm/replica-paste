import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
    doSignInWithEmailAndPassword,
    doSignInWithGoogle,
} from '../../../auth';
import { useAuth } from '../../Contexts/AuthContext';
import './LoginForm.css';

const Login = () => {
    // const { userLoggedIn } = useAuth();

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
            {/* {userLoggedIn && (<Navigate to={'/home'} replace={true} />)} */}
            <div className='h-100 ai-center space-between d-flex login-register-form'>
                <div className='two-column ad-section'></div>

                <div className='two-column'>
                    <div className='form'>
                        <div className='t-center'>
                            <img src='./src/Components/Assets/wetransfer-text-logo.svg' />
                        </div>

                        <div className='d-flex form-toggle'>
                            <button id='login' type='button' className='active'>
                                Login
                            </button>
                            <button id='create-account' type='button'>
                                Create account
                            </button>
                        </div>

                        <form className='form' onSubmit={onSubmit}>
                            <div>
                                <div className='input-box'>
                                    <ion-icon name='mail-outline'></ion-icon>
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className='input-box'>
                                    <ion-icon name='lock-closed-outline'></ion-icon>
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        required
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                    />
                                </div>

                                {errorMessage && (
                                    <span className='text-red-600 font-bold'>
                                        {errorMessage}
                                    </span>
                                )}

                                <div className='mx-1 t-center remember-forgot'>
                                    <a href='#'>Forgot password?</a>
                                </div>

                                <button
                                    type='submit'
                                    disabled={isSigningIn}
                                    className='btn'
                                >
                                    {isSigningIn ? 'Logging In...' : 'Login'}
                                </button>
                            </div>
                        </form>

                        <button
                            disabled={isSigningIn}
                            onClick={(e) => {
                                onGoogleSignIn(e);
                            }}
                            className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${
                                isSigningIn
                                    ? 'cursor-not-allowed'
                                    : 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'
                            }`}
                        >
                            <ion-icon name='logo-google'></ion-icon>
                            {isSigningIn
                                ? 'Signing In...'
                                : 'Continue with Google'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;