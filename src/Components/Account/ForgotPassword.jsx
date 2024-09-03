import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import {
    doSignInWithEmailAndPassword,
    doSignInWithGoogle,
    doSignInWithApple,
    doPasswordReset
} from '../../../auth';
import { useAuth } from '../../Context/authContext/index';


const ForgotPassword = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSettingPassword, setIsSettingPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await doPasswordReset(email);
            setIsSettingPassword(true)
            navigate('/')
        } catch (error) {
            throw new Error('there was an error trying to reset the password')
        }
    };

    return (
        <div className='flex'>
            {userLoggedIn && <Navigate to={'/onboard'} replace={true} />}
            
            <div 
                className="bg-cover bg-center h-screen w-1/2" 
                style={{ backgroundImage: "url('./src/Components/Assets/3af386188342017.659ad77880c40.jpg')" }}
            ></div>

            <form onSubmit={onSubmit} className='flex justify-center items-center flex-col w-1/2 '>
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
                    disabled={isSettingPassword}
                    className={`mt-4 w-1/2 px-4 py-4 text-sm font-bold text-white rounded-full ${
                        isSettingPassword
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-900 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                    }`}
                >
                    {isSettingPassword ? 'Sending Email...' : 'Submit'}
                </button>
                {/* <div className="my-5 flex items-center"> 
                <hr className="flex-grow border-t border-gray-300" /> 
                <Link to='/forgot-password' className="px-3 text-sm text-blue-500"> 
                    Forgot Password? 
                </Link> 
                <hr className="flex-grow border-t border-gray-300" /> 
            </div> */}
            </form>

        </div>
    );
};

export default ForgotPassword;
