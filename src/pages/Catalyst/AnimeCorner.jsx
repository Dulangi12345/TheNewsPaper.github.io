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
      <h1 className='font-bold text-6xl m-20 text-center ' id='anime-heading'>Top 5 animes of the month</h1>
      <div className='text-center' id='anime-heading' >
        <p className='text-2xl m-16  '>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Duis ut nisi id tortor imperdiet interdum. Mauris sed aliquam ligula. 
        Curabitur laoreet pulvinar pretium. Sed lacinia purus est, ac posuere ex
         finibus sed. Integer dignissim purus odio, vitae volutpat enim tristique sed. 
         Pellentesque laoreet elit vel tortor tincidunt euismod. Maecenas faucibus nibh et 
        libero consequat, nec tristique neque condimentum. Vivamus vel sapien quis erat 
        elementum pharetra. Donec faucibus fringilla enim quis elementum. Duis lobortis 
        ipsum sed felis tempor, id maximus nibh finibus. Sed bibendum egestas pretium.
         Nunc semper aliquam nunc, sed pellentesque sem. Cras tristique id quam egestas 
         tempor. Proin aliquet leo dui, et venenatis erat malesuada ac.
        </p>


      </div>
      <div className="anime-list ">
        <div className="anime flex flex-col gap-8">
          {
            anime.map((anime) => (
              <div className="anime-name flex lg:flex-row flex-col  lg:h-[600px]  "
                key={anime.animeName}
                style={{
                  backgroundColor: anime.animeColor
                }}
                id='anime'
              >

                <div className='flex lg:flex-row flex-col'>

               
                <img src={anime.animeImage} alt="anime image" className='object-contain lg:w-1/2' />

            
                <div className='flex lg:flex-col flex-col text-center lg:w-2/3'>
                <h3 className='text-6xl font-bold lg:text-center mt-8 text-white' id='anime-name'>{anime.animeName}</h3>
                <p id='anime-content'className='text-xl  mt-10 left-0 right-0 m-auto p-4  h-full leading-8  text-white' >{anime.animeContent}</p>

                </div>

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


