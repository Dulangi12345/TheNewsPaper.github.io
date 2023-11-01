import {  collection , query , orderBy , getDocs  } from 'firebase/firestore/lite';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../../firebase';


const AnimeCorner = () => {
 
const [anime, setAnime] = useState([]);
   


 const fetchAnimes  = async () =>{
    try {
        const collectionReference = collection(db, 'AnimeCorner');
       
        //order using the AnimeOrder field
        const orderedAnimes = query(collectionReference, orderBy('animeOrder'));
        const animeList = getDocs(orderedAnimes);
        const animeListData = await animeList;
        setAnime(animeListData.docs.map(doc => doc.data()));
        console.log(animeListData.docs.map(doc => doc.data()));


        
        
    } catch (error) {
        console.log(error);
    }
 }


 useEffect(() => {
    fetchAnimes();
    }
    , []);




  return (
    <div>
      <h1>Anime Corner</h1>
      <div className="anime-list">
        <div className="anime">
            {
                anime.map((anime) => (
                    <div className="anime-name" key={anime.animeName}>

                        <h3>{anime.animeName}</h3>
                        <img src={anime.animeImage} alt="anime image" />
                        <p>{anime.animeContent}</p>
                    </div>
                ))

            }

        </div>
      
      </div>
    </div>
  );
};

export default AnimeCorner;


