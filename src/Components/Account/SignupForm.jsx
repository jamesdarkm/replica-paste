import React from 'react';
import './SignupForm.css';

const SignUp = () => {
    return (
        <div className='signup-container'>
            <div className='form-column'>
                <form>
                    <div className='form-group'>
                        <label>Email</label>
                        <input type='email' placeholder='Enter your email' />
                    </div>
                    <div className='form-group'>
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='Enter your password'
                        />
                    </div>
                    <button type='submit'>Sign Up</button>
                </form>
                <div className='social-signup'>
                    <button className='social-btn google'>
                        Sign Up with Google
                    </button>
                    <button className='social-btn facebook'>
                        Sign Up with Facebook
                    </button>
                </div>
                <p className='signin-text'>
                    Already have an account? <a href='/signin'>Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;