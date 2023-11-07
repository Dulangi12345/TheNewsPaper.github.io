import { collection, query, orderBy, getDocs } from 'firebase/firestore/lite';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { db } from '../../firebase';
import PlayQuiz from './../../admin/Catalyst/PlayQuiz';
import Footer from '../../layout/footer'
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const AnimeCorner = () => {

  const [anime, setAnime] = useState([]);
  const [user, setUser] = useState('');



  const fetchAnimes = async () => {
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
      <h1 className='font-bold text-5xl m-20 ' id='anime-heading'>Top 5 animes of the month</h1>
      <div className="anime-list ">
        <div className="anime flex flex-col gap-8">
          {
            anime.map((anime) => (
              <div className="anime-name flex flex-row "
                key={anime.animeName}
                style={{
                  backgroundColor: anime.animeColor
                }}
                id='anime'
              >

               
                <img src={anime.animeImage} alt="anime image" className='object-cover' />

            
                <div className='flex flex-col w-2/3'>
                <h3 className='text-3xl font-bold' id='anime-name'>{anime.animeName}</h3>
                <p id='anime-content'className='text-xl m-10 ' >{anime.animeContent}</p>

                </div>

               
              </div>
            ))

          }


          <div className='' >
            <PlayQuiz/>
          </div>

        </div>

      </div>

      <Footer/>


    </div>
  );
};

export default AnimeCorner;


