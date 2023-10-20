import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, collection, setDoc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const AddCatalystHomepage = () => {

    const [title, setTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleImage, setArticleImage] = useState('');
    const [imageURL, setImageURL] = useState('');
    const navigate = useNavigate();

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



    useEffect(() => {
        fetchTitleAndContent();
    }, []);




    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleArticleContentChange = (e) => {
        setArticleContent(e.target.value);
    }

    const handleArticleImageChange = (e) => {
        if (e.target.files[0]) {
            setArticleImage(e.target.files[0]);
            setImageURL(URL.createObjectURL(e.target.files[0]));

        }


    }

    const handlePreviewClick = () => {
        navigate('/admin/Catalyst/CatalystHomepagePreview', {
            state: {
                title: title,
                articleContent: articleContent,
                articleImage: articleImage
            },
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const collectionReference = collection(db, 'Catalyst');
          const docReference = doc(collectionReference, 'homepage');
          const storageRef = ref(storage, 'CatalystArticleImages');
      
          // Update document data (title and articleContent)
          await setDoc(docReference, {
            title: title,
            articleContent: articleContent,
          });
      
          if (articleImage) {
            const fileRef = ref(storageRef, `CatalystHomepageImages/${title}/${articleImage.name}`);
            const metadata = {
              contentType: articleImage.type,
              createdAt: Date.now(),
            };
      
            const uploadTask = uploadBytesResumable(fileRef, articleImage, metadata);
      
            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              },
              (error) => {
                console.error('Error during upload:', error);
                // Handle the error here, show a message to the user, etc.
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  console.log('File available at', downloadURL);
                  // Update document with the download URL
                  updateDoc(docReference, {
                    articleImage: downloadURL,
                  }).then(() => {
                    console.log('Document successfully updated with articleImage URL.');
                  }).catch((updateError) => {
                    console.error('Error updating document:', updateError);
                  });
                });
              }
            );
          } else {
            // Handle case when there is no image to upload
            console.log('No image selected.');
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle general error, show a message to the user, etc.
        }
      };
      


    return (

        <div>

            <form action="" encType='
            multipart/form-data' >
                <div className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="title">Title</label>


                        <input type="text" name="title" id="title" value={title} onChange={handleTitleChange} className='border border-black' />
                    </div>
                    <div>
                        <label htmlFor="articleContent">Article Content</label>
                        <textarea name="articleContent" id="articleContent" cols="30" rows="10" value={articleContent} onChange={handleArticleContentChange}
                            className='border border-black'></textarea>
                    </div>
                    <div>
                        <label htmlFor="articleImage">Article Image</label>
                        <input type="file" name="articleImage" id="articleImage" onChange={handleArticleImageChange} />
                    </div>

                    <div>
                        {
                            imageURL && <img src={imageURL} alt="article image" />
                        }
                    </div>

                    <div>
                        <button type="button" onClick={handlePreviewClick}>
                            Preview
                        </button>

                    </div>


                    <div>
                        <button type="submit" onClick={handleSubmit}>Update</button>
                    </div>
                </div>
            </form>


        </div>

    )


}

export default AddCatalystHomepage;