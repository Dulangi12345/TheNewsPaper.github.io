import React, { useState, useEffect } from 'react';
import { doc, collection, getDoc } from 'firebase/firestore/lite';
import { db } from '../../firebase';
import Footer from '../../layout/footer';

const WellbeingCorner = () => {
    const [articleData, setArticleData] = useState({ articleTitle: '', articleDescription: '', articleImage: '' });
    const [Loading, setLoading] = useState(true);

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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleData();
    }, []);



    return (
       

            <div className='lg:mx-32 mt-10'>
                {Loading == false ? (
                    <div>
                    <div className="flex flex-wrap">
                        <div className="p-2">
                            <div className="rounded-md p-4">
                                <div className="">
                                    <h2 className="text-5xl font-bold text-center  mb-3" id="article-title">{articleData.articleTitle}</h2>
                                </div>
                                <h3 className=" text-xl italic text-center mb-10">
                                    by Shelly Adams
                                </h3>
                                <img src={articleData.articleImage} alt="Wellbeing Corner Image" className="w-full h-[800px] object-fill mt-4" />
                                <p className="text-gray-700  mt-14 text-xl"
                                    id="article-content"
                                    style={{ whiteSpace: 'pre-line' }}>{articleData.articleDescription}</p>

                            </div>
                        </div>

                    </div>
                    <Footer />
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        <p className='text-md'>Loading...</p>
                    </div>
                )}
            </div>
       
       
    );
};

export default WellbeingCorner;