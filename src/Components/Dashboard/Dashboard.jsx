import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import './Modal.css'

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);



    /**
     * Test data
     */
    useEffect(() => {
        fetch('./src/Components/Dashboard/test-data.json')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);



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
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }



    return (
        <div className="d-flex">
            {modal && (
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">
                        <div className="space-between ai-center d-flex">
                            <h2>Invite team member</h2>
                            <button className="close-modal" onClick={toggleModal}><ion-icon name="close-outline"></ion-icon></button>
                        </div>

                        <form method="post" action="">
                            <input type="email" className="email" />
                            <button className="invite">Invite</button>
                        </form>
                    </div>
                </div>
            )}
            

            <div className="aside">
                <div className="gap-10 ai-center d-flex user">
                    <span>N</span>
                    <span>ND's Team</span>
                </div>
                <ul>
                    <li><a href="" className="gap-10 ai-center d-flex"><ion-icon name="brush-outline"></ion-icon> <span>Brand theme</span></a></li>
                    <li><a href="javascript:void()" className="gap-10 ai-center d-flex" onClick={toggleModal}><ion-icon name="person-outline"></ion-icon> <span>Invite members</span></a></li>
                    <li><a href="" className="gap-10 ai-center d-flex"><ion-icon name="flash-outline"></ion-icon> <span>Upgrade to Pro</span></a></li>
                </ul>
            </div>

            <main className="dashboard">
                <nav className="gap-10 ai-center jc-end d-flex navigation">
                    <button type="button" className="gap-10 ai-center d-flex avatar">
                        <span>Online</span>
                        <a href="https://support.paste-replica.io" target="_blank"><ion-icon name="help-circle-outline"></ion-icon></a>
                    </button>

                    <button type="button" className="invite-team-member" onClick={toggleModal}>Invite team member</button>
                    <button type="button" className="new-deck">New deck</button>
                </nav>

                <div className="card-preview-container">
                    <a href="/dashboard/deck" className="card-preview card-add">
                        <div>
                            <ion-icon name="add-outline"></ion-icon>
                        </div>
                        <p>Empty Deck</p>
                    </a>

                    {data.map((item, index) => (
                        <a href="/dashboard/deck" className="card-preview" key={index}>
                            <div>
                                <img src={`./src/Components/Assets/${item.image}`}/>
                            </div>
                            <p>{item.name}</p>
                            <span>{item.group}</span>
                        </a>
                    ))}
                </div>

            </main>
           
        </div>
    )
}


export default Dashboard