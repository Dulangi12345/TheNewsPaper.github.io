import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { doc, collection, setDoc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';

const truncateString = (str, num) => {
    if (str) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }
};

const ManageArtsAndCulture = () => {
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ArticlesData, setArticlesData] = useState([
        { articleTitle: '', articleAuthor:'' ,  articleDescription: '', articleImage: '' },
    ]);
    const [articleToEdit, setArticleToEdit] = useState({ articleTitle: '', articleAuthor:'' , articleDescription: '', articleImage: '', index: null });
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    const firstArticleIndex = 0;
    const secondArticleIndex = 1;
    const thirdArticleIndex = 2;
    const fourthArticleIndex = 3;
    const fifthArticleIndex = 4;
    const sixthArticleIndex = 5;
    const seventhArticleIndex = 6;
    const eighthArticleIndex = 7;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const docRef = doc(db, 'Catalyst', 'artsAndCulture');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Assuming data is an object with numbered keys representing the articles
                const articlesArray = Object.keys(data).map((key) => data[key]);
                // Set the state using the fetched data
                setArticlesData(articlesArray);
                console.log('Document data:', articlesArray);
            } else {
                // doc.data() will be undefined in this case
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
            // Handle error here
        }
    };



    const handleEdit = (articleIndex) => {
        setIsModalOpen(true);
        const articleToEditData = ArticlesData[articleIndex];
        setArticleToEdit({
            ...articleToEditData,
            index: articleIndex,
        });
    };



    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.includes('image')) {
            setArticleToEdit({ ...articleToEdit, articleImage: file });
        } else {
            console.error('Please select a valid image file.');
        }
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsSaving(true);

        const docReference = doc(db, 'Catalyst', 'artsAndCulture');

        try {
            if (
                articleToEdit.index !== null &&
                articleToEdit.articleTitle &&
                articleToEdit.articleAuthor &&
                articleToEdit.articleDescription &&
                articleToEdit.articleImage
            ) {
                let oldImageURL = null; // Initialize oldImageURL

                // Check if there was a previous image and set oldImageURL accordingly
                if (ArticlesData[articleToEdit.index]) {
                    oldImageURL = ArticlesData[articleToEdit.index].articleImage;
                }

                // Upload the image to the storage location only if it's a new image
                let imageURL = oldImageURL;
                if (articleToEdit.articleImage instanceof File) {
                    const storageRef = ref(storage, `CatalystArticleImages/artsAndCulture/${articleToEdit.articleTitle}-${Date.now()}`);
                    await uploadBytes(storageRef, articleToEdit.articleImage);
                    imageURL = await getDownloadURL(storageRef);
                }

                const newArticleData = {
                    articleIndex: articleToEdit.index,
                    articleTitle: articleToEdit.articleTitle,
                    articleAuthor: articleToEdit.articleAuthor,
                    articleDescription: articleToEdit.articleDescription,
                    articleImage: imageURL,
                    timestamp: serverTimestamp(),
                };

                if (oldImageURL && oldImageURL !== imageURL) {
                    const oldImageRef = ref(storage, oldImageURL);
                    // Delete the old image only if it exists
                    try {
                        await deleteObject(oldImageRef);
                        console.log('Old image deleted successfully.');
                    } catch (error) {
                        console.log('Old image does not exist in storage.');
                    }
                }


                // Update or set the document with the new article data
                if (articleToEdit.index !== null && articleToEdit.index < ArticlesData.length) {
                    const updatedData = {
                        [articleToEdit.index]: newArticleData,
                    };
                    await updateDoc(docReference, updatedData);
                } else if (articleToEdit.index !== null && articleToEdit.index >= ArticlesData.length) {
                    const updatedData = {
                        [ArticlesData.length]: newArticleData,
                    };
                    await setDoc(docReference, updatedData);
                } else {
                    console.error('The specified index does not exist in the ArticlesData array.');
                }

                setIsModalOpen(false);
                setError('');
                setArticleToEdit({ articleTitle: '', articleAuthor:'' , articleDescription: '', articleImage: '', index: null });
            } else {
                setError('Fields cannot be empty. Please fill in all the details.');
            }
            setIsSaving(false);
            fetchData();
        } catch (error) {
            console.error('Error updating document: ', error);
            setIsSaving(false);
            setError('')
        }
    };

    const handleConfirmDeletePopup = (articleIndex) => {
        setShowConfirmDeleteModal(true);
        setArticleToDelete(articleIndex);
    };


    const handleDelete = async () => {
        // Deleting the image from storage
        const currentImageURL = ArticlesData[articleToDelete].articleImage;
        if (currentImageURL && currentImageURL !== 'This is the image URL') {
            const oldImageRef = ref(storage, currentImageURL);
            await deleteObject(oldImageRef);
            console.log('Current image deleted successfully.');
        }

        // Update the document with the new article data
        const docReference = doc(db, 'Catalyst', 'artsAndCulture');
        const updatedData = {
            [articleToDelete]: {
                articleTitle: 'Title',
                articleAuthor: 'Author',
                articleDescription: 'This is the Article Description and by clicking on the edit button you can edit the article description and save it.',
                articleImage: 'This is the image URL',
                timestamp: serverTimestamp(),
            },
        };

        await updateDoc(docReference, updatedData);

        fetchData();
        setShowConfirmDeleteModal(false);
    };



    return (

        <Container>
            {firstArticleIndex >= 0 && secondArticleIndex >= 0 && secondArticleIndex < ArticlesData.length ? (
                <Row>
                    <Col md={8}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 flex items-center">
                                <div>
                                    <div className="font-bold text-xl mb-2">{ArticlesData[firstArticleIndex].articleTitle}</div>
                                    <h1 className='font-bold  mb-2'>by {ArticlesData[firstArticleIndex].articleAuthor}</h1>


                                    <p className="text-gray-700 text-base" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[firstArticleIndex].articleDescription, 600)}
                                    </p>
                                </div>
                                <img
                                    className="md:w-80 h-52 ml-4 object-cover"
                                    src={ArticlesData[firstArticleIndex].articleImage}
                                    alt="Current Event"
                                />
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(firstArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(firstArticleIndex)}
                                ></i>
                            </div>
                            <div className="border border-gray-400 mt-16"></div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 items-center">
                                <div>
                                    <div className="font-bold text-xl mb-2">{ArticlesData[secondArticleIndex].articleTitle}</div>
                                    <h1 className='font-bold  mb-2'>by {ArticlesData[secondArticleIndex].articleAuthor}</h1>

                                    <p className="text-gray-700 text-base" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[secondArticleIndex].articleDescription, 300)}
                                    </p>
                                </div>
                                <img
                                    className="md:w-96 w-full h-56 object-cover mt-4"
                                    src={ArticlesData[secondArticleIndex].articleImage}
                                    alt="Current Event"
                                />
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(secondArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(secondArticleIndex)}
                                ></i>
                            </div>
                        </div>

                    </Col>
                </Row>
            ) : (
                <Col>
                    <div className="rounded overflow-hidden mb-6 h-96">
                        <p className='text-3xl'>Loading...</p>
                    </div>
                </Col>
            )}

            {thirdArticleIndex >= 0 && fourthArticleIndex >= 0 && fourthArticleIndex < ArticlesData.length ? (
                <Row>
                    <Col md={8}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 flex items-center">
                                <div>
                                    <div className="font-bold text-xl mb-2">{ArticlesData[thirdArticleIndex].articleTitle}</div>
                                    <h1 className='font-bold  mb-2'>by {ArticlesData[thirdArticleIndex].articleAuthor}</h1>

                                    <p className="text-gray-700 text-base" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[thirdArticleIndex].articleDescription, 600)}
                                    </p>
                                </div>
                                <img
                                    className="md:w-80 h-52 ml-4 object-cover"
                                    src={ArticlesData[thirdArticleIndex].articleImage}
                                    alt="Current Event"
                                />
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(thirdArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(thirdArticleIndex)}
                                ></i>
                            </div>
                            <div className="border border-gray-400 mt-16"></div>
                        </div>

                    </Col>

                    <Col md={4}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 items-center">
                                <div>
                                    <div className="font-bold text-xl mb-2">{ArticlesData[fourthArticleIndex].articleTitle}</div>
                                    <h1 className='font-bold  mb-2'>by {ArticlesData[fourthArticleIndex].articleAuthor}</h1>

                                    <p className="text-gray-700 text-base" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[fourthArticleIndex].articleDescription, 300)}
                                    </p>
                                </div>
                                <img
                                    className="md:w-96 w-full h-56 object-cover mt-4"
                                    src={ArticlesData[fourthArticleIndex].articleImage}
                                    alt="Current Event"
                                />
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(fourthArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(fourthArticleIndex)}
                                ></i>
                            </div>
                        </div>

                    </Col>
                </Row>
            ) : (
                <Col>
                    <div className="rounded overflow-hidden mb-6 h-96">
                        <p className='text-3xl'>Loading...</p>
                    </div>
                </Col>
            )}

            {fifthArticleIndex >= 0 && sixthArticleIndex >= 0 && sixthArticleIndex < ArticlesData.length ? (
                <Row>
                    <Col md={8}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 flex items-center">
                                <div>
                                    <div className="font-bold text-xl mb-2">{ArticlesData[fifthArticleIndex].articleTitle}</div>
                                    <h1 className='font-bold  mb-2'>by {ArticlesData[fifthArticleIndex].articleAuthor}</h1>

                                    <p className="text-gray-700 text-base" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[fifthArticleIndex].articleDescription, 600)}
                                    </p>
                                </div>
                                <img
                                    className="md:w-80 h-52 ml-4 object-cover"
                                    src={ArticlesData[fifthArticleIndex].articleImage}
                                    alt="Current Event"
                                />
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(fifthArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(fifthArticleIndex)}
                                ></i>
                            </div>
                            <div className="border border-gray-400 mt-16"></div>
                        </div>

                    </Col>

                    <Col md={4}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 items-center">
                                <div>
                                    <div className="font-bold text-xl mb-2">{ArticlesData[sixthArticleIndex].articleTitle}</div>
                                    <h1 className='font-bold  mb-2'>by {ArticlesData[sixthArticleIndex].articleAuthor}</h1>

                                    <p className="text-gray-700 text-base" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[sixthArticleIndex].articleDescription, 300)}
                                    </p>
                                </div>
                                <img
                                    className="md:w-96 w-full h-56 object-cover mt-4"
                                    src={ArticlesData[sixthArticleIndex].articleImage}
                                    alt="Current Event"
                                />
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(sixthArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(sixthArticleIndex)}
                                ></i>
                            </div>
                        </div>

                    </Col>
                </Row>
            ) : (
                <Col>
                    <div className="rounded overflow-hidden mb-6 h-96">
                        <p className='text-3xl'>Loading...</p>
                    </div>
                </Col>
            )}

            {seventhArticleIndex >= 0 && eighthArticleIndex >= 0 && eighthArticleIndex < ArticlesData.length ? (
                <Row className='mt-12'>
                    <Col md={6}>
                        <div className="rounded overflow-hidden mb-6 border-r-2 pr-4">
                            <div className="px-6 py-4 items-center">

                                <div className="font-bold text-xl mb-2">{ArticlesData[seventhArticleIndex].articleTitle}</div>
                                <h1 className='font-bold  mb-2'>by {ArticlesData[seventhArticleIndex].articleAuthor}</h1>

                                <div className='flex'>
                                    <img
                                        className="md:w-72 h-64 object-cover"
                                        src={ArticlesData[seventhArticleIndex].articleImage}
                                        alt="Current Event"
                                    />
                                    <p className="text-gray-700 text-base ml-4" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[seventhArticleIndex].articleDescription, 400)}
                                    </p>
                                </div>

                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 mr-2 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(seventhArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 mr-2 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(seventhArticleIndex)}
                                ></i>
                            </div>
                        </div>

                    </Col>

                    <Col md={6}>
                        <div className="rounded overflow-hidden mb-6">
                            <div className="px-6 py-4 items-center">

                                <div className="font-bold text-xl mb-2">{ArticlesData[eighthArticleIndex].articleTitle}</div>
                                <h1 className='font-bold  mb-2'>by {ArticlesData[eighthArticleIndex].articleAuthor}</h1>

                                <div className='flex'>
                                    <img
                                        className="md:w-72 h-64 object-cover"
                                        src={ArticlesData[eighthArticleIndex].articleImage}
                                        alt="Current Event"
                                    />
                                    <p className="text-gray-700 text-base ml-4" style={{ whiteSpace: 'pre-line' }}>
                                        {truncateString(ArticlesData[eighthArticleIndex].articleDescription, 400)}
                                    </p>
                                </div>
                                <i
                                    className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-0 right-12"
                                    onClick={() => handleConfirmDeletePopup(eighthArticleIndex)}
                                ></i>
                                <i
                                    className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-0 right-4"
                                    onClick={() => handleEdit(eighthArticleIndex)}
                                ></i>
                            </div>
                        </div>

                    </Col>
                </Row>
            ) : (
                <Col>
                    <div className="rounded overflow-hidden mb-6 h-96">
                        <p className='text-3xl'>Loading...</p>
                    </div>
                </Col>
            )}

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
                    <div className="fixed inset-0 bg-gray-500 opacity-75" aria-hidden="true"></div>
                    <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">Add Article</h3>
                            <p className='my-2 text-red-500'>{error}</p>
                            <form onSubmit={handleFormSubmit} className="mt-2">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={articleToEdit.articleTitle}
                                        onChange={(e) => setArticleToEdit({ ...articleToEdit, articleTitle: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter title"
                                        required
                                        style={{ width: "100%" }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        value={articleToEdit.articleAuthor}
                                        onChange={(e) => setArticleToEdit({ ...articleToEdit, articleAuthor: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter author"
                                        required
                                        style={{ width: "100%" }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={articleToEdit.articleDescription}
                                        onChange={(e) => setArticleToEdit({ ...articleToEdit, articleDescription: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Enter description"
                                        required
                                        style={{ width: "100%", height: "100px" }}
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                                        Image Upload
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        style={{ width: "100%" }}
                                    />
                                </div>

                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <div className="flex items-center">
                                                <span className="mr-2 text-white">Saving...</span>
                                                <div className="animate-spin h-4 w-3.5 border-t-2 border-b-2 border-white rounded-full"></div>
                                            </div>

                                        ) : (
                                            'Save Article'
                                        )}
                                    </button>
                                    <button>
                                    <span className="ml-4" onClick={() => { setIsModalOpen(false); setError(""); }}>
                                            Cancel
                                        </span>
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {showConfirmDeleteModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Delete Confirmation
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Are you sure you want to delete this article?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={() => handleDelete()} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Delete
                            </button>
                            <button onClick={() => setShowConfirmDeleteModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </Container>
    );
};

export default ManageArtsAndCulture;
