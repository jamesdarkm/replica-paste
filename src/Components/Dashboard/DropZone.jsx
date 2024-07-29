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
            <img src={file.preview} className="w-[200px]" alt='' />
        </div>
    ));

    return (
        <div >
            <button onClick={uploadPost}
                className="absolute z-99 right-[10px] top-[10px] px-[15px] py-[8px] text-[#fff] font-bold border-2 border-solid border-[#4f15a6] rounded-[5px] bg-[#4f15a6]"
            >
               Save
            </button>

            <div
                className='flex absolute top-[0] left-[0] z-10 w-full h-full bg-[grey] '
                style={{ padding: '20px', background: '#fff' }}
            >
                <div className='w-1/2'>
                    <div>
                    <div className="h-screen flex justify-center p-[20px]">
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
                    className='justify-center d-flex w-1/2 p-[20px] bg-[white] h-[20px]'
                >
                    <div
                        {...getRootProps({ style })}
                        className='justify-center d-flex h-screen items-center'
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