import React, { useState, useEffect } from 'react';
import { doc, collection, getDoc } from 'firebase/firestore/lite';
import { db } from '../../firebase';
import Footer from '../../layout/footer';


const CatalystHomepage = () => {
    const [articleData, setArticleData] = useState({ articleTitle: '', articleDescription: '', articleImage: '' });
    const [Loading, setLoading] = useState(true);

    const fetchArticleData = async () => {
        try {
            const articleRef = doc(db, 'Catalyst', 'homepage');
            const articleSnap = await getDoc(articleRef);
            if (articleSnap.exists()) {
                setArticleData(articleSnap.data());
            }
        } catch (error) {

            console.error('Error fetching article data: ', error);
            setError('Failed to fetch article data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleData();
    }, []);


    return (
        <div>
            <div className='mx-32 mt-10'>
                {Loading == false ? (
                    <div className="flex flex-wrap">
                        <div className="p-2">
                            <div className="rounded-md p-4">
                                <div className="flex justify-between">
                                    <h2 className="text-3xl mb-3">{articleData.articleTitle}</h2>
                                </div>
                                <img src={articleData.articleImage} alt="Homepage Image" className="w-full h-96 object-cover mt-4" />
                                <p className="text-gray-700 mt-14" style={{ whiteSpace: 'pre-line' }}>{articleData.articleDescription}</p>

                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <p className='text-3xl'>Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalystHomepage;