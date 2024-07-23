import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Deck.css';
import './Modal.css';
import DropZone from './DropZone.jsx';
import './DropZone.css';
import Posts from './Posts.jsx';
import './Posts.css';

const Deck = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [toggle, setToggle] = useState(1);
    const { id } = useParams();

    const updateToggle = (id) => {
        setToggle(id);
    };

    /**
     * Modal toggle
     */
    const toggleModal = () => {
        setModal(!modal);
    };

    /**
     * Hide the scrollbar when modal is active
     */
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }

    return (
        <div>
            {modal && (
                <div className='modal'>
                    <div className='overlay' onClick={toggleModal}></div>
                    <div className='modal-content'>
                        <div className='space-between ai-center d-flex'>
                            <h2>Invite team member</h2>
                            <button
                                className='close-modal'
                                onClick={toggleModal}
                            >
                                <ion-icon name='close-outline'></ion-icon>
                            </button>
                        </div>

                        <form method='post' action=''>
                            <input type='email' className='email' />
                            <button className='invite'>Invite</button>
                        </form>
                    </div>
                </div>
            )}

            <main className='dashboard-deck'>
                <nav className='gap-10 ai-center space-between d-flex navigation-deck'>
                    <a
                        href='/dashboard'
                        className='gap-10 ai-center d-flex deck-back'
                    >
                        <ion-icon name='chevron-back-outline'></ion-icon>
                        <div>
                            <h1> { id } Pitch an Idea | Template</h1>
                            <span>Templates</span>
                        </div>
                    </a>

                    <div className='gap-10 d-flex'>
                        <button
                            type='button'
                            className='gap-10 ai-center d-flex avatar'
                        >
                            <span>Online</span>
                            <a
                                href='https://support.paste-replica.io'
                                target='_blank'
                            >
                                <ion-icon name='help-circle-outline'></ion-icon>
                            </a>
                        </button>

                        <button type='button' className='new-deck'>
                            Share Deck
                        </button>
                        <button type='button' className='invite-team-member'>
                            Present
                        </button>
                        <button type='button' className='more'>
                            <ion-icon name='ellipsis-horizontal-outline'></ion-icon>
                        </button>
                    </div>
                </nav>

                <Posts postId={id}/>

                {toggle === 2 && (
                    <div className='space-between d-flex drop-container'>
                        <div>
                            {' '}
                            <DropZone />
                        </div>
                        <div></div>
                    </div>
                )}
                <div className='deck-edit'>ads</div>
            </main>
        </div>
    );
};

export default Deck;