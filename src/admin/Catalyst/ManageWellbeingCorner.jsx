import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { doc, collection, setDoc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';


const ManageWellbeingCorner = () => {
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleData, setArticleData] = useState({ articleTitle: '', articleAuthor:'' , articleDescription: '', articleImage: '' });
    const [Loading, setLoading] = useState(true);
    const [articleToEdit, setArticleToEdit] = useState({ articleTitle: '', articleAuthor:'' , articleDescription: '', articleImage: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const fetchArticleData = async () => {
        try {
            const articleRef = doc(db, 'Catalyst', 'wellbeingCorner');
            const articleSnap = await getDoc(articleRef);
            if (articleSnap.exists()) {
                setArticleData(articleSnap.data());
            }
        } catch (error) {

            console.error('Error fetching article data: ', error);
            setError('Failed to fetch article data. Please try again later.');
        } finally {
            setLoading(false); // This is to ensure that the loading spinner is closed even if there is an error
        }
    };

    useEffect(() => {
        fetchArticleData();
    }, []);

    const handleEdit = () => {
        setArticleToEdit(articleData);
        setIsModalOpen(true);
    }

    const handleImageUpload = async (e) => {
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

        const docReference = doc(db, 'Catalyst', 'wellbeingCorner');

        try {
            if (articleToEdit.articleTitle &&  articleToEdit.articleAuthor && articleToEdit.articleDescription) {
                let oldImageURL = null; // Initialize oldImageURL

                // Check if there was a previous image and set oldImageURL accordingly
                if (articleData) {
                    oldImageURL = articleData.articleImage;
                }

                let imageURL = oldImageURL;

                if (articleToEdit.articleImage instanceof File) {
                    const storageRef = ref(storage, `CatalystArticleImages/wellbeingCorner/${articleToEdit.articleTitle}-${Date.now()}`);
                    await uploadBytes(storageRef, articleToEdit.articleImage);
                    imageURL = await getDownloadURL(storageRef);
                }

                const newArticleData = {
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

                await setDoc(docReference, newArticleData, { merge: true });

                setIsModalOpen(false);
                setArticleToEdit({ articleTitle: '', articleAuthor:'' , articleDescription: '', articleImage: '' });
                setError('');
            } else {
                setError('Fields cannot be empty. Please fill in all the details.');
            }
        } catch (error) {
            console.error('Error updating document: ', error);
            setError('Failed to save article. Please try again later.');
        } finally {
            setIsSaving(false);
            fetchArticleData();
        }
    };




    const handleConfirmDeletePopup = () => {
        setShowConfirmDeleteModal(true);
    }

    const handleDelete = async () => {
        // Deleting the image from storage
        const currentImageURL = articleData.articleImage;
        if (currentImageURL && currentImageURL !== 'This is the image URL') {
            const oldImageRef = ref(storage, currentImageURL);
            await deleteObject(oldImageRef);
            console.log('Current image deleted successfully.');
        }

        // Update the document with the new article data
        const docReference = doc(db, 'Catalyst', 'wellbeingCorner');
        const updatedData = {
                articleTitle: 'Title',
                articleAuthor: 'Author',
                articleDescription: 'This is the Article Description and by clicking on the edit button you can edit the article description and save it.',
                articleImage: 'This is the image URL',
                timestamp: serverTimestamp(),
            
        };

        await updateDoc(docReference, updatedData);

        fetchArticleData();
        setShowConfirmDeleteModal(false);
    }


    return (
        <div>
            {Loading == false ? (
                <div className="flex flex-wrap">
                    <div className="p-2">
                        <div className="rounded-md p-4">
                            <div className="flex justify-between">
                                <h2 className="text-3xl mb-3">{articleData.articleTitle}</h2>
                                <div className="flex">
                                    <i
                                        className="fa fa-trash text-red-500 hover:text-red-700 cursor-pointer absolute top-15 right-12"
                                        onClick={() => handleConfirmDeletePopup()}
                                    ></i>
                                    <i
                                        className="fa fa-edit text-gray-500 hover:text-gray-700 cursor-pointer absolute top-15 right-4"
                                        onClick={() => handleEdit()}
                                    ></i>
                                </div>
                            </div>
                            <h3 className=" text-xl italic mb-10">
                                   by {articleData.articleAuthor}
                            </h3>
                            <img src={articleData.articleImage} alt="WellBeing Corner Image" className="w-full h-96 object-cover mt-4" />
                            <p className="text-gray-700 text-base w-[1350px] mt-14" style={{ whiteSpace: 'pre-line' }}>{articleData.articleDescription}</p>

                        </div>
                    </div>

                </div>
            ) : (
                <div className="rounded overflow-hidden mb-6 h-96">
                    <p className='text-3xl'>Loading...</p>
                </div>
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
                                        placeholder="Enter author name"
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

        </div>
    );
}

export default ManageWellbeingCorner;