import React from 'react';
import './LoginForm.css';

const Login = () => {
    return (
        <form className='form' action=''>
            <div>
                <div className='input-box'>
                    <ion-icon name='mail-outline'></ion-icon>
                    <input type='email' placeholder='Email' required />
                </div>
                <div className='input-box'>
                    <ion-icon name='lock-closed-outline'></ion-icon>
                    <input type='password' placeholder='Password' required />
                </div>

                <div className='mx-1 t-center remember-forgot'>
                    <a href='#'>Forgot password?</a>
                </div>

                <button type='submit' className='btn'>
                    Login
                </button>
            </div>
        </form>
    );
};

export default Login;