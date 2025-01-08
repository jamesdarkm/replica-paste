import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { db, storage } from '../../../firebase';
import {
    addDoc,
    collection,
    serverTimestamp,
    updateDoc,
    doc,
    arrayUnion,
    getDoc
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from '@firebase/storage';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';

/* Icons */
import ImageUploadIcon from '../Icons/ImageUploadIcon'
import SlideOrientationIntroIcon from '../Icons/SlideOrientationIntroIcon'
import SlideOrientationIcon from '../Icons/SlideOrientationIcon'

const DropZone = ({ isOpen, onClose, id, deckCount, changeUploadState, deckID, decks, cardIndex, setCardIndex, }) => {
    if (!isOpen) return null;

    /**
     * deckID = card ID
     * cardIndex = index of the cards in the array
     */
    console.log(decks)
    console.log('IDX: ' + deckID.length)
    const uniqueId = uuidv4();
    // let { card, cardIndex } = cardDetails;
    // // console.log(card, cardIndex)
    console.log(cardIndex)
    // const deckId = decks[cardIndex][0];


    let deckArrayId = '';
    let deckCaptionArray = '';
    let deckCaption = ''
    let deckImage = ''

    if (deckID != '') {
        console.log('heeeeeeeeee')
        deckArrayId = decks[cardIndex][0];
        deckCaptionArray = decks[cardIndex][1];
        deckCaption = deckCaptionArray.caption;
       // deckImage = deckCaptionArray.images[0] // uncomment
    }
    console.log(cardIndex, deckCaptionArray.caption)

    const [selectedImages, setSelectedImages] = useState(deckCaptionArray.images);
    const [imageNumber, setimageNumber] = useState('');

    const captionRef = useRef(null);
    const [editorData, setEditorData] = useState(deckCaption);
    // console.log(card && card.images)
    // console.log(deckCaptionArray.caption)
    // console.log(card)
    console.log(selectedImages)
    const moveToNextCard = () => {
        setCardIndex((prevIndex) => (prevIndex + 1) % decks.length)
    }

    const moveToPrevCard = () => {
        setCardIndex((cardIndex - 1 + decks.length) % decks.length)
    }

    /**
     * 
     * @returns 
     */
    useEffect(() => {
        const fetchData = async () => {
            if (deckID) {
                const mainDocRef = doc(db, 'decks', id);

                try {
                    // Fetch the document
                    const docSnap = await getDoc(mainDocRef);

                    if (docSnap.exists()) {
                        // Access the data in the document
                        const data = docSnap.data();

                        // console.log(data);
                        // Uncomment and set your state here
                        // setDecks(data.decks);
                        // setHeading(data.heading);
                        // setDeckCount(Object.keys(data.decks).length);
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }
        };

        fetchData(); // Call the async function

    }, [deckID, id]); // Include `id` in the dependency array if it can change

    const baseStyle = {
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out',
    };

    const focusedStyle = {
        borderColor: '#2196f3',
    };

    const acceptStyle = {
        borderColor: '#00e676',
    };

    const rejectStyle = {
        borderColor: '#ff1744',
    };


    const uploadPost = async () => {
        // if (!editorData && deckCaptionArray.images.length === 0) {

        /**
         * Close if caption is empty or there's no images selected
         */
        // if (!editorData && deckCaptionArray.images.length === 0) {
        if (!editorData) {
            onClose();
            return;
        }

        let lastDownloadURL = '';

        // a4ede940-eff1-4d5d-9231-08a8e9314f11

        // Reference to the specific document in decksSubCollection
        // const deckSubDocRef = doc(db, 'decks', uid, 'decksSubCollection', id);
        const deckSubDocRef = doc(db, 'decks', id);

        /**
         * Updates a the document with caption data 
         * based on the presence of `deckID`. If 
         * empty, `uniqueId` is used instead.
         */
        if (deckID != '') {
            await updateDoc(deckSubDocRef, {
                [`decks.${deckArrayId}.caption`]: editorData,
            });
        } else {
            await updateDoc(deckSubDocRef, {
                [`decks.${uniqueId}.caption`]: editorData,
            });
        }

        console.log('Deck caption array')
console.log(deckCaptionArray)
console.log('sselected images')
console.log(selectedImages)
        // Handle uploading images and updating the document
        if (deckCaptionArray && selectedImages) {
            await Promise.all(
                selectedImages.map(async (image, index) => {
                    // Use a unique identifier for the image upload path
                    const imageRef = ref(
                        storage,
                        `decks/${deckSubDocRef.id}/images/${image.name}`
                    );

                    await uploadBytes(imageRef, image, 'data_url');
                    const downloadURL = await getDownloadURL(imageRef);

                    // Update the document with the new image URL
                    if (deckID != '') {
                        await updateDoc(deckSubDocRef, {
                            [`decks.${deckArrayId}.images`]: arrayUnion(downloadURL),
                        });
                    } else {
                        await updateDoc(deckSubDocRef, {
                            [`decks.${uniqueId}.images`]: arrayUnion(downloadURL),
                        });
                    }


                    lastDownloadURL = downloadURL;
                    console.log('heerrre')
                    console.log(lastDownloadURL)
                    // Update the thumbnail with the last uploaded image's download URL
                    if (index === selectedImages.length - 1) {
                        if (deckID != '') {
                            await updateDoc(deckSubDocRef, {
                                [`decks.${deckArrayId}.thumbnail`]: lastDownloadURL,
                            });
                        } else {
                            await updateDoc(deckSubDocRef, {
                                [`decks.${uniqueId}.thumbnail`]: lastDownloadURL,
                            });
                        }
                    }
                })
            );
        } else {
            console.log('12345')
        }

        setEditorData('')
        setSelectedImages([]);
        changeUploadState();
        onClose();
    };

    const onDrop = useCallback((acceptedFiles) => {
        // console.log(acceptedFiles)
        setimageNumber(acceptedFiles.length);

        setSelectedImages(
            acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    uniqueId: uuidv4(),
                    count: imageNumber,
                })
            )
        );
    }, []);

    const removeImage = (id) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((image) => !image.includes(id))
        );
    };

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );
    // const selected_images = deckCaptionArray.images?.map((file, index) => (
    //     <div
    //         key={file.uniqueId}
    //         className={`bg-cover bg-center bg-blue-500 w-full ${index > 3 ? 'hidden' : ''
    //             }`}
    //         style={{
    //             backgroundImage: `url(${file.preview})`,
    //         }}
    //         data-index={index}
    //     >
    //         <div
    //             className={`w-full bg-stone-950 opacity-70 flex flex justify-center items-center ${index > 2 ? '' : 'hidden'
    //                 }`}
    //         >
    //             <button
    //                 type='button'
    //                 onClick={() => removeImage(file.uniqueId)}
    //             >
    //                 <ion-icon
    //                     name='search-outline'
    //                     style={{ color: 'white', fontSize: '50px' }}
    //                 ></ion-icon>{' '}
    //                 <span className='text-white font-bold text-2xl'>
    //                     {' '}
    //                     {index + 1}+
    //                 </span>
    //             </button>
    //         </div>
    //         <button
    //             type='button'
    //             className={`mt-4 ml-4 p-4 text-white font-bold rounded-full bg-red-500 ${index > 2 ? 'hidden' : ''
    //                 }`}
    //             onClick={() => removeImage(file.uniqueId)}
    //         >
    //             <ion-icon
    //                 style={{ fontSize: '20px' }}
    //                 name='trash-outline'
    //             ></ion-icon>
    //         </button>
    //     </div>
    // ));

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [color, setColor] = useState('#ffffff'); // default color is white
    const [textColor, setTextColor] = useState('dark');

    const calculateLuminance = (hex) => {
        const rgb = parseInt(hex.substring(1), 16); // Convert hex to RGB
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = (rgb >> 0) & 255;

        // Calculate luminance using the formula
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        return luminance;
    };

    // Function to handle color change
    const handleColorChange = (e) => {
        const newColour = e.target.value;
        setColor(newColour);
        // setLayout('color');

        const luminance = calculateLuminance(newColour);
        if (luminance < 128) {
            // Dark color: log "dark" and set text color to white
            console.log('dark');
            setTextColor('dark');
        } else {
            // Light color: log "light" and set text color to black
            console.log('light');
            setTextColor('light');
        }
    };

    const [menuOpen, setMenuOpen] = useState(null);

    const [layout, setLayout] = useState('left');

    const layoutIntro = {
        background: `url(${deckImage}) rgba(000, 000, 000, 0.5)`,
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }

    return (
        <>

            <div className={` justify-center flex-col overflow-y-auto relative z-20 p-4 w-full h-screen bg-black ${layout}`} style={{
                height: 'calc(100vh)',
                ...(layout === 'left' || layout === 'right' || layout === 'top' || layout === 'bottom'
                    ? { backgroundColor: color }
                    : layoutIntro),
            }}>
                <div className='fixed top-0 right-0 flex justify-end'>
                    <button className='p-2' onClick={onClose}>
                        <ion-icon
                            style={{ fontSize: '30px' }}
                            name='close-outline'
                        ></ion-icon>
                    </button>
                </div>
                
                <div className={`mx-auto max-w-[1184px] overflow-y-auto ${layout === 'top' ? 'flex flex-col' : layout === 'bottom' ? '' : 'flex items-center'}`}>
                    <div className={`${layout === 'right' ? 'w-1/2 order-2' : layout === 'left' ? 'w-1/2 order-1' : layout === 'bottom' ? 'w-full flex-1 order-1' : layout === 'top' ? 'w-full flex-1 order-2' : 'w-full order-1'}`} style={{ maxHeight: 'calc(100% - 162px)' }}>
                        <div className='flex justify-center p-4 text-white border-2 border-solid'>
                            <CKEditor
                                editor={InlineEditor}
                                data={deckCaptionArray.caption}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditorData(data);
                                    // console.log(data)
                                    // console.log({ event, editor, data });
                                }}
                                config={{
                                    toolbar: [
                                        'heading',
                                        'bold',
                                        'italic',
                                        'underline',
                                        'link',
                                        'bulletedList',
                                    ],
                                    heading: {
                                        options: [
                                            {
                                                model: 'paragraph',
                                                view: 'p',
                                                title: 'Paragraph',
                                                class: 'ck-heading_paragraph',
                                            },
                                            {
                                                model: 'heading1',
                                                view: 'h1',
                                                title: 'Title',
                                                class: 'ck-heading_heading1',
                                            },
                                        ],
                                    },
                                }}
                            />
                        </div>
                        <input ref={captionRef} type='hidden' value={deckCaptionArray.caption} />
                    </div>
                    <div className={`p-4 flex flex-wrap ${layout === 'right' ? 'w-1/2 order-1' : layout === 'left' ? 'w-1/2 order-2' : layout === 'top' ? 'w-full flex-1 order-1 border-solid border-red-500' : layout === 'bottom' ? 'w-full flex-1 order-2' : layout === 'top' ? 'w-full flex-1 order-2' : 'hidden'}`}>
                        <div
                            className='justify-center p-4 w-full items-center border-2 border-solid'
                        >
                            <div className='w-full basis-1/2'>
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    style={{ width: '100%' }}
                                >
                                    {selectedImages && selectedImages.map((file, index) => {
                                        const isObject = typeof file === 'object';
                                        const imageSrc = isObject ? file.preview : file;

                                        return (
                                            <SwiperSlide key={index}>
                                                <button
                                                    type='button'
                                                    className='absolute mt-4 ml-4 p-4 text-white font-bold rounded-full bg-red-500'
                                                    onClick={() => removeImage(isObject ? file.uniqueId : file)}
                                                >
                                                    <ion-icon style={{ fontSize: '20px' }} name='trash-outline'></ion-icon>
                                                </button>
                                                <img
                                                    src={imageSrc}
                                                    alt={`Slide ${index + 1}`}
                                                    className='object-cover'
                                                    style={{ width: '100%', height: '100%' }}
                                                    referrerPolicy='no-referrer'
                                                />
                                            </SwiperSlide>
                                        );
                                    })}

                                </Swiper>

                                {/* <Swiper
                                    onSwiper={setThumbsSwiper}
                                    modules={[Thumbs]}
                                    spaceBetween={10}
                                    slidesPerView={3}
                                    freeMode
                                    watchSlidesProgress
                                    style={{ marginTop: '10px', height: '30vh' }} // Adjust height as needed
                                >
                                    {deckCaptionArray.images.map((file, index) => (
                                        <SwiperSlide
                                            key={index}
                                            className='group relative'
                                        >
                                            <>
                                                <img
                                                    src={file.preview}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className='object-cover'
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                                <button
                                                    type='button'
                                                    className='fixed left-[10px] top-[10px] z-99 p-4 text-white font-bold rounded-full bg-red-500 hidden group-hover:block'
                                                    onClick={() =>
                                                        removeImage(file.uniqueId)
                                                    }
                                                >
                                                    <ion-icon
                                                        style={{ fontSize: '20px' }}
                                                        name='trash-outline'
                                                    ></ion-icon>
                                                </button>
                                            </>
                                        </SwiperSlide>
                                    ))}
                                </Swiper> */}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Dropdown Menu */}

                <div className='py-[11px] flex justify-between bg-white bg-opacity-30 fixed bottom-0 left-0 right-0 z-10'>
                    <div></div>
                    <div className='flex gap-8 rounded px-3'>
                        <button {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <ImageUploadIcon className='w-12' />
                        </button>
                        <button className='relative z-10'
                            onClick={() => {
                                setMenuOpen(!menuOpen);
                            }}
                        >
                            {menuOpen && (
                                <div className='absolute bottom-14 -left-[50px] py-2 bg-white shadow-md rounded min-w-36'>
                                    <button className='flex border-b-2 border-solid border-slate-100 items-center gap-3 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => {
                                        setLayout('intro');
                                    }}>
                                        <SlideOrientationIntroIcon className='w-12' />
                                        <strong>Intro</strong>
                                    </button>
                                    <button className='flex border-b-2 border-solid border-slate-100 items-center gap-3 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => {
                                        setLayout('right');
                                    }}>
                                        <SlideOrientationIcon className='w-12' />
                                        <strong>Right</strong>
                                    </button>
                                    <button className='flex border-b-2 border-solid border-slate-100 items-center gap-3 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => {
                                        setLayout('left');
                                    }}>
                                        <SlideOrientationIcon className='w-12 rotate-[-180deg]' />
                                        <strong>Left</strong>
                                    </button>
                                    <button className='flex border-b-2 border-solid border-slate-100 items-center gap-3 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => {
                                        setLayout('bottom');
                                    }}>
                                        <SlideOrientationIcon className='w-12 rotate-[-90deg]' />
                                        <strong>Top</strong>
                                    </button>
                                    <button className='flex border-b-2 border-solid border-slate-100 items-center gap-3 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={() => {
                                        setLayout('top');
                                    }}>
                                        <SlideOrientationIcon className='w-12 rotate-90' />
                                        <strong>Bottom</strong>
                                    </button>
                                </div>
                            )}
                            <SlideOrientationIcon className='w-12 ml-[-10px] mb-[-4px]' />
                        </button>

                        <label className='relative flex flex-col justify-center'>
                            <input
                                type='color'
                                className='relative opacity-0 absolute top-0 left-0'
                                value={color}
                                onChange={handleColorChange} // update color on change
                            />

                            <svg
                                width='22'
                                height='32'
                                viewBox='0 0 22 32'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                className='relative -top-3'
                            >
                                <path
                                    d='M10.9918 1.11363L19.538 14.9366C20.4988 16.6079 21 18.5006 21 20.436C21 26.3075 16.4667 31 11 31C5.53332 31 1 26.3075 1 20.435C1 18.501 1.50023 16.6113 2.4414 14.9708L10.9918 1.11363Z'
                                    fill='#ffffff'
                                    stroke='#676B5F'
                                    strokeWidth='2'
                                />
                            </svg>
                        </label>
                    </div>
                    <div className='flex gap-8 rounded px-3'>
                        <button type='button' className='px-8 py-4 rounded-full font-bold text-white bg-black hover:bg-[#171717]' onClick={uploadPost}>Done</button>

                        <div className='flex items-center gap-2'>
                            <button className='p-3' onClick={moveToNextCard}>
                                <svg
                                    width='10'
                                    height='18'
                                    viewBox='0 0 10 18'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M9 1L1 9L9 17'
                                        stroke='black'
                                        stroke-width='2'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                    />
                                </svg>
                            </button>
                            <div>{deckCount}</div>
                            <button className='p-3' onClick={moveToPrevCard}>
                                <svg
                                    width='10'
                                    height='18'
                                    viewBox='0 0 10 18'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M1 17L9 9L1 0.999999'
                                        stroke='black'
                                        stroke-width='2'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default DropZone;
