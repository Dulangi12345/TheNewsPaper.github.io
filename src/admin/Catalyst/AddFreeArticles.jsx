import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { db } from '../../firebase';
import { doc, collection, setDoc, getDoc, updateDoc, getDocs } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';



const AddFreeArticles = () => {

    const [FreeArticleIndex, setFreeArticleIndex] = useState(1);
    const [FreeArticleTitle, setFreeArticleTitle] = useState('');
    const [FreeArticleContent, setFreeArticleContent] = useState('');
    const [FreeArticleImage1, setFreeArticleImage1] = useState('');
    const [FreeArticleImage2, setFreeArticleImage2] = useState('');
    const [FreeArticleImage3, setFreeArticleImage3] = useState('');
    const [progressforImage1, setProgressforImage1] = useState(0);
    const [progressforImage2, setProgressforImage2] = useState(0);
    const [progressforImage3, setProgressforImage3] = useState(0);
    const [existingImage1Url, setExistingImage1Url] = useState('');
    const [existingImage2Url, setExistingImage2Url] = useState('');
    const [existingImage3Url, setExistingImage3Url] = useState('');
    const [selectedFile1Name, setSelectedFile1Name] = useState('');
    const [selectedFile2Name, setSelectedFile2Name] = useState('');
    const [selectedFile3Name, setSelectedFile3Name] = useState('');

    const [isFilePicked, setIsFilePicked] = useState(false);
    const FreeArticleIndexRef = useRef(1);
    const navigate = useNavigate();



    const ProgressBar = ({ progress }) => {

        return (
            <div className='w-full h-2 bg-gray-300'>
                <div className='h-full bg-green-500' style={{ width: `${progress}%` }}></div>
            </div>
        )
    }

    const handleOnSubmit = async (e) => {

        e.preventDefault();
        try {
            const collectionReference = collection(db, 'CatalystFreeArticles');
            const documentReference = doc(collectionReference, 'Freearticle' + FreeArticleIndex);
            await setDoc(documentReference, {
                index: FreeArticleIndex,
                title: FreeArticleTitle,
                content: FreeArticleContent,
                image1: existingImage1Url,
                image2: existingImage2Url,
                image3: existingImage3Url
            });

            await storeImage1InStorage();
            await storeImage2InStorage();
            await storeImage3InStorage();
            //display alert

        } catch (error) {
            console.log('Error adding document: ', error);
        }

    }


    // const fetchTitlecontentAndImages = async () => {

    //     try {
    //         const collectionReference = collection(db, 'CatalystFreeArticles');

    //         //fetch data based on the article index
    //         const articles = {
    //             1: 'Freearticle1',
    //             2: 'Freearticle2',
    //             3: 'Freearticle3'
    //         };

    //         const documentReference = doc(collectionReference, articles[FreeArticleIndexRef.current]);
    //         const documentSnapshot = await getDoc(documentReference);
    //         const data = documentSnapshot.data() || {};

    //         setFreeArticleTitle(data.title || '');
    //         setFreeArticleContent(data.content || '');
    //         setExistingImage1Url(data.image1 || '');
    //         setExistingImage2Url(data.image2 || '');
    //         setExistingImage3Url(data.image3 || '');



    //     } catch (error) {
    //         console.log('Error getting document: ', error);
    //     }


    // }


    const fetchTitlecontentAndImages = async () => {
        try {
            const collectionReference = collection(db, 'CatalystFreeArticles');

            // Assuming you have the FreeArticleIndexRef properly initialized
            const FreeArticleIndex = FreeArticleIndexRef.current;

            // Get the document ID based on FreeArticleIndex
            const querySnapshot = await getDocs(collectionReference);
            let articleId = '';

            querySnapshot.forEach((doc) => {
                if (doc.data().index === FreeArticleIndex) {
                    articleId = doc.id;
                }
            });

            if (articleId) {
                const documentReference = doc(collectionReference, articleId);
                const documentSnapshot = await getDoc(documentReference);
                const data = documentSnapshot.data() || {};

                setFreeArticleTitle(data.title || '');
                setFreeArticleContent(data.content || '');
                setExistingImage1Url(data.image1 || '');
                setExistingImage2Url(data.image2 || '');
                setExistingImage3Url(data.image3 || '');
            } else {
                setFreeArticleTitle('');
                setFreeArticleContent('');
                setExistingImage1Url(null);
                setExistingImage2Url(null);
                setExistingImage3Url(null);
            }

        } catch (error) {
            console.log('Error getting document: ', error);
        }
    };



    const handlePreviewClick = () => {
        navigate('/admin/catalyst/freearticlepreview', {
            state: {
                title: FreeArticleTitle,
                content: FreeArticleContent,
                image1: existingImage1Url,
                image2: existingImage2Url,
                image3: existingImage3Url
            }
        })
    };



    useEffect(() => {

        fetchTitlecontentAndImages();
    }, [FreeArticleIndex]);




    //image 1

    const storeImage1InStorage = async () => {
        // if (isFilePicked === false && existingImage1Url === null) {
        //     FreeArticleImage1 = ''
        // }

        // else {
        const FreeArticleIndex = FreeArticleIndexRef.current;

        if (FreeArticleImage1) {

            //if there is a new article image delete the old image

            try {
                const storageRef = ref(storage);
                const catalystArticleImagesRef = ref(storageRef, 'CatalystArticleImages');
                const freeArticlesRef = ref(catalystArticleImagesRef, `FreeArticle ${FreeArticleIndex}`);
                // const fileRef = ref(freeArticlesRef, `FreeArticle1Image1`);
                const fileRef = ref(freeArticlesRef, `FreeArticle${FreeArticleIndexRef.current}Image1`);


                const collectionReference = collection(db, 'CatalystFreeArticles');
                const documentReference = doc(collectionReference, 'Freearticle' + FreeArticleIndex);


                const metadata = {
                    contentType: FreeArticleImage1.type,
                    createdAt: Date.now(),
                };
                const uploadTask = uploadBytesResumable(fileRef, FreeArticleImage1, metadata);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        setProgressforImage1(progress);

                    },
                    (error) => {
                        console.error('Error during upload:', error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            updateDoc(documentReference, {
                                image1: downloadURL,
                            }).then(() => {
                                console.log('Document successfully updated with articleImage URL.');
                            }).catch((updateError) => {
                                console.error('Error updating document:', updateError);
                            });
                        }).catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                    }
                );


            } catch (error) {
                console.error('Error getting storage ref: ', error);
            }

            // }
        }


    };










    // image 2


    const storeImage2InStorage = async () => {

        // if (isFilePicked === false && existingImage2Url === null) {
        //     FreeArticleImage2 = ''
        // }

        // else {


        const FreeArticleIndex = FreeArticleIndexRef.current;
        //if there is an article image delete the old image

        if (FreeArticleImage2) {
            try {
                const storageRef = ref(storage);
                const catalystArticleImagesRef = ref(storageRef, 'CatalystArticleImages');
                const freeArticlesRef = ref(catalystArticleImagesRef, `FreeArticle ${FreeArticleIndex}`);
                const fileRef = ref(freeArticlesRef, `FreeArticle1Image2`);


                const collectionReference = collection(db, 'CatalystFreeArticles');
                const documentReference = doc(collectionReference, 'Freearticle' + FreeArticleIndex);


                const metadata = {
                    contentType: FreeArticleImage2.type,
                    createdAt: Date.now(),
                };
                const uploadTask = uploadBytesResumable(fileRef, FreeArticleImage2, metadata);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');

                        setProgressforImage2(progress);


                    },
                    (error) => {
                        console.error('Error during upload:', error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            updateDoc(documentReference, {
                                image2: downloadURL,
                            }).then(() => {
                                console.log('Document successfully updated with articleImage URL.');
                            }).catch((updateError) => {
                                console.error('Error updating document:', updateError);
                            });
                        }).catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                    }
                );


            } catch (error) {
                console.error('Error getting storage ref: ', error);
            }

            // }
        }
    };


    //image 3
    const storeImage3InStorage = async () => {


        // if (isFilePicked === false && existingImage3Url === null) {
        //     FreeArticleImage3 = ''
        // }


        // else {


        const FreeArticleIndex = FreeArticleIndexRef.current;

        if (FreeArticleImage3) {

            //if there is an article image delete the old image
            try {
                const storageRef = ref(storage);
                const catalystArticleImagesRef = ref(storageRef, 'CatalystArticleImages');
                const freeArticlesRef = ref(catalystArticleImagesRef, `FreeArticle ${FreeArticleIndex}`);
                const fileRef = ref(freeArticlesRef, `FreeArticle1Image3`);


                const collectionReference = collection(db, 'CatalystFreeArticles');
                const documentReference = doc(collectionReference, 'Freearticle' + FreeArticleIndex);


                const metadata = {
                    contentType: FreeArticleImage3.type,
                    createdAt: Date.now(),
                };
                const uploadTask = uploadBytesResumable(fileRef, FreeArticleImage3, metadata);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        setProgressforImage3(progress);

                    },
                    (error) => {
                        console.error('Error during upload:', error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            updateDoc(documentReference, {
                                image3: downloadURL,
                            }).then(() => {
                                console.log('Document successfully updated with articleImage URL.');
                            }).catch((updateError) => {
                                console.error('Error updating document:', updateError);
                            });
                        }).catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                    }

                );



            } catch (error) {
                console.error('Error getting storage ref: ', error);
            }

            // }

        }



    }




    const handleFreeArticleIndexChange = (e) => {
        FreeArticleIndexRef.current = e.target.value; // Update the ref value

        setFreeArticleIndex(e.target.value);
    }

    const handleFreeArticleTitleChange = (e) => {
        setFreeArticleTitle(e.target.value);
    }

    const handleFreeArticleContentChange = (e) => {
        setFreeArticleContent(e.target.value);
    }

    const handleFreeArticleImage1Change = (e) => {
        if (e.target.files[0]) {
            setFreeArticleImage1(e.target.files[0]);
            setSelectedFile1Name(e.target.files[0].name);
            setIsFilePicked(true);

            //display the chosen image
            const reader = new FileReader();
            reader.onload = (event) => {
                setExistingImage1Url(event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);

        }
    }

    const handleFreeArticleImage2Change = (e) => {
        if (e.target.files[0]) {
            setFreeArticleImage2(e.target.files[0]);
            setSelectedFile2Name(e.target.files[0].name);
            setIsFilePicked(true);

            //display the chosen image
            const reader = new FileReader();
            reader.onload = (event) => {
                setExistingImage2Url(event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);

        }
    }

    const handleFreeArticleImage3Change = (e) => {
        if (e.target.files[0]) {
            setFreeArticleImage3(e.target.files[0]);
            setSelectedFile3Name(e.target.files[0].name);
            setIsFilePicked(true);

            //display the chosen image
            const reader = new FileReader();
            reader.onload = (event) => {
                setExistingImage3Url(event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);

        }

    }

    return (
        <div>
            <form action="">

                <div>
                    {/* <select name="" id=""

                        onChange={
                            handleFreeArticleIndexChange

                        }>
                        <option value="1">Article 1</option>
                        <option value="2">Article 2</option>
                        <option value="3">Article 3</option>
                    </select> */}


                    <label htmlFor="">Article Number</label>
                    <input type="number" value={FreeArticleIndex} onChange={handleFreeArticleIndexChange} className='border-2 border-black' min={1} />

                </div>

                <div>
                    <label htmlFor="">Article Title</label>
                    <input type="text" value={
                        FreeArticleTitle
                    } onChange={handleFreeArticleTitleChange} className='border-2 border-black' />
                </div>

                <div>
                    <label htmlFor="">Article Content</label>
                    <textarea name="" id="" cols="30" rows="10" value={FreeArticleContent} onChange={handleFreeArticleContentChange} className='border-2 border-black'></textarea>
                </div>

                <hr />


                <div className='mt-8'>
                    <h5>Article image 1</h5>

                    <label htmlFor="articleImage1">
                        <div>
                            Click here to upload
                        </div>

                        <div>
                            <img src=
                                {existingImage1Url}
                                alt="" />
                        </div>

                        <input type="file" name="articleImage1"
                            id="articleImage1"
                            onChange={handleFreeArticleImage1Change}
                            style={{ display: 'none' }} />
                    </label>


                    <p>{selectedFile1Name}</p>

                    <div>
                        {progressforImage1 > 0 && <ProgressBar progress={progressforImage1} />}
                    </div>


                </div>

                <hr />




                <div className='mt-8 '>
                    <h5> Article Image 2</h5>

                    <label htmlFor="articleImage2">

                        <div>
                            Click here to upload
                        </div>

                        <div>
                            <img src=
                                {existingImage2Url}
                                alt="" />
                        </div>

                        <input type="file" name="articleImage2" id="articleImage2" style={{ display: 'none' }}
                            onChange={handleFreeArticleImage2Change} />
                    </label>

                    <p>{selectedFile2Name}</p>
                    <div>
                        {progressforImage2 > 0 && <ProgressBar progress={progressforImage2} />}
                    </div>




                </div>

                <hr />

                <div className='mt-8'>
                    <h5>Article Image 3</h5>

                    <label htmlFor="articleImage3">
                        <div>
                            Click here to upload
                        </div>
                        <div>
                            <img src=
                                {existingImage3Url}
                                alt="" />
                        </div>

                        <input type="file" name="articleImage3"
                            id="articleImage3"
                            onChange={handleFreeArticleImage3Change}
                            style={{ display: 'none' }} />
                    </label>
                    <p>{selectedFile3Name}</p>
                    <div>
                        {progressforImage3 > 0 && <ProgressBar progress={progressforImage3} />}
                    </div>

                </div>

                <hr />


                {/* View preview*/}
                <div>
                    <button
                        type="button"
                        onClick={handlePreviewClick}
                    >Preview Article</button>
                </div>



                <div>
                    <button type="submit" onClick={handleOnSubmit}>Add</button>
                </div>

            </form>
        </div>

    )



}

export default AddFreeArticles;