import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, collection, setDoc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';


const AddCatalystHomepage = () => {

  const [title, setTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleImage, setArticleImage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [wasImageDeleted, setWasImageDeleted] = useState(false); //this is used to trigger a re-render of the image preview after the image is deleted. See line 100.
  const navigate = useNavigate();

  const fetchTitleAndContent = async () => {
    try {
      const collectionReference = collection(db, 'Catalyst');
      const docReference = doc(collectionReference, 'homepage');
      const docSnap = await getDoc(docReference);
      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setArticleContent(docSnap.data().articleContent);
        setImageURL(docSnap.data().articleImage);

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


  const deleteImage = async () => {
    try {
      const collectionReference = collection(db, 'Catalyst');
      const docReference = doc(collectionReference, 'homepage');
      const docSnap = await getDoc(docReference);
      const oldImageURL = docSnap.data().articleImage;
      const oldImageRef = ref(storage, oldImageURL);
      await deleteObject(oldImageRef);
      setWasImageDeleted(!wasImageDeleted);

      //delete dwnldURL from firestore
      updateDoc(docReference, {
        articleImage: '',
      }).then(() => {
        // console.log('Document successfully updated with articleImage URL.');
      }).catch((updateError) => {
        console.error('Error updating document:', updateError);
      });

      await fetchTitleAndContent();


      console.log('Old image deleted successfully.');
    } catch (error) {
      console.log('error deleting old image', error)
    }
  }




  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleArticleContentChange = (e) => {
    setArticleContent(e.target.value);
  }

  const handleArticleImageChange = (e) => {
    if (e.target.files[0]) {
      setArticleImage(e.target.files[0]);

    }
  }

  const handlePreviewClick = () => {
    navigate('/admin/Catalyst/CatalystHomepagePreview', {
      state: {
        title: title,
        articleContent: articleContent,
        articleImage: imageURL,
      },
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const collectionReference = collection(db, 'Catalyst');
      const docReference = doc(collectionReference, 'homepage');
      const storageRef = ref(storage, 'CatalystArticleImages');
      const docSnap = await getDoc(docReference);
      const oldImageURL = docSnap.data().articleImage;

      await setDoc(docReference, {
        title: title,
        articleContent: articleContent,
      });

      if (articleImage) {

        try {
          if (oldImageURL) {
            const oldImageRef = ref(storage, oldImageURL);
            await deleteObject(oldImageRef);
            // console.log('Old image deleted successfully.');
          }
        } catch (error) {

          console.log('error deleting old image', error)
        }


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
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              updateDoc(docReference, {
                articleImage: downloadURL,
              }).then(() => {
                // console.log('Document successfully updated with articleImage URL.');
              }).catch((updateError) => {
                console.error('Error updating document:', updateError);
              });
            });
          }
        );
      } else {
        //if no new image is selected, update the document with the old image URL 
        updateDoc(docReference, {
          articleImage: oldImageURL,
        }).then(() => {
          // console.log('Document successfully updated with old articleImage URL.');
        }).catch((updateError) => {
          console.error('Error updating document:', updateError);
        });
      }
    } catch (error) {
      console.error('Error:', error);
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
            {imageURL && <img src={imageURL} alt="" className='w-1/4' />}

            {imageURL && (
              <button onClick={deleteImage} type="button">
                <span role="img" aria-label="delete">🗑️</span>
              </button>
            )}
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