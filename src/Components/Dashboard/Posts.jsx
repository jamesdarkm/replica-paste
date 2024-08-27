import React, { useState } from 'react';
import CommentsTest from '../CommentsTest/CommentsTest';
import { useParams, useNavigate } from 'react-router-dom';
import './Posts.css';
import { db } from "../../../firebase";
import { doc, updateDoc, deleteField } from "firebase/firestore";

const Posts = ({ decks = {}, toggleDropZonePopup, uid, id }) => {
    const navigate = useNavigate();
    const { id: deckId } = useParams();
    const hasDecks = Object.keys(decks).length !== 0;

    const viewCard = (item, cardId) => {
        console.log(item, decks, cardId);
        navigate(`/dashboard/deck/card/${deckId}`, { state: { card: item, cardId } });
    };

    const deleteCard = async (cardId) => {
        const docRef = doc(db, "decks", deckId);
      
        await updateDoc(docRef, {
          [`decks.${cardId}`]: deleteField(),
        });
    };

    return (
        <>
            <div className='mx-auto w-full deck-preview'>
                <div className='grid grid-cols-3'>
                    {hasDecks
                        ? Object.entries(decks).map(([id, item]) => (
                              <div
                                  key={id}
                                  className='relative min-h-96 flex items-center border border-slate-200 hover:border-slate-400 border-solid'
                              >
                                <button
                                    onClick={() => deleteCard(id)}
                                    className="absolute z-99 right-[10px] top-[10px] p-5 text-white font-bold rounded-full bg-red-500"
                                >
                                    <ion-icon
                                        style={{ fontSize: "30px" }}
                                        name="trash-outline"
                                    ></ion-icon>
                                </button>
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
        </>
    );
};

export default Posts;
