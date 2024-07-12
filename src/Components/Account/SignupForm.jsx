import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword,doSignInWithEmailAndPassword,doSignInWithGoogle } from '../../../auth';
import { useAuth } from '../../Contexts/AuthContext';
import './SignupForm.css';

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            await doCreateUserWithEmailAndPassword(email, password);
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
                            <Link to={'/'} id='login' className="hover:underline font-bold">Login</Link>
                            <Link to={'/'} id='create-account' className="hover:underline font-bold">Create account</Link>
                        </div>

                            <div>
                                <div className='signup-container'>
                                    <div className='form-column'>
                                        <form onSubmit={onSubmit}>
                                            <div className='form-group'>
                                                <label>Email</label>
                                                <input
                                                    type='email'
                                                    placeholder='Enter your email'
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label>Password</label>
                                                <input
                                                    disabled={isRegistering}
                                                    type='password'
                                                    placeholder='Enter your password'
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

                                            <button type='submit' disabled={isRegistering}>
                                                {isRegistering ? 'Signing Up...' : 'Sign Up'}
                                            </button>
                                        </form>

                                        <div className='social-signup'>
                                            <button
                                                disabled={isRegistering}
                                                onClick={(e) => {
                                                    onGoogleSignIn(e);
                                                }}
                                                className={`social-btn google w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${
                                                    isRegistering
                                                        ? 'cursor-not-allowed'
                                                        : 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'
                                                }`}
                                            >
                                                <ion-icon name='logo-google'></ion-icon>
                                                {isRegistering
                                                    ? 'Registering...'
                                                    : 'Continue with Google'}
                                            </button>

                                            <button className='social-btn facebook'>
                                                Sign Up with Facebook
                                            </button>
                                        </div>
                                        <p className='signin-text'>
                                            Already have an account? <Link to={'/login'}>Sign In</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
