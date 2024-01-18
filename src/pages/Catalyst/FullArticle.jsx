import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore/lite'; // Update the import for getDoc
import { db } from '../../firebase';
import Footer from '../../layout/footer';

const FullArticle = () => {
    const [error, setError] = useState('');
    const { articlePage, articleIndex } = useParams();
    const [articleData, setArticleData] = useState({ articleTitle: '', articleAuthor: '' , articleDescription: '', articleImage: '' });
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
        } else if (articlePage === 'apiit-events'){
            setArticlePageDBName('ApiitEvents');
        }
        else {
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
            <div className='lg:mx-32 mt-10'>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <p className='text-md'>Loading...</p>
                    </div>
                ) : (
                    <div>
                    <div className="flex flex-wrap">
                        {error && (
                            <div className="flex items-center justify-center">
                                <p className='text-3xl'>{error}</p>
                            </div>
                        )}
                        <div className="p-2">
                            <div className="rounded-md p-4">
                                <div className="">
                                    <h2 className="text-5xl font-bold text-center  mb-3" id="article-title">{articleData[articleIndex].articleTitle}</h2>
                                </div>
                                <h3 className=" text-xl italic text-center mb-10">
                                    by {articleData[articleIndex].articleAuthor}
                                </h3>
                                <img src={articleData[articleIndex].articleImage} alt="Homepage Image" className="w-full lg:h-[800px] object-fill mt-4" />
                                <p className="text-gray-700 mt-14 text-xl" 
                                id="article-content"
                                style={{ whiteSpace: 'pre-line' }}>{articleData[articleIndex].articleDescription}</p>
                            </div>
                        </div>
                        </div>
                        <Footer />
                        </div>
                )}
            </div>
          
        </div>
    );
};

export default FullArticle;
