import React, { useEffect } from "react";
import { useState } from "react";
import { ChromePicker } from "react-color";
import { useRef } from "react";
import { storage } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  updateDoc,
  setDoc,
  getDocs,
  deleteDoc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore/lite";
import { doc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../layout/AdminSidebar";
import ReactQuill, { Quill } from "react-quill";
import { set } from "mongoose";

const AddAnimeCorner = () => {
  const [animes, setAnimes] = useState([]);
  const [animeIndex, setAnimeIndex] = useState("");
  const [animeName, setAnimeName] = useState("");
  const [animeImage, setAnimeImage] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [animeContent, setAnimeContent] = useState("");
  const [animeColor, setAnimeColor] = useState("");
  const [animeOrder, setAnimeOrder] = useState("");
  const [background, setBackground] = useState("#fff");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [animeList, setAnimeList] = useState(animes);
  const [updatedAnimeList, setUpdatedAnimeList] = useState(animes);
  const [IsSaving, setIsSaving] = useState(false);
  const AnimeIndexRef = useRef(1);
  const db = getFirestore();
  const navigate = useNavigate();

  const handleDragStart = (e, index) => {
    setDraggedItem(animes[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.target.style.cursor = "grabbing";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    //change the cursor
    e.target.style.cursor = "grabbing";
    //set the order of the dragged item to be the same as the item it is dragged over
    const draggedOverItem = animes[index];
    if (draggedOverItem === draggedItem) {
      return;
    }
    const items = animes.filter((item) => item !== draggedItem);
    items.splice(index, 0, draggedItem);
    setAnimes(items);
    console.log(items);
  };

  const handleDragLeave = () => {
    //change the background color back to normal
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    const updatedAnimeList = [...animes];

    const draggedOverItem = updatedAnimeList[index];

    const draggedItemIndex = updatedAnimeList.findIndex(
      (item) => item.animeIndex === draggedItem.animeIndex
    );
    const draggedOverItemIndex = updatedAnimeList.findIndex(
      (item) => item.animeIndex === draggedOverItem.animeIndex
    );

    const temp = updatedAnimeList[draggedItemIndex];
    updatedAnimeList[draggedItemIndex] = updatedAnimeList[draggedOverItemIndex];
    updatedAnimeList[draggedOverItemIndex] = temp;

    setAnimes(updatedAnimeList);

    const updatedItems = updatedAnimeList.map((item, index) => {
      return { ...item, animeOrder: index + 1 };
    });

    const promises = updatedItems.map((item) => {
      const docRef = doc(
        collection(db, "AnimeCorner"),
        `Anime${item.animeIndex}`
      );
      return updateDoc(docRef, { animeOrder: item.animeOrder });
    });

    Promise.all(promises)
      .then(() => {
        console.log("Anime order successfully updated in the database.");
      })
      .catch((error) => {
        console.error("Error updating anime order in the database:", error);
      });
  };

  const fetchAnimes = async () => {
    try {
      const collectionReference = collection(db, "AnimeCorner");
      //order using the AnimeOrder field

      const orderedAnimes = query(collectionReference, orderBy("animeOrder"));
      const querySnapshot = await getDocs(orderedAnimes);
      const fetchedAnimes = querySnapshot.docs.map((doc) => {
        return doc.data();
      });

      // const querySnapshot = await getDocs(collectionReference);
      // const fetchedAnimes = querySnapshot.docs.map((doc) => {
      //     return doc.data();
      // });
      setAnimes(fetchedAnimes);
      setAnimeList(fetchedAnimes);
    } catch (error) {
      console.log("Error fetching animes", error);
    }
  };

  const handlePreviewClick = () => {
    navigate("/admin/catalyst/animeCornerPreview", {
      state: {
        animes: {
          animeName: animeName,
          animeContent: animeContent,
          animeImage: existingImageUrl,
        },
      },
    });
  };

  useEffect(() => {
    fetchAnimes();
    setEditAnime();
  }, [selectedAnime]);

  const setEditAnime = () => {
    if (selectedAnime) {
      setAnimeIndex(selectedAnime.animeIndex);
      setAnimeName(selectedAnime.animeName);
      setExistingImageUrl(selectedAnime.animeImage);
      setAnimeContent(selectedAnime.animeContent);
      setAnimeColor(selectedAnime.animeColor);
      setBackground(selectedAnime.animeColor);
      setIsFormVisible(true);
    }
  };

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

  const storageImageInStorage = async () => {
    const AnimeIndex = AnimeIndexRef.current;
    if (animeImage) {
      try {
        const storageRef = ref(storage, "CatalystArticleImages");
        const animeImageRef = ref(storageRef, "AnimeCorner");

        const fileRef = ref(animeImageRef, `Anime${AnimeIndex}/AnimeImage`);

        const collectionReference = collection(db, "AnimeCorner");
        const docReference = doc(collectionReference, `Anime${AnimeIndex}`);

        const metadata = {
          contentType: animeImage.type,
          createdAt: Date.now(),
        };

        const uploadTask = uploadBytesResumable(fileRef, animeImage, metadata);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            setProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("File available at", downloadURL);
                updateDoc(docReference, {
                  animeImage: downloadURL,
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
        console.log("error uploading image", error);
      }
    }
  };

  const addAnime = async (e) => {
    e.preventDefault();
    setIsFormVisible(true);
    setIsSaving(true);

    //validate form
    if (!animeIndex) {
      alert("Please enter anime index");
      return;
    }
    try {
      const collectionReference = collection(db, "AnimeCorner");
      const docReference = doc(
        collectionReference,
        `Anime${AnimeIndexRef.current}`
      );

      if (docReference.exists) {
        await updateDoc(docReference, {
          animeIndex: AnimeIndexRef.current,
          animeName: animeName,
          animeImage: existingImageUrl,
          animeContent: animeContent,
          animeColor: animeColor,
          animeOrder: animeOrder,
        });
      } else {
        await setDoc(docReference, {
          animeIndex: AnimeIndexRef.current,
          animeName: animeName,
          animeImage: existingImageUrl,
          animeContent: animeContent,
          animeColor: animeColor,
          animeOrder: AnimeIndexRef.current,
        });
        storageImageInStorage();
      }

      setIsSaving(false);
      setIsFormVisible(false);
      fetchAnimes();
    } catch (error) {
      console.log("error adding anime", error);
    }
  };

  const handleAnimeIndexChange = (event) => {
    setAnimeIndex(event.target.value);
    AnimeIndexRef.current = event.target.value;

    const selectedAnime = animes.find(
      (anime) => anime.animeIndex === event.target.value
    );
    // console.log(selectedAnime);

    if (selectedAnime) {
      setSelectedAnime(selectedAnime);
    } else {
      //set the fields to empty
      setSelectedAnime(null);
      setAnimeName("");
      setExistingImageUrl("");
      setAnimeContent("");
      setAnimeColor("");
      setBackground("#fff");
    }
  };

  const handleAnimeNameChange = (event) => {
    setAnimeName(event.target.value);
  };

  const handleAnimeImageChange = (event) => {
    if (event.target.files[0]) {
      setAnimeImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setExistingImageUrl(event.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleAnimeContentChange = (event) => {
    setAnimeContent(event.target.value);
  };

  const handleColorChange = (color) => {
    setAnimeColor(color.hex);
    setBackground(color.hex);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const editAnime = async () => {
    const selectedAnime = animes.find(
      (anime) => anime.animeIndex === AnimeIndexRef.current
    );
    setSelectedAnime(selectedAnime);
    console.log(selectedAnime);
  };

  const deleteAnime = async (animeIndex) => {
    try {
      const collectionReference = collection(db, "AnimeCorner");
      const docReference = doc(collectionReference, `Anime${animeIndex}`);

      //check if there is an image
      const docSnap = await getDoc(docReference);
      const existingImageUrl = docSnap.data().animeImage;
      if (existingImageUrl) {
        const existingImageRef = ref(storage, existingImageUrl);
        await deleteObject(existingImageRef);
        console.log("Image deleted successfully.");
      }

      await deleteDoc(docReference);
      console.log("Anime  deleted successfully.");
      fetchAnimes();
    } catch (error) {
      console.error("Error deleting anime and image:", error);
    }
  };

  const removeImage = async (animeIndex) => {
    try {
      const collectionReference = collection(db, "AnimeCorner");
      const docReference = doc(collectionReference, `Anime${animeIndex}`);
      const docSnap = await getDoc(docReference);
      const existingImageUrl = docSnap.data().animeImage;
      const existingImageRef = ref(storage, existingImageUrl);
      await deleteObject(existingImageRef);
      console.log("Image deleted successfully.");

      await updateDoc(docReference, {
        animeImage: "",
      })
        .then(() => {
          console.log("Document successfully updated with articleImage URL.");
        })
        .catch((updateError) => {
          console.error("Error updating document:", updateError);
        });

      fetchAnimes();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="flex flex-row ">
      <div className="w-64 bg-gray-200">
        <AdminSidebar />
      </div>

      <div className="w-full flex flex-col">
        <div className=" m-auto m-8 mt-12 flex flex-row gap-2 ">
          <button
            onClick={toggleFormVisibility}
            className="shadow-md  p-3 rounded-full  "
          >
            {isFormVisible ? " Cancel" : "Add An Anime"}
          </button>
          <div>
            {animeList.length > 0 && (
              <button
                onClick={handlePreviewClick}
                className="shadow-md  p-3 rounded-full "
              >
                Preview{" "}
              </button>
            )}
          </div>
        </div>

        {isFormVisible && (
          <form action="" className="relative z-10">
            <div className="space-y-12  w-2/3 m-8 p-8 border-gray-900/10 border-2 rounded fixed inset-0 bg-white  transition-opacity overflow-scroll ">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">
                  Please fill in the details
                </h2>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="animeIndex"
                      classNameName="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Anime Index
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="number"
                          min={1}
                          className=" block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          id="animeIndex"
                          placeholder="Enter Anime Index"
                          value={animeIndex}
                          onChange={handleAnimeIndexChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="animeName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Anime Name
                    </label>

                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          id="animeName"
                          placeholder="Enter Anime Name"
                          value={animeName}
                          onChange={handleAnimeNameChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="animeContent"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Anime Content
                    </label>
                    <div className="mt-2">
                      <ReactQuill
                        className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        id="animeContent"
                        placeholder="Enter Anime Content"
                        value={animeContent}
                        onChange={(value) => setAnimeContent(value)}
                      ></ReactQuill>
                      {/* <textarea
                                            className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            id="animeContent"
                                            placeholder="Enter Anime Content"
                                            value={animeContent}
                                            onChange={handleAnimeContentChange} > </textarea> */}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <img src={existingImageUrl} alt="" className="w-20" />
                    <label
                      htmlFor="animeImage"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Anime Image
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-300"
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
                              for="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              Upload a file
                              <input
                                type="file"
                                style={{ display: "none" }}
                                id="animeImage"
                                placeholder="Enter Anime Image"
                                onChange={handleAnimeImageChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </label>

                    <ProgressBar progress={progress} />
                  </div>

                  <ChromePicker
                    color={background}
                    onChangeComplete={handleColorChange}
                    // onChangeComplete={(color) => setBackground(color.hex)}
                    draggable={true}
                  />

                  {existingImageUrl && (
                    <button onClick={() => removeImage(animeIndex, animeImage)}>
                      Remove Image
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    setIsFormVisible(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={IsSaving}
                  onClick={addAnime}
                >
                  {IsSaving ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-white">Saving...</span>
                      <div className="animate-spin h-4 w-3.5 border-t-2 border-b-2 border-white rounded-full"></div>
                    </div>
                  ) : (
                    "Save Anime"
                  )}
                </button>

                {/* <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={addAnime}>Save</button> */}
              </div>
            </div>
          </form>
        )}

        <div className=" mx-auto bg-white rounded-xl m-5 ">
          {animes.map((anime, index) => {
            return (
              <div
                key={anime.animeIndex}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className="border-2 m-8 p-4  rounded-xl flex lg:flex-row flex-col h-66 gap-4  "
                style={{ background: anime.animeColor }}
              >
                <div className="w-full ">
                  <img
                    src={anime.animeImage}
                    alt=""
                    className="object-cover h-48 w-full "
                  />
                </div>

                <div className="">
                  <h1 className="w-full font-bold mx-auto text-lg ">
                    {anime.animeName}
                  </h1>
                  <p
                    dangerouslySetInnerHTML={{ __html: anime.animeContent }}
                    className="w-full mx-auto text-md"
                  ></p>

                  <div className="flex flex-row ">
                    <p className="p-2 border-2 border-black rounded-full w-32 m-2 text-center ">
                      {anime.animeColor}
                    </p>

                    <button
                      className="p-2  rounded-full w-32 uppercase m-2 bg-green-400 "
                      onClick={() => {
                        editAnime((AnimeIndexRef.current = anime.animeIndex));
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="p-2  rounded-full w-32 uppercase m-2 bg-red-600"
                      onClick={() => {
                        deleteAnime((AnimeIndexRef.current = anime.animeIndex));
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div>
                {animeList.map((anime, index) => (
                    <div
                        key={anime.animeIndex}
                        className='border-2 m-8 p-4'
                        style={{ background: anime.animeColor }}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                    >

                        <h1>{anime.animeName}</h1>
                       
                    </div>
                ))}

            </div> */}
      </div>
    </div>
  );
};

export default AddAnimeCorner;
