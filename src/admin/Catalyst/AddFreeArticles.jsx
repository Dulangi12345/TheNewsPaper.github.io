import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminSidebar from "../../layout/AdminSidebar";
import { set } from "mongoose";

const AddFreeArticles = () => {
  const [FreeArticleIndex, setFreeArticleIndex] = useState(1);
  const [FreeArticleTitle, setFreeArticleTitle] = useState("");
  const [FreeArticleContent, setFreeArticleContent] = useState("");
  const [FreeArticleAuthor, setFreeArticleAuthor] = useState("");
  const [FreeArticleImage1, setFreeArticleImage1] = useState("");
  const [FreeArticleImage2, setFreeArticleImage2] = useState("");
  const [FreeArticleImage3, setFreeArticleImage3] = useState("");
  const [progressforImage1, setProgressforImage1] = useState(0);
  const [progressforImage2, setProgressforImage2] = useState(0);
  const [progressforImage3, setProgressforImage3] = useState(0);
  const [existingImage1Url, setExistingImage1Url] = useState("");
  const [existingImage2Url, setExistingImage2Url] = useState("");
  const [existingImage3Url, setExistingImage3Url] = useState("");
  const [selectedFile1Name, setSelectedFile1Name] = useState("");
  const [selectedFile2Name, setSelectedFile2Name] = useState("");
  const [selectedFile3Name, setSelectedFile3Name] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isFilePicked, setIsFilePicked] = useState(false);
  const FreeArticleIndexRef = useRef(1);
  const navigate = useNavigate();

  const ProgressBar = ({ progress }) => {
    return (
      <div className="w-full h-2 bg-gray-300">
        <div
          className="h-full bg-green-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const collectionReference = collection(db, "CatalystFreeArticles");
      const documentReference = doc(
        collectionReference,
        "Freearticle" + FreeArticleIndex
      );
      await setDoc(documentReference, {
        index: FreeArticleIndex,
        title: FreeArticleTitle,
        author: FreeArticleAuthor,
        content: FreeArticleContent,
        image1: existingImage1Url,
        image2: existingImage2Url,
        image3: existingImage3Url,
      });

      await storeImage1InStorage();
      await storeImage2InStorage();
      await storeImage3InStorage();
      setIsSaving(false);
      //display alert
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };

  // const fetchTitlecontentAndImages = async () => {

  //     try {
  //         const collectionReference = collection(db, 'CatalystFreeArticles');

  //         //fetch data based on the article index
  //         const articles = {
  //             1: 'Freearticle1',
  //             2: 'Freearticle2',
  //             3: 'Freearticle3'
  //         };

  //         const documentReference = doc(collectionReference, articles[FreeArticleIndexRef.current]);
  //         const documentSnapshot = await getDoc(documentReference);
  //         const data = documentSnapshot.data() || {};

  //         setFreeArticleTitle(data.title || '');
  //         setFreeArticleContent(data.content || '');
  //         setExistingImage1Url(data.image1 || '');
  //         setExistingImage2Url(data.image2 || '');
  //         setExistingImage3Url(data.image3 || '');

  //     } catch (error) {
  //         console.log('Error getting document: ', error);
  //     }

  // }

  const fetchTitlecontentAndImages = async () => {
    try {
      const collectionReference = collection(db, "CatalystFreeArticles");

      // Assuming you have the FreeArticleIndexRef properly initialized
      const FreeArticleIndex = FreeArticleIndexRef.current;

      // Get the document ID based on FreeArticleIndex
      const querySnapshot = await getDocs(collectionReference);
      let articleId = "";

      querySnapshot.forEach((doc) => {
        if (doc.data().index === FreeArticleIndex) {
          articleId = doc.id;
        }
      });

      if (articleId) {
        const documentReference = doc(collectionReference, articleId);
        const documentSnapshot = await getDoc(documentReference);
        const data = documentSnapshot.data() || {};

        setFreeArticleTitle(data.title || "");
        setFreeArticleAuthor(data.author || "");
        setFreeArticleContent(data.content || "");
        setExistingImage1Url(data.image1 || "");
        setExistingImage2Url(data.image2 || "");
        setExistingImage3Url(data.image3 || "");
      } else {
        setFreeArticleTitle("");
        setFreeArticleAuthor("");
        setFreeArticleContent("");
        setExistingImage1Url(null);
        setExistingImage2Url(null);
        setExistingImage3Url(null);
      }
    } catch (error) {
      console.log("Error getting document: ", error);
    }
  };

  const handlePreviewClick = () => {
    navigate("/admin/catalyst/freearticlepreview", {
      state: {
        title: FreeArticleTitle,
        content: FreeArticleContent,
        image1: existingImage1Url,
        image2: existingImage2Url,
        image3: existingImage3Url,
      },
    });
  };

  useEffect(() => {
    fetchTitlecontentAndImages();
  }, [FreeArticleIndex]);

  //image 1

  const storeImage1InStorage = async () => {
    // if (isFilePicked === false && existingImage1Url === null) {
    //     FreeArticleImage1 = ''
    // }

    // else {
    const FreeArticleIndex = FreeArticleIndexRef.current;

    if (FreeArticleImage1) {
      //if there is a new article image delete the old image

      try {
        const storageRef = ref(storage);
        const catalystArticleImagesRef = ref(
          storageRef,
          "CatalystArticleImages"
        );
        const freeArticlesRef = ref(
          catalystArticleImagesRef,
          `FreeArticle ${FreeArticleIndex}`
        );
        // const fileRef = ref(freeArticlesRef, `FreeArticle1Image1`);
        const fileRef = ref(
          freeArticlesRef,
          `FreeArticle${FreeArticleIndexRef.current}Image1`
        );

        const collectionReference = collection(db, "CatalystFreeArticles");
        const documentReference = doc(
          collectionReference,
          "Freearticle" + FreeArticleIndex
        );

        const metadata = {
          contentType: FreeArticleImage1.type,
          createdAt: Date.now(),
        };
        const uploadTask = uploadBytesResumable(
          fileRef,
          FreeArticleImage1,
          metadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setProgressforImage1(progress);
          },
          (error) => {
            console.error("Error during upload:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("File available at", downloadURL);
                updateDoc(documentReference, {
                  image1: downloadURL,
                })
                  .then(() => {
                    console.log(
                      "Document successfully updated with articleImage URL."
                    );
                  })
                  .catch((updateError) => {
                    console.error("Error updating document:", updateError);
                  });
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
              });
          }
        );
      } catch (error) {
        console.error("Error getting storage ref: ", error);
      }

      // }
    }
  };

  // image 2

  const storeImage2InStorage = async () => {
    // if (isFilePicked === false && existingImage2Url === null) {
    //     FreeArticleImage2 = ''
    // }

    // else {

    const FreeArticleIndex = FreeArticleIndexRef.current;
    //if there is an article image delete the old image

    if (FreeArticleImage2) {
      try {
        const storageRef = ref(storage);
        const catalystArticleImagesRef = ref(
          storageRef,
          "CatalystArticleImages"
        );
        const freeArticlesRef = ref(
          catalystArticleImagesRef,
          `FreeArticle ${FreeArticleIndex}`
        );
        const fileRef = ref(freeArticlesRef, `FreeArticle1Image2`);

        const collectionReference = collection(db, "CatalystFreeArticles");
        const documentReference = doc(
          collectionReference,
          "Freearticle" + FreeArticleIndex
        );

        const metadata = {
          contentType: FreeArticleImage2.type,
          createdAt: Date.now(),
        };
        const uploadTask = uploadBytesResumable(
          fileRef,
          FreeArticleImage2,
          metadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");

            setProgressforImage2(progress);
          },
          (error) => {
            console.error("Error during upload:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("File available at", downloadURL);
                updateDoc(documentReference, {
                  image2: downloadURL,
                })
                  .then(() => {
                    console.log(
                      "Document successfully updated with articleImage URL."
                    );
                  })
                  .catch((updateError) => {
                    console.error("Error updating document:", updateError);
                  });
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
              });
          }
        );
      } catch (error) {
        console.error("Error getting storage ref: ", error);
      }

      // }
    }
  };

  //image 3
  const storeImage3InStorage = async () => {
    // if (isFilePicked === false && existingImage3Url === null) {
    //     FreeArticleImage3 = ''
    // }

    // else {

    const FreeArticleIndex = FreeArticleIndexRef.current;

    if (FreeArticleImage3) {
      //if there is an article image delete the old image
      try {
        const storageRef = ref(storage);
        const catalystArticleImagesRef = ref(
          storageRef,
          "CatalystArticleImages"
        );
        const freeArticlesRef = ref(
          catalystArticleImagesRef,
          `FreeArticle ${FreeArticleIndex}`
        );
        const fileRef = ref(freeArticlesRef, `FreeArticle1Image3`);

        const collectionReference = collection(db, "CatalystFreeArticles");
        const documentReference = doc(
          collectionReference,
          "Freearticle" + FreeArticleIndex
        );

        const metadata = {
          contentType: FreeArticleImage3.type,
          createdAt: Date.now(),
        };
        const uploadTask = uploadBytesResumable(
          fileRef,
          FreeArticleImage3,
          metadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setProgressforImage3(progress);
          },
          (error) => {
            console.error("Error during upload:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("File available at", downloadURL);
                updateDoc(documentReference, {
                  image3: downloadURL,
                })
                  .then(() => {
                    console.log(
                      "Document successfully updated with articleImage URL."
                    );
                  })
                  .catch((updateError) => {
                    console.error("Error updating document:", updateError);
                  });
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
              });
          }
        );
      } catch (error) {
        console.error("Error getting storage ref: ", error);
      }

      // }
    }
  };

  const handleFreeArticleIndexChange = (e) => {
    FreeArticleIndexRef.current = e.target.value; // Update the ref value

    setFreeArticleIndex(e.target.value);
  };

  const handleFreeArticleTitleChange = (e) => {
    setFreeArticleTitle(e.target.value);
  };

  const handleFreeArticleAuthorChange = (e) => {
    setFreeArticleAuthor(e.target.value);
  };

  const handleFreeArticleContentChange = (e) => {
    setFreeArticleContent(e.target.value);
  };

  // const handleFreeArticleContentChange = (value) => {
  //     setFreeArticleContent(value);
  // }

  const handleFreeArticleImage1Change = (e) => {
    if (e.target.files[0]) {
      setFreeArticleImage1(e.target.files[0]);
      setSelectedFile1Name(e.target.files[0].name);
      setIsFilePicked(true);

      //display the chosen image
      const reader = new FileReader();
      reader.onload = (event) => {
        setExistingImage1Url(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFreeArticleImage2Change = (e) => {
    if (e.target.files[0]) {
      setFreeArticleImage2(e.target.files[0]);
      setSelectedFile2Name(e.target.files[0].name);
      setIsFilePicked(true);

      //display the chosen image
      const reader = new FileReader();
      reader.onload = (event) => {
        setExistingImage2Url(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFreeArticleImage3Change = (e) => {
    if (e.target.files[0]) {
      setFreeArticleImage3(e.target.files[0]);
      setSelectedFile3Name(e.target.files[0].name);
      setIsFilePicked(true);

      //display the chosen image
      const reader = new FileReader();
      reader.onload = (event) => {
        setExistingImage3Url(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-200">
        <AdminSidebar />
      </div>

      <form action="" className="w-3/4 p-4 ">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12 ">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Manage Free Articles
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                {/* <select name="" id=""

                        onChange={
                            handleFreeArticleIndexChange

                        }>
                        <option value="1">Article 1</option>
                        <option value="2">Article 2</option>
                        <option value="3">Article 3</option>
                    </select> */}

                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Article Number
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md p-2">
                    <input
                      type="number"
                      value={FreeArticleIndex}
                      onChange={handleFreeArticleIndexChange}
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900  focus:ring-0 sm:text-sm sm:leading-6"
                      min={1}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Article Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={FreeArticleTitle}
                    onChange={handleFreeArticleTitleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Article Author
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={FreeArticleAuthor}
                    onChange={handleFreeArticleAuthorChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Article Content
                </label>
                <p class="mt-3 text-sm leading-6 text-gray-600">
                  Please add spaces between pragraphs for proper distinguishment
                </p>
                <div className="mt-2">
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    value={FreeArticleContent}
                    onChange={handleFreeArticleContentChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  ></textarea>
                </div>

                {/* <ReactQuill
                    
                        value={FreeArticleContent}
                        onChange={handleFreeArticleContentChange}
                        className='border-2 border-black'
                    /> */}
              </div>

              <hr />

              <div className="col-span-full">
                <h5 className="block text-sm font-medium leading-6 text-gray-900">
                  Article Header Image 1
                </h5>

                <div className="col-span-full">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="articleImage1"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>

                          <div className="w-96  h-96">
                            <img
                              src={existingImage1Url}
                              className="w-full h-full"
                              alt=""
                            />
                          </div>

                          <input
                            type="file"
                            name="articleImage1"
                            id="articleImage1"
                            onChange={handleFreeArticleImage1Change}
                            style={{ display: "none" }}
                          />
                        </label>

                        <p>{selectedFile1Name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-12 ">
                    {progressforImage1 > 0 && (
                      <ProgressBar progress={progressforImage1} />
                    )}
                  </div>
                </div>

                {/* <label htmlFor="articleImage1">
                                    <div>
                                        Click here to upload
                                    </div>

                                    <div>
                                        <img src=
                                            {existingImage1Url}
                                            alt="" />
                                    </div>

                                    <input type="file" name="articleImage1"
                                        id="articleImage1"
                                        onChange={handleFreeArticleImage1Change}
                                        style={{ display: 'none' }} />
                                </label> */}
              </div>

              <br />
              <hr />

              <div className="col-span-full">
                <h5 className="block text-sm font-medium leading-6 text-gray-900">
                  {" "}
                  Article Image 2
                </h5>

                <div className="col-span-full">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clip-rule="evenodd"
                        />
                      </svg>

                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="articleImage2"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <div>Click here to upload</div>

                          <div className="w-96  h-96">
                            <img
                              src={existingImage2Url}
                              className="w-full h-full"
                              alt=""
                            />
                          </div>

                          <input
                            type="file"
                            name="articleImage2"
                            id="articleImage2"
                            style={{ display: "none" }}
                            onChange={handleFreeArticleImage2Change}
                          />
                        </label>
                        <p>{selectedFile2Name}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {progressforImage2 > 0 && (
                      <ProgressBar progress={progressforImage2} />
                    )}
                  </div>
                </div>

                {/* <label htmlFor="articleImage2">

                                    <div>
                                        Click here to upload
                                    </div>

                                    <div>
                                        <img src=
                                            {existingImage2Url}
                                            alt="" />
                                    </div>

                                    <input type="file" name="articleImage2" id="articleImage2" style={{ display: 'none' }}
                                        onChange={handleFreeArticleImage2Change} />
                                </label> */}

                {/* <p>{selectedFile2Name}</p>
                                <div>
                                    {progressforImage2 > 0 && <ProgressBar progress={progressforImage2} />}
                                </div> */}
              </div>

              <br />
              <hr />

              <div className="col-span-full">
                <h5 className="block text-sm font-medium leading-6 text-gray-900">
                  Article Image 3
                </h5>

                <div className="col-span-full">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        class="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clip-rule="evenodd"
                        />
                      </svg>

                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="articleImage3"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <div>Click here to upload</div>
                          <div className="w-96  h-96">
                            <img
                              src={existingImage3Url}
                              alt=""
                              className="w-full h-full "
                            />
                          </div>

                          <input
                            type="file"
                            name="articleImage3"
                            id="articleImage3"
                            onChange={handleFreeArticleImage3Change}
                            style={{ display: "none" }}
                          />
                        </label>

                        <p>{selectedFile3Name}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {progressforImage3 > 0 && (
                      <ProgressBar progress={progressforImage3} />
                    )}
                  </div>
                </div>

                {/* <label htmlFor="articleImage3">
                                    <div>
                                        Click here to upload
                                    </div>
                                    <div>
                                        <img src=
                                            {existingImage3Url}
                                            alt="" />
                                    </div>

                                    <input type="file" name="articleImage3"
                                        id="articleImage3"
                                        onChange={handleFreeArticleImage3Change}
                                        style={{ display: 'none' }} />
                                </label> */}
                {/* <p>{selectedFile3Name}</p>
                                <div>
                                    {progressforImage3 > 0 && <ProgressBar progress={progressforImage3} />}
                                </div> */}
              </div>

              <br />
              <hr />

              {/* View preview*/}
              {/* <div>
                                <button
                                    type="button"
                                    onClick={handlePreviewClick}
                                >Preview Article</button>
                            </div>



                            <div>
                                <button type="submit" onClick={handleOnSubmit}>Add</button>
                            </div> */}
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          {/* <button
            type="button"
            onClick={handlePreviewClick}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Preview
          </button> */}
          <button
            type="submit"
            disabled={isSaving}
            onClick={handleOnSubmit}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isSaving ? (
              <div className="flex items-center">
                <span className="mr-2 text-white">Saving...</span>
                <div className="animate-spin h-4 w-3.5 border-t-2 border-b-2 border-white rounded-full"></div>
              </div>
            ) : (
              "Save Article"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFreeArticles;
