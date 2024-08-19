import React, { useState, useRef } from 'react';
import CommentsTest from '../CommentsTest/CommentsTest';
import { useParams, useNavigate } from 'react-router-dom';
import './Posts.css';

const Posts = ({ decks = {}, toggleDropZonePopup, uid, id }) => {
    const navigate = useNavigate();
    const { id: deckId } = useParams();
    const hasDecks = Object.keys(decks).length !== 0;

    const viewCard = (item, cardId) => {
        console.log(item, decks, cardId)
        navigate(`/dashboard/deck/card/${deckId}`, { state: { card: item, cardId } })
    }

    return (
        <>
            <div className='mx-auto w-full deck-preview'>
                <div className='grid grid-cols-3'>
                    {hasDecks
                        ? Object.entries(decks).map(([id, item]) => (
                              <div
                                  key={id}
                                  onClick={() => viewCard(item, id)}
                                  className='min-h-96 flex items-center border border-slate-200 hover:border-slate-400 border-solid'
                              >
                                  <div
                                      className={`p-6 w-1/2 text-2xl ${
                                          !item.thumbnail && 'mx-auto'
                                      }`}
                                  >
                                      <div
                                          dangerouslySetInnerHTML={{
                                              __html: item.caption,
                                          }}
                                      />
                                  </div>

                                  {item.thumbnail && (
                                      <div
                                          className='w-1/2 h-full bg-center bg-cover'
                                          style={{
                                              backgroundImage: `url(${item.thumbnail})`,
                                          }}
                                      ></div>
                                  )}
                              </div>
                          ))
                        : ''}

                    <button type='button' onClick={toggleDropZonePopup}>
                        <div className='min-h-96 flex justify-center items-center min-h-48 border border-solid border-slate-200 hover:border-slate-300'>
                            <ion-icon
                                size='large'
                                name='add-outline'
                            ></ion-icon>
                        </div>
                    </button>
                </div>
            </div>

            <CommentsTest id={deckId}/>
        </>
    );
};

export default Posts;