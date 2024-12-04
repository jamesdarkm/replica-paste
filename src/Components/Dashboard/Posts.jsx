import React from 'react';
import Comments from '../Comments/Comments';
import { useParams, useNavigate } from 'react-router-dom';

/* CSS */
import './Posts.css';

/* Firebase */
import { db } from "../../../firebase";
import { doc, updateDoc, deleteField } from "firebase/firestore";

const Posts = ({ hasDecks, decks, toggleDropZonePopup, uid, id, setDeckID, setDecks }) => {
    const navigate = useNavigate();
    const { id: deckId } = useParams();

    const viewCard = (item, cardId) => {
        console.log(item, hasDecks, cardId);
        navigate(`/dashboard/deck/card/${deckId}`, { state: { card: item, cardId } });
    };



    /**
     * Delete card & update the local decks state
     */
    const deleteCard = async (cardId) => {
        const docRef = doc(db, "decks", deckId);

        await updateDoc(docRef, {
            [`decks.${cardId}`]: deleteField(),
        });

        const updatedDecks = decks.filter(([key]) => key !== cardId);
        setDecks(updatedDecks);
    };

    return (
        <>
            <Comments />

            <div className='mx-auto w-full deck-preview'>
                <div className='grid grid-cols-3'>
                    {hasDecks
                        ? decks.map(([id, item], index, array) => {
                            const thumbnail = item.thumbnail;
                            const deckId = array[index][0];
                            const thumb = array[index][1];

                            // console.log(item)
                            // console.log(array);

                            return (
                                <div
                                    key={id}
                                    className='relative min-h-96 flex items-center border border-slate-200 hover:border-slate-400 border-solid'
                                    onClick={(e) => {
                                        setDeckID(id);
                                        // toggleDropZonePopup(item, array);
                                        toggleDropZonePopup(index);
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCard(id);
                                        }}
                                        className="absolute z-99 right-[10px] top-[10px] p-5 text-white font-bold rounded-full bg-red-500"
                                    >
                                        <ion-icon
                                            style={{ fontSize: "30px" }}
                                            name="trash-outline"
                                        ></ion-icon>
                                    </button>
                                    <div
                                        className={`p-6 w-1/2 text-2xl ${!item.thumbnail && 'mx-auto'
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
                                            className={`w-1/2 h-full bg-center bg-cover bg-[url(${thumbnail})]`}
                                        // style={{
                                        //     backgroundImage: `url(${item.thumbnail})`,
                                        // }}
                                        ></div>
                                    )}
                                </div>
                            )
                        })
                        : ''}

                    <button type='button' onClick={() => toggleDropZonePopup(null)}>
                        <div className='min-h-96 flex justify-center items-center min-h-48 border border-solid border-slate-200 hover:border-slate-300'>
                            NEW
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
