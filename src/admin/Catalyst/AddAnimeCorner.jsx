import React, { useEffect } from 'react';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { useRef } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, updateDoc, setDoc, getDocs, deleteDoc, getDoc ,orderBy ,query } from 'firebase/firestore/lite';
import { doc } from 'firebase/firestore/lite';
import { getFirestore } from 'firebase/firestore/lite';
import { useNavigate } from 'react-router-dom';



const AddAnimeCorner = () => {
    const [animes, setAnimes] = useState([]);
    const [animeIndex, setAnimeIndex] = useState('');
    const [animeName, setAnimeName] = useState('');
    const [animeImage, setAnimeImage] = useState('');
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [animeContent, setAnimeContent] = useState('');
    const [animeColor, setAnimeColor] = useState('');
    const [ animeOrder , setAnimeOrder ] = useState('');
    const [background, setBackground] = useState('#fff');
    const [isFormVisible, setIsFormVisible] = useState(false);
    // const [isUpdateButtonVisible, setIsUpdateButtonVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [animeList, setAnimeList] = useState(animes);
     const [updatedAnimeList, setUpdatedAnimeList] = useState(animes);

    const AnimeIndexRef = useRef(1);
    const db = getFirestore();
    const navigate = useNavigate();
    

    
    // const handleDragStart = (e, index) => {
    //     setDraggedItem(animeList[index]);
    //     e.dataTransfer.effectAllowed = 'move';
    //     e.dataTransfer.setData('text/html', e.target.parentNode);
    // };

    // const handleDragOver = (e, index) => {
    //     e.preventDefault();
    // };

    // const handleDragEnter = (e, index) => {
    //     e.preventDefault();
    //     //change the cursor
    //     e.target.style.cursor = 'grabbing';
    //     //set the order of the dragged item to be the same as the item it is dragged over
    //     const draggedOverItem = animeList[index];
    //     if (draggedOverItem === draggedItem) {
    //         return;
    //     }
    //     const items = animeList.filter((item) => item !== draggedItem);
    //     items.splice(index, 0, draggedItem);
    //     setAnimeList(items);
    //     console.log(items);
    
        
    // };

    // const handleDragLeave = () => {
    //     // Implement visual feedback if needed (e.g., changing the background color)
        
    // };

    // const handleDrop = (e, index) => {
    //     e.preventDefault();
    //     const updatedAnimeList = [...animeList];

    //     const draggedOverItem = updatedAnimeList[index];
    
    //     const draggedItemIndex = updatedAnimeList.findIndex(item => item.animeIndex === draggedItem.animeIndex);
    //     const draggedOverItemIndex = updatedAnimeList.findIndex(item => item.animeIndex === draggedOverItem.animeIndex);
    
    //     const temp = updatedAnimeList[draggedItemIndex];
    //     updatedAnimeList[draggedItemIndex] = updatedAnimeList[draggedOverItemIndex];
    //     updatedAnimeList[draggedOverItemIndex] = temp;
    
    //     setAnimeList(updatedAnimeList);
    
    //     const updatedItems = updatedAnimeList.map((item, index) => {
    //         return { ...item, animeOrder: index + 1 };
    //     });
    
    //     const promises = updatedItems.map(item => {
    //         const docRef = doc(collection(db, 'AnimeCorner'), `Anime${item.animeIndex}`);
    //         return updateDoc(docRef, { animeOrder: item.animeOrder });
    //     });
    
    //     Promise.all(promises).then(() => {
    //         console.log('Anime order successfully updated in the database.');
    //     }).catch(error => {
    //         console.error('Error updating anime order in the database:', error);
    //     });
    // };
    



    const handleDragStart = (e, index) => {
        setDraggedItem(animes[index]);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.target.style.cursor = 'grabbing';



    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        //change the cursor
        e.target.style.cursor = 'grabbing';
        //set the order of the dragged item to be the same as the item it is dragged over
        const draggedOverItem = animes[index];
        if (draggedOverItem === draggedItem) {
            return;
        }
        const items = animes.filter((item) => item !== draggedItem);
        items.splice(index, 0, draggedItem);
        setAnimes(items);
        console.log(items);
    
        
    };

    const handleDragLeave = () => {
        //change the background color back to normal



        
    };

    const handleDrop = (e, index) => {
        e.preventDefault();

        const updatedAnimeList = [...animes];

        const draggedOverItem = updatedAnimeList[index];
    
        const draggedItemIndex = updatedAnimeList.findIndex(item => item.animeIndex === draggedItem.animeIndex);
        const draggedOverItemIndex = updatedAnimeList.findIndex(item => item.animeIndex === draggedOverItem.animeIndex);
    
        const temp = updatedAnimeList[draggedItemIndex];
        updatedAnimeList[draggedItemIndex] = updatedAnimeList[draggedOverItemIndex];
        updatedAnimeList[draggedOverItemIndex] = temp;
    
        setAnimes(updatedAnimeList);
    
        const updatedItems = updatedAnimeList.map((item, index) => {
            return { ...item, animeOrder: index + 1 };
        });
    
        const promises = updatedItems.map(item => {
            const docRef = doc(collection(db, 'AnimeCorner'), `Anime${item.animeIndex}`);
            return updateDoc(docRef, { animeOrder: item.animeOrder });
        });
    
        Promise.all(promises).then(() => {
            console.log('Anime order successfully updated in the database.');
        }).catch(error => {
            console.error('Error updating anime order in the database:', error);
        });
    };
    

   
   
    
    

    const fetchAnimes = async () => {
        try {
            const collectionReference = collection(db, 'AnimeCorner');
            //order using the AnimeOrder field

            const orderedAnimes = query(collectionReference, orderBy('animeOrder'));
            const querySnapshot = await getDocs(orderedAnimes);
            const fetchedAnimes = querySnapshot.docs.map((doc) => {
                return doc.data();
            });


            // const querySnapshot = await getDocs(collectionReference);
            // const fetchedAnimes = querySnapshot.docs.map((doc) => {
            //     return doc.data();
            // });
            setAnimes(fetchedAnimes);
            setAnimeList(fetchedAnimes);

        } catch (error) {
            console.log('Error fetching animes', error);
        }
    };


    
    const handlePreviewClick = () => {
        navigate('/admin/catalyst/animeCornerPreview', {
            state: {
                animes: {
                    animeName: animeName,
                    animeContent: animeContent,
                    animeImage: existingImageUrl,
                }

            }
        })
    };




    useEffect(() => {
        fetchAnimes();
        setEditAnime();

    }, [selectedAnime]);




    const setEditAnime = () => {
        if (selectedAnime) {
            setAnimeIndex(selectedAnime.animeIndex);
            setAnimeName(selectedAnime.animeName);
            setExistingImageUrl(selectedAnime.animeImage);
            setAnimeContent(selectedAnime.animeContent);
            setAnimeColor(selectedAnime.animeColor);
            setBackground(selectedAnime.animeColor);
            setIsFormVisible(true);
        }
    }

    const ProgressBar = ({ progress }) => {

        return (
            <div className='w-full h-2 bg-gray-300'>
                <div className='h-full bg-green-500' style={{ width: `${progress}%` }}></div>
            </div>
        )
    }




    const storageImageInStorage = async () => {

        const AnimeIndex = AnimeIndexRef.current;
        if (animeImage) {
            try {
                const storageRef = ref(storage, 'CatalystArticleImages')
                const animeImageRef = ref(storageRef, 'AnimeCorner');

                const fileRef = ref(animeImageRef, `Anime${AnimeIndex}/AnimeImage`);


                const collectionReference = collection(db, 'AnimeCorner');
                const docReference = doc(collectionReference, `Anime${AnimeIndex}`)

                const metadata = {
                    contentType: animeImage.type,
                    createdAt: Date.now()
                }

                const uploadTask = uploadBytesResumable(fileRef, animeImage, metadata);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                        setProgress(progress);
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            updateDoc(docReference, {
                                animeImage: downloadURL
                            }).then(() => {
                                console.log('Document successfully updated with articleImage URL.');
                            }).catch((updateError) => {
                                console.error('Error updating document:', updateError);
                            });
                        }).catch((error) => {
                            console.error('Error getting download URL:', error);
                        });
                    }

                )

            } catch (error) {
                console.log('error uploading image', error);
            }
        }
    }


    const addAnime = async (e) => {
        e.preventDefault();

        //validate form
        if (!animeIndex) {
            alert('Please enter anime index');
            return;
        }
        try {
            const collectionReference = collection(db, 'AnimeCorner');
            const docReference = doc(collectionReference, `Anime${AnimeIndexRef.current}`)

            if (docReference.exists) {


                await updateDoc(docReference, {
                    animeIndex: AnimeIndexRef.current,
                    animeName: animeName,
                    animeImage: existingImageUrl,
                    animeContent: animeContent,
                    animeColor: animeColor,
                    animeOrder: animeOrder,

                });

            } else {
                await setDoc(docReference, {
                    animeIndex: AnimeIndexRef.current,
                    animeName: animeName,
                    animeImage: existingImageUrl,
                    animeContent: animeContent,
                    animeColor: animeColor,
                    animeOrder: AnimeIndexRef.current,


                });
                storageImageInStorage();

            }


            setIsFormVisible(false);
            fetchAnimes();


        } catch (error) {
            console.log('error adding anime', error);
        }


    }


    const handleAnimeIndexChange = (event) => {
        setAnimeIndex(event.target.value);
        AnimeIndexRef.current = event.target.value;

        const selectedAnime = animes.find((anime) => anime.animeIndex === event.target.value);
        // console.log(selectedAnime);

        if (selectedAnime) {
            setSelectedAnime(selectedAnime);
        } else {
            //set the fields to empty
            setSelectedAnime(null);
            setAnimeName('');
            setExistingImageUrl('');
            setAnimeContent('');
            setAnimeColor('');
            setBackground('#fff');

        }

    }


    const handleAnimeNameChange = (event) => {
        setAnimeName(event.target.value);
    }

    const handleAnimeImageChange = (event) => {
        if (event.target.files[0]) {
            setAnimeImage(event.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                setExistingImageUrl(event.target.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const handleAnimeContentChange = (event) => {
        setAnimeContent(event.target.value);
    }

    const handleColorChange = (color) => {
        setAnimeColor(color.hex);
        setBackground(color.hex);
    }


    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    }

    const editAnime = async () => {

        const selectedAnime = animes.find((anime) => anime.animeIndex === AnimeIndexRef.current);
        setSelectedAnime(selectedAnime);
        console.log(selectedAnime);



    }

    const deleteAnime = async (animeIndex) => {
        try {
            const collectionReference = collection(db, 'AnimeCorner');
            const docReference = doc(collectionReference, `Anime${animeIndex}`);

            //check if there is an image
            const docSnap = await getDoc(docReference);
            const existingImageUrl = docSnap.data().animeImage;
            if (existingImageUrl) {
                const existingImageRef = ref(storage, existingImageUrl);
                await deleteObject(existingImageRef);
                console.log('Image deleted successfully.');
            }
            
            await deleteDoc(docReference);
            console.log('Anime  deleted successfully.');
            fetchAnimes();
        } catch (error) {
            console.error('Error deleting anime and image:', error);
        }
    };


    const removeImage = async (animeIndex) => {
        try {
            const collectionReference = collection(db, 'AnimeCorner');
            const docReference = doc(collectionReference, `Anime${animeIndex}`);
            const docSnap = await getDoc(docReference);
            const existingImageUrl = docSnap.data().animeImage;
            const existingImageRef = ref(storage, existingImageUrl);
            await deleteObject(existingImageRef);
            console.log('Image deleted successfully.');

            await updateDoc(docReference, {
                animeImage: '',
            }).then(() => {
                console.log('Document successfully updated with articleImage URL.');
            }).catch((updateError) => {
                console.error('Error updating document:', updateError);
            });

            fetchAnimes();

        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };



    return (



        <div >


            <div>
            <button onClick={() => setAnimeList(animeList)}>Update Anime List</button>
            </div>
            <div
                className=''
                style={{ height: '50vh', width: '100vw', background: background }}>

                <img src={existingImageUrl}
                    alt=""
                    className='h-3/4  p-4 '
                />

                <p className=''>
                    {animeContent}
                </p>

            </div>

            <div>
                <button onClick={toggleFormVisibility}>
                    {isFormVisible ? ' Cancel' : 'Add An Anime'}

                </button>
            </div>


            {isFormVisible && (

                <div>

                    <div>
                        <label htmlFor="animeIndex">Anime Index</label>
                        <input type="number" min={1} className="form-control border-2 border-gray-500"
                            id="animeIndex" placeholder="Enter Anime Index"
                            value={
                                animeIndex
                            }
                            onChange={handleAnimeIndexChange}
                        />
                    </div>


                    <div>
                        <label htmlFor="animeName">Anime Name</label>
                        <input type="text" className="form-control border-2 border-gray-500"
                            id="animeName" placeholder="Enter Anime Name"
                            value={animeName}
                            onChange={handleAnimeNameChange} />
                    </div>


                    <div>
                        <label htmlFor="animeContent">Anime Content</label>
                        <textarea
                            className="form-control border-2 border-gray-500"
                            id="animeContent"
                            placeholder="Enter Anime Content"
                            value={animeContent}
                            onChange={handleAnimeContentChange} > </textarea>
                    </div>


                    <div >
                        <img src={existingImageUrl} alt="" className='w-20' />
                        <label htmlFor="animeImage">Anime Image
                            <input type="file"
                                style={{ display: 'none' }}

                                id="animeImage" placeholder="Enter Anime Image"

                                onChange={handleAnimeImageChange} />
                        </label>
                        <ProgressBar progress={progress} />


                    </div>

                    <ChromePicker
                        color={background}
                        onChangeComplete={handleColorChange}
                        // onChangeComplete={(color) => setBackground(color.hex)}
                        draggable={true}
                    />


                    {existingImageUrl && (
                        <button onClick={() => removeImage(
                            animeIndex,
                            animeImage
                        )}>Remove Image</button>
                    )}

                    <button className="btn btn-primary" onClick={addAnime}>Save</button>

                </div>
            ) }

            <div>

                {animes.map((anime, index) => {
                    return (


                        <div key={anime.animeIndex} 
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className='border-2 m-8 p-4  h-56 w-full'
                            style={
                                { background: anime.animeColor }

                            }>
                            <img src={anime.animeImage} alt=""  className='h-6 '/>
                            <h1>{anime.animeName}</h1>
                            <p>{anime.animeContent}</p>
                            <p>{anime.animeColor}</p>
                            <button onClick={
                                () => {
                                    editAnime(AnimeIndexRef.current = anime.animeIndex)
                                }
                            }>Edit Anime
                            </button>

                            <button className='flex'
                                onClick={
                                    () => {
                                        deleteAnime(AnimeIndexRef.current = anime.animeIndex)

                                    }
                                }

                            >
                                delete Anime
                            </button>

                        </div>
                    )
                })}






            </div>

            {/* <div>
                {animeList.map((anime, index) => (
                    <div
                        key={anime.animeIndex}
                        className='border-2 m-8 p-4'
                        style={{ background: anime.animeColor }}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                    >

                        <h1>{anime.animeName}</h1>
                       
                    </div>
                ))}

            </div> */}


            <div>
                <button onClick={handlePreviewClick}>Preview Anime Corner</button>
            </div>


        </div>





    );


}


export default AddAnimeCorner;