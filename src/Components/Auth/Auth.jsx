import React, { useState } from 'react'
import LoginForm from './LoginForm';
import SignUpForm from './SignupForm';
import Logo from '../../assets/Logo.svg'
import LogoName from '../../assets/LogoName.svg'

export default function Auth() {
    const [toggle, setToggle] = useState(false);

    const updateToggle = (id) => {
        setToggle(!toggle);
    };
    
    return (
        <>
        <div className="flex">
            <div className="w-3/4 flex justify-center content-center">
                <div className="w-[586px] content-center">
                    <>
                        <div className="mb-10 flex justify-center absolute top-[20px] left-[40px] gap-[15px]">
                            <img src={Logo} />
                            <img src={LogoName} />
                        </div>

                        <div className="mb-10">
                            <p className='font-[Inter] font-black text-[46px] text-center'>
                                { toggle ? 'Join SocialPaste' : 'Welcome Back!'}
                            </p>
                            <p className='font-[Inter] font-normal text-[16px] text-socialpaste-gray text-center'>
                                { toggle ? 'Sign up for free!' : 'Log in to your Social Paste'}
                            </p>
                        </div>

                        <div className='flex form-toggle'>
                            <button
                                id='login'
                                type='button'
                                className={`w-2/4 font-bold border-solid ${toggle ? 'border-b-2 border-gray-300 text-slate-300' : 'border-b-2 border-gray-700 text-slate-900'} hover:border-gray-900 px-3 py-5`}
                                onClick={() => updateToggle(!toggle)}
                            >
                                Login
                            </button>
                            <button
                                id='create-account'
                                type='button'
                                className={`w-2/4 font-bold hover:text-slate-900 border-solid ${toggle ? 'border-b-2 border-gray-700 text-slate-900' : 'border-b-2 border-gray-300 text-slate-300'} hover:border-gray-700 px-3 py-5`}
                                onClick={() => updateToggle(!toggle)}
                            >
                                Create account
                            </button>
                        </div>

                        {toggle ? (
                            <div>
                                <SignUpForm />
                            </div>
                        ) : (
                            <div>
                                <LoginForm />
                            </div>
                        )}
                    </>
                </div>
            </div>

            <div className="bg-cover bg-center h-screen w-2/4" style={{ backgroundImage: "url('./src/Components/Assets/3af386188342017.659ad77880c40.jpg')" }}>
            </div>
        </div>
        </>
    );
}
