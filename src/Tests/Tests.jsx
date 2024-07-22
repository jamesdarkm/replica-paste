import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { db, storage } from '../../firebase';
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

const DropZone = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const headingRef = useRef(null);
    const copyRef = useRef(null);
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
        let lastDownloadURL = '';

        const docRef = await addDoc(collection(db, 'decks'), {
            heading: headingRef.current.value,
            title: copyRef.current.value,
            timestamp: serverTimestamp(),
        });
        
        await Promise.all(
            selectedImages.map(async (image, index) => {
                const imageRef = ref(
                    storage,
                    `decks/${docRef.id}/${image.name}`
                );
    
                try {
                    await uploadBytes(imageRef, image, 'data_url');
                    const downloadURL = await getDownloadURL(imageRef);
    
                    await updateDoc(doc(db, 'decks', docRef.id), {
                        images: arrayUnion(downloadURL),
                    });
    
                    lastDownloadURL = downloadURL;
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
    
                if (index === selectedImages.length - 1) {
                    await updateDoc(doc(db, 'decks', docRef.id), {
                        thumbnail: lastDownloadURL,
                    });
                }
            })
        );
        copyRef.current.value = '';
        setSelectedImages([]);
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
            <img src={file.preview} style={{ width: '200px' }} alt='' />
        </div>
    ));

    return (
        <>
            <input ref={headingRef} type='text' />
            <button
                type='submit'
                className='p-3 px-5 rounded justify-center rounded-md text-sm font-semibold shadow-sm font-bold text-slate-50 dark:hover:bg-violet-900 bg-violet-800'
                onClick={uploadPost}
                style={{
                    position: 'absolute',
                    zIndex: '99',
                    right: '10px',
                    top: '10px',
                }}
            >
                Save
            </button>

            <div className='p-5 flex justify-between'>
                <div className='w-2/4'>
                    <div className='editor-container'>
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

                    <p>Debug {editorData}</p>
                    <input ref={copyRef} type='hidden' value={editorData} />
                </div>

                <div
                    {...getRootProps({ style })}
                    className='p-5 w-2/4 flex justify-center'
                >
                    <div>{selected_images}</div>
                    <input {...getInputProps()} />

                    <p>
                        <ion-icon name='add-outline' size='large'></ion-icon>
                    </p>
                </div>
            </div>
        </>
    );
};

export default DropZone;