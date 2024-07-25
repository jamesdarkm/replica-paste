import React, { useState } from 'react';
import Login from './LoginForm.jsx';
import SignUp from './SignupForm.jsx';

const LoginSignup = () => {
    const [toggle, setToggle] = useState(1);

    const updateToggle = (id) => {
        setToggle(id);
    };

    return (
        <>
            <div className="flex">
                <div 
                className="bg-cover bg-center h-screen w-2/4" 
                style={{ backgroundImage: "url('./src/Components/Assets/3af386188342017.659ad77880c40.jpg')" }}
                ></div>

                <div className="w-2/4 flex justify-center content-center">
                    <div className="w-1/3 content-center">
                        <div>
                            <div className="mb-10 flex justify-center">
                                <img className="invert" src='./src/Components/Assets/wetransfer-text-logo.svg' />
                            </div>

                            <div className='flex form-toggle'>
                                <button
                                    id='login'
                                    type='button'
                                    className={`w-2/4 font-bold text-slate-900 border-solid border-b-2 border-gray-700 hover:border-gray-900 px-3 py-5 ${
                                        toggle
                                            ? 'xbg-gray-300'
                                            : 'bg-gray-900 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                                    }`}
                                    onClick={() => updateToggle(1)}
                                >
                                    Login
                                </button>
                                <button
                                    id='create-account'
                                    type='button'
                                    className='w-2/4 font-bold text-slate-300 hover:text-slate-900 border-solid border-b-2 border-gray-300 hover:border-gray-700 px-3 py-5'
                                    onClick={() => updateToggle(2)}
                                >
                                    Create account
                                </button>
                            </div>

                            {toggle === 1 && (
                                <div>
                                    <Login />
                                </div>
                            )}

                            {toggle === 2 && (
                                <div>
                                    <SignUp />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSignup;