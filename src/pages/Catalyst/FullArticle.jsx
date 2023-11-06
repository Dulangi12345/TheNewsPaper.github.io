import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore/lite'; // Update the import for getDoc
import { db } from '../../firebase';

const FullArticle = () => {
    const [error, setError] = useState('');
    const { articlePage, articleIndex } = useParams();
    const [articleData, setArticleData] = useState({ articleTitle: '', articleDescription: '', articleImage: '' });
    const [loading, setLoading] = useState(true);
    const [articlePageDBName, setArticlePageDBName] = useState('');

    useEffect(() => {
        if (articlePage === 'current-events') {
            setArticlePageDBName('currentEvents');
        } else if (articlePage === 'arts-and-culture') {
            setArticlePageDBName('artsAndCulture');
        } else if (articlePage === 'science-and-technology') {
            setArticlePageDBName('scienceAndTech');
        } else if (articlePage === 'travel-and-lifestyle') {
            setArticlePageDBName('travelAndLifestyle');
        } else {
            setArticlePageDBName('');
        }
    }, [articlePage]); // Add articlePage as a dependency

    useEffect(() => {
        if (articlePageDBName !== '') {
            fetchArticleData();
        }
    }, [articlePageDBName]); // Add articlePageDBName as a dependency

    const fetchArticleData = async () => {
        try {
            const docRef = doc(db, 'Catalyst', articlePageDBName);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setArticleData(data); // Updated to set the entire data object
                console.log('Document data:', data);
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching article data: ', error);
            setError('Failed to fetch article data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='mx-32 mt-10'>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <p className='text-3xl'>Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap">
                        {error && (
                            <div className="flex items-center justify-center">
                                <p className='text-3xl'>{error}</p>
                            </div>
                        )}
                        <div className="p-2">
                            <div className="rounded-md p-4">
                                <div className="flex justify-between">
                                    <h2 className="text-3xl mb-3">{articleData[articleIndex].articleTitle}</h2>
                                </div>
                                <img src={articleData[articleIndex].articleImage} alt="Homepage Image" className="w-full h-96 object-cover mt-4" />
                                <p className="text-gray-700 mt-14" style={{ whiteSpace: 'pre-line' }}>{articleData[articleIndex].articleDescription}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullArticle;
