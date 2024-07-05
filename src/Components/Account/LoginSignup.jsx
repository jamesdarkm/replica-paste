import React, { useState } from 'react';
import Login from './LoginForm.jsx';
import SignUp from './SignupForm.jsx';
import './LoginForm.css';
import './SignupForm.css';

const LoginSignup = () => {
    const [toggle, setToggle] = useState(1);

    const updateToggle = (id) => {
        setToggle(id);
    };

    return (
        <div className='h-100 ai-center space-between d-flex login-register-form'>
            <div className='two-column ad-section'></div>

            <div className='two-column'>
                <div className='form'>
                    <div className='t-center'>
                        <img src='./src/Components/Assets/wetransfer-text-logo.svg' />
                    </div>

                    <div className='d-flex form-toggle'>
                        <button
                            id='login'
                            type='button'
                            className={toggle === 1 ? 'active' : ''}
                            onClick={() => updateToggle(1)}
                        >
                            Login
                        </button>
                        <button
                            id='create-account'
                            type='button'
                            className={toggle === 2 ? 'active' : ''}
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
    );
};

export default LoginSignup;