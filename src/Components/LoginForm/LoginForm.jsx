import React, { useState } from 'react'
import './LoginForm.css'

const LoginForm = () => {
    const [toggle, setToggle] = useState(1)

    function updateToggle(id) {
        setToggle(id)
        
        if (id == 1) {
            document.getElementById('login').classList.add('active')
            document.getElementById('create-account').classList.remove('active')
        } else {
            document.getElementById('login').classList.remove('active')
            document.getElementById('create-account').classList.add('active')
        }
    }

    return (
        <div className="h-100 ai-center space-between d-flex login-register-form">
            <div className='two-column ad-section'></div>

            <div className='two-column'>
                <form className="form" action="">
                    <div className="t-center">
                        <img src="./src/Components/Assets/wetransfer-text-logo.svg" />
                    </div>

                    <div className="d-flex form-toggle">
                        <button id="login" type="button" className="active" onClick={()=>updateToggle(1)}>Login</button>
                        <button id="create-account" type="button" onClick={()=>updateToggle(2)}>Create account</button>
                    </div>

                    <div className={toggle === 1 ? "" : "d-none"}>
                        <div className='input-box'>
                            <ion-icon name="mail-outline"></ion-icon>
                            <input type='email' placeholder='Email' required />
                        </div>
                        <div className='input-box'>
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input type='password' placeholder='Password' required />
                        </div>

                        <div className='mx-1 t-center remember-forgot'>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn">Login</button>
                    </div>

                    <div className={toggle === 2 ? "" : "d-none"}>
                        <p className="t-center"><strong><br /><br />Registration form goes here<br /><br /><br /></strong></p>

                        <button type="submit" className="btn">Create account</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default LoginForm