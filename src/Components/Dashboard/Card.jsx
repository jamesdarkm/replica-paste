import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { db, storage } from '../../../firebase';
import { doc, addDoc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import Comments from '../Comments/Comments';


export default function Card() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { caption, thumbnail } = location.state.card;
    const { cardId } = location.state;
    console.log(id, location.state.card)

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const getDeck = async () => {
            const docRef = doc(db, 'decks', deckId);
            const docSnap = await getDoc(docRef);
        }

    }, [])
    return (
        <>
            <div className='flex-1'>
                <div className='w-full flex items-center justify-between z-10 '>
                    <div className='p-4 px-6 items-center w-full justify-between flex'>
                        <div className='flex items-center justify-center'>
                            <div onClick={goBack}>
                                <ion-icon
                                    style={{ fontSize: '20px' }}
                                    name='chevron-back-outline'
                                ></ion-icon>
                            </div>

                            <div className='pl-4'>
                                <h1 className=' text-3xl font-bold'
                                    dangerouslySetInnerHTML={{
                                        __html: caption,
                                    }}
                                >
                                    
                                </h1>
                                <span>Group</span>
                            </div>
                        </div>

                        <div>
                            <div className='justify-between flex content-end'>
                                <div className='ml-4 '>
                                    <button className='flex content-end'>
                                        <div className='mt-3 mr-5'>Online</div>
                                    </button>
                                </div>
                                <div>
                                    <Link
                                        to='/'
                                        className='ml-10 flex items-center justify-center w-10 h-10 rounded-full border-solid border-2 border-slate-200 rounded-full font-bold hover:bg-slate-200'
                                    >
                                        <ion-icon
                                            size='small'
                                            name='help-outline'
                                        ></ion-icon>
                                    </Link>
                                </div>

                                <button
                                    type='button'
                                    className='ml-6 font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 hover:bg-violet-900 bg-violet-800'
                                >
                                    Share deck
                                </button>

                                <button
                                    type='button'
                                    className='ml-4 font-bold rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 text-violet-700 hover:text-gray-50 hover:bg-violet-900 '
                                >
                                    Present
                                </button>

                                <button className='ml-4'>
                                    <ion-icon
                                        name='ellipsis-horizontal-outline'
                                        size='small'
                                    ></ion-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="h-[100vh]">
                <div className="h-[70%]">
                  <img src={thumbnail} alt="" className="banner w-full h-full object-cover" />
                </div>

                <Comments deckId={id} cardId={cardId}/>
            </div>

        </>
    )
}
