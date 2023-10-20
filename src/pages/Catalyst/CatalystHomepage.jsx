import React, { useEffect , useState } from 'react';
import { db  } from '../../firebase';
import { doc, collection ,  setDoc , getDoc  } from 'firebase/firestore/lite';


const CatalystHomepage = () => {

    const [title, setTitle] = useState('');
    const [ articleContent , setArticleContent ] = useState('');
    const [ articleImage , setArticleImage ] = useState(''); 

    useEffect (() => {
        const fetchTitleAndContent = async () => {
            try {
                const collectionReference = collection(db, 'Catalyst');
                const docReference = doc(collectionReference, 'homepage');
                const docSnap = await getDoc(docReference);
                if (docSnap.exists()) {
                    setTitle(docSnap.data().title);
                    setArticleContent(docSnap.data().articleContent);
                    setArticleImage(docSnap.data().articleImage);

                } else {
                    console.log('No such document');
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchTitleAndContent();
    }, []); 

    const paragraphs = articleContent.split('\n\n');



    return (
        <div>
            <h1>Catalyst Homepage</h1>
            <h2>{title}</h2>
            <div className=' mb-10 mt-16'>
                {paragraphs.map((paragraph, index) => {
                    return <p key={index}>{paragraph}</p>
                })}

            </div>
            <div>
                <img src={articleImage} alt="article image" />
            </div>

        </div>
    );
};

export default CatalystHomepage;