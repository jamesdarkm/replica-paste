import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { doPasswordReset } from '../../../auth';
import { useAuth } from '../../Context/authContext/index';

const ForgotPassword = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [resetPassword, setResetPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setResetPassword(
            'Sending password reset link to ' + email + ', please wait...'
        );

        try {
            const res = await fetch(
                'http://localhost:5001/generate-reset-link',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (!res.ok) {
                throw new Error('Failed to send reset link');
            }

            setResetPassword(
                'We have sent you a password reset link to: ' + email
            );
        } catch (error) {
            setErrorMessage(
                'There was an error trying to reset the password. Please try again.'
            );
        }
    };

    return (
        <div className='flex'>
            {userLoggedIn && <Navigate to={'/onboard'} replace={true} />}

            <div
                className='bg-cover bg-center h-screen w-1/2'
                style={{
                    backgroundImage:
                        "url('./src/Components/Assets/3af386188342017.659ad77880c40.jpg')",
                }}
            ></div>

            <form
                onSubmit={onSubmit}
                className='flex justify-center items-center flex-col w-1/2 '
            >
                <div className='relative w-1/2'>
                    <input
                        className='w-full pl-10 pr-4 py-4 rounded border-none bg-gray-50 rounded-lg'
                        placeholder='Enter your email'
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

                {errorMessage && (
                    <span className='text-red-600 font-bold'>
                        {errorMessage}
                    </span>
                )}

                <button
                    type='submit'
                    className={`mt-4 w-1/2 px-4 py-4 text-sm font-bold text-white rounded-full bg-gray-900 hover:bg-indigo-700 hover:shadow-xl transition duration-300`}
                >
                    Reset Password
                </button>

                <p className='mt-4'>{resetPassword}</p>

                <div className='my-5 flex items-center'>
                    <hr className='flex-grow border-t border-gray-300' />
                    <Link to='/' className='px-3 text-sm text-blue-500'>
                        Go back Log in page
                    </Link>
                    <hr className='flex-grow border-t border-gray-300' />
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
