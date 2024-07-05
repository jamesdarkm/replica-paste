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

const DropZone = () => {
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
        const docRef = await addDoc(collection(db, 'posts'), {
            caption: captionRef.current.value,
            timestamp: serverTimestamp(),
        });

        await Promise.all(
            selectedImages.map((image) => {
                const imageRef = ref(
                    storage,
                    `posts/${docRef.id}/${image.path}`
                );
                uploadBytes(imageRef, image, 'data_url').then(async () => {
                    const downloadURL = await getDownloadURL(imageRef);
                    await updateDoc(doc(db, 'posts', docRef.id), {
                        images: arrayUnion(downloadURL),
                    });
                });
            })
        );
        captionRef.current.value = '';
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
        <div>
            <button onClick={uploadPost}
                style={{
                    position: 'absolute',
                    zIndex: '99',
                    right: '10px',
                    top: '10px',
                    background: 'grey',
                    padding: '8px 15px',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: '2px solid #4f15a6',
                    borderRadius: '5px',
                    background: '#4f15a6'
                }}
            >
               Save
            </button>

            <div
                className='space-between d-flex drop-container'
                style={{ padding: '20px', background: '#fff' }}
            >
                <div>
                    <div>
                    <div className="editor-container">
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
                                    'heading', 'bold', 'italic', 'underline', 'link', 'bulletedList', 'numberedList'
                                ],
                                heading: {
                                    options: [
                                        { model: 'paragraph', view: 'p', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                        { model: 'heading1', view: 'h1', title: 'Title', class: 'ck-heading_heading1' }
                                    ]
                                }
                            }}
                        />
                         </div>
                        <p>Debug {editorData}</p>
                   
                    </div>
                    <input
                        ref={captionRef}
                        type='hidden'
                        value={editorData}
                    />
                    
                </div>

                <div
                    style={{ padding: '20px', background: '#fff' }}
                    className='jc-center d-flex'
                >
                    <div
                        {...getRootProps({ style })}
                        className='jc-center d-flex'
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