import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { db, storage } from '../../../firebase';
import {
    addDoc,
    collection,
    serverTimestamp,
    updateDoc,
    doc,
    arrayUnion,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from '@firebase/storage';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { v4 as uuidv4 } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';

const DropZone = ({ isOpen, onClose, id, deckCount, changeUploadState }) => {
    if (!isOpen) return null;
    const uniqueId = uuidv4();

    const [selectedImages, setSelectedImages] = useState([]);
    const [imageNumber, setimageNumber] = useState('');

    const captionRef = useRef(null);
    const [editorData, setEditorData] = useState('');

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
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
        if (!captionRef.current.value && selectedImages.length === 0) {
            // console.log('duh');
            onClose();
            return;
        }

        let lastDownloadURL = '';

        // Reference to the specific document in decksSubCollection
        // const deckSubDocRef = doc(db, 'decks', uid, 'decksSubCollection', id);
        const deckSubDocRef = doc(db, 'decks', id);

        // Update the deckSubDocRef document with caption
        await updateDoc(deckSubDocRef, {
            [`decks.${uniqueId}.caption`]: captionRef.current.value,
        });

        // Handle uploading images and updating the document
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
                await updateDoc(deckSubDocRef, {
                    [`decks.${uniqueId}.images`]: arrayUnion(downloadURL),
                });

                lastDownloadURL = downloadURL;

                // Update the thumbnail with the last uploaded image's download URL
                if (index === selectedImages.length - 1) {
                    await updateDoc(deckSubDocRef, {
                        [`decks.${uniqueId}.thumbnail`]: lastDownloadURL,
                    });
                }
            })
        );

        captionRef.current.value = '';
        setSelectedImages([]);
        changeUploadState();
        onClose();
    };

    const onDrop = useCallback((acceptedFiles) => {
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
            prevImages.filter((image) => image.uniqueId !== id)
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
    const selected_images = selectedImages?.map((file, index) => (
        <div
            key={file.uniqueId}
            className={`bg-cover bg-center bg-blue-500 w-full ${
                index > 3 ? 'hidden' : ''
            }`}
            style={{
                backgroundImage: `url(${file.preview})`,
            }}
            data-index={index}
        >
            <div
                className={`w-full bg-stone-950 opacity-70 flex flex justify-center items-center ${
                    index > 2 ? '' : 'hidden'
                }`}
            >
                <button
                    type='button'
                    onClick={() => removeImage(file.uniqueId)}
                >
                    <ion-icon
                        name='search-outline'
                        style={{ color: 'white', fontSize: '50px' }}
                    ></ion-icon>{' '}
                    <span className='text-white font-bold text-2xl'>
                        {' '}
                        {index + 1}+
                    </span>
                </button>
            </div>
            <button
                type='button'
                className={`mt-4 ml-4 p-4 text-white font-bold rounded-full bg-red-500 ${
                    index > 2 ? 'hidden' : ''
                }`}
                onClick={() => removeImage(file.uniqueId)}
            >
                <ion-icon
                    style={{ fontSize: '20px' }}
                    name='trash-outline'
                ></ion-icon>
            </button>
        </div>
    ));

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [color, setColor] = useState('#ffffff'); // default color is white
    const [textColor, setTextColor] = useState('#000000');
    
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
        const newColor = e.target.value;
        setColor(newColor);

        const luminance = calculateLuminance(newColor);
        if (luminance < 128) {
            // Dark color: log "dark" and set text color to white
            console.log('dark');
            setTextColor('#ffffff');
        } else {
            // Light color: log "light" and set text color to black
            console.log('light');
            setTextColor('#000000');
        }
    };

    const [menuOpen, setMenuOpen] = useState(null);
    return (
        <div className="p-4 w-full h-screen" style={{ backgroundColor: color }}>
            <div className='flex justify-end'>
                <button className='p-2' onClick={onClose}>
                    <ion-icon
                        style={{ fontSize: '30px' }}
                        name='close-outline'
                    ></ion-icon>
                </button>
            </div>
            <div className='flex'>
                <div className='w-1/2'>
                    <div className='flex justify-center p-4 text-white text-[#ffffff]'>
                        <CKEditor
                            editor={InlineEditor}
                            data={editorData}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                                console.log({ event, editor, data });
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
                    <input ref={captionRef} type='hidden' value={editorData} />
                </div>
                <div className='p-4 fle flex flex-wrap w-1/2'>
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
                                {selectedImages.map((file, index) => (
                                    <SwiperSlide key={index}>
                                        <div
                                            key={file.uniqueId}
                                            className={`bg-cover bg-center bg-blue-500 w-full ${
                                                index > 3 ? 'hidden' : ''
                                            }`}
                                            style={{
                                                backgroundImage: `url(${file.preview})`,
                                            }}
                                            data-index={index}
                                        >
                                            <button
                                                type='button'
                                                className='mt-4 ml-4 p-4 text-white font-bold rounded-full bg-red-500'
                                                onClick={() =>
                                                    removeImage(file.uniqueId)
                                                }
                                            >
                                                <ion-icon
                                                    style={{ fontSize: '20px' }}
                                                    name='trash-outline'
                                                ></ion-icon>
                                            </button>
                                        </div>

                                        <img
                                            src={file.preview}
                                            alt={`Slide ${index + 1}`}
                                            className='object-cover'
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <Swiper
                                onSwiper={setThumbsSwiper}
                                modules={[Thumbs]}
                                spaceBetween={10}
                                slidesPerView={3}
                                freeMode
                                watchSlidesProgress
                                style={{ marginTop: '10px', height: '30vh' }} // Adjust height as needed
                            >
                                {selectedImages.map((file, index) => (
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
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}

            <div className='flex justify-between'>
                <div></div>
                <div className='flex gap-8'>
                    <button {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                        <img src='/src/Components/Assets/image upload.svg' />
                    </button>
                    <button>
                    <button
                    className='absolute top-2 right-2'
                    onClick={() => setMenuOpen(true)}
                >
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </button>
                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className='absolute top-10 right-2 bg-white shadow-md rounded'>
                        <button className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Delete</button>
                    </div>
                )}
                        <img src='/src/Components/Assets/slide-orientation.svg' />
                    </button>

                    <label className='relative'>
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
                <div className='flex gap-8'>
                    <button
                        className='font-bold text-slate-50 rounded border-solid border-2 border-violet-700 hover:border-violet-900 px-3 py-2 hover:bg-violet-900 bg-violet-800'
                        onClick={uploadPost}
                    >
                        Done
                    </button>

                    <div className='flex items-center gap-2'>
                        <button className='p-3'>
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
                        <button className='p-3'>
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
    );
};

export default DropZone;
