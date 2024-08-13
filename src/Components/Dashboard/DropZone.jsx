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

const DropZone = ({ isOpen, onClose, id, uid, changeUploadState }) => {
    if (!isOpen) return null;
    const uniqueId = uuidv4();

    const [selectedImages, setSelectedImages] = useState([]);
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
        const deckSubDocRef = doc(db, 'decks', uid, 'decksSubCollection', id);

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
        setSelectedImages(
            acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
        );
    }, []);

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
    const selected_images = selectedImages?.map((file) => (
        <div>
            <img src={file.preview} className='w-[200px]' alt='' />
        </div>
    ));

    return (
        <div className='p-4 w-full h-screen'>
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
                                    'numberedList',
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
                <div className='p-4 flex w-1/2 '>
                    <div
                        {...getRootProps({ style })}
                        className='justify-center p-4 d-flex items-center'
                    >
                        <div>{selected_images}</div>
                        <input {...getInputProps()} />

                        <p>
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
