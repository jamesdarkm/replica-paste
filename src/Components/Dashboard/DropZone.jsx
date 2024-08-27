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

const DropZone = ({ isOpen, onClose, id, uid, changeUploadState }) => {
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
            className={`bg-cover bg-center bg-blue-500 h-full w-full ${
                index > 3 ? 'hidden' : ''
            }`}
            style={{
                backgroundImage: `url(${file.preview})`,
            }}
            data-index={index}
        >
            <div
                className={`w-full h-full bg-stone-950 opacity-70 flex flex justify-center items-center ${
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

    return (
        <div className='p-4 w-full h-screen'>
            <div></div>
            <div className='h-full flex'>
                <button
                    onClick={uploadPost}
                    className='absolute z-99 right-[10px] top-[10px] p-5 text-white font-bold rounded-full bg-violet-700'
                >
                    <ion-icon
                        style={{ fontSize: '30px' }}
                        name='close-outline'
                        // onClick={changeUploadState}
                    ></ion-icon>
                </button>
                <div className='w-1/2 h-full'>
                    <div className='flex justify-center p-4 h-full'>
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
                        {...getRootProps({ style })}
                        className='justify-center p-4 w-full items-center'
                    >
                        <div className='w-full h-full basis-1/2'>
                            <Swiper
                                modules={[Navigation, Thumbs]}
                                spaceBetween={10}
                                slidesPerView={1}
                                thumbs={{ swiper: thumbsSwiper }}
                                style={{ width: '100%', height: '60vh' }}
                            >
                                {selectedImages.map((file, index) => (
                                    <SwiperSlide key={index}>
                                        <div
                                            key={file.uniqueId}
                                            className={`bg-cover bg-center bg-blue-500 h-full w-full ${
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
                                    <SwiperSlide key={index} className="group relative">
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
                        <input {...getInputProps()} />

                        <p className='fixed'>
                            <ion-icon
                                name='add-outline'
                                size='large'
                            ></ion-icon>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropZone;