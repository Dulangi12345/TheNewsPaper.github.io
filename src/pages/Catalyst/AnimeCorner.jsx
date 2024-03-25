import { collection, query, orderBy, getDocs } from "firebase/firestore/lite";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebase";
import PlayQuiz from "./../../admin/Catalyst/PlayQuiz";
import Footer from "../../layout/footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { color, easeInOut, motion, useScroll } from "framer-motion";

const AnimeCorner = () => {
  const [anime, setAnime] = useState([]);
  const [user, setUser] = useState("");

  const fetchAnimes = async () => {
    try {
      const collectionReference = collection(db, "AnimeCorner");

      //order using the AnimeOrder field
      const orderedAnimes = query(collectionReference, orderBy("animeOrder"));
      const animeList = getDocs(orderedAnimes);
      const animeListData = await animeList;
      setAnime(animeListData.docs.map((doc) => doc.data()));
      console.log(animeListData.docs.map((doc) => doc.data()));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  return (
    <div>
      <motion.div
        initial={{ y: "30%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: easeInOut, repeat: Infinity }}
      >
        <h1 className="font-bold text-6xl m-20 text-center " id="anime-heading">
          Top 5 animes of the month
        </h1>
      </motion.div>

      <div className="text-center" id="anime-heading">
        <p className="text-2xl m-16  ">
          Welcome to our anime corber, where we bring you the pulse of the anime
          world in real-time! Dive into the vibrant universe of Japanese
          animation with our carefully curated collection of the most trending
          and popular anime series of the moment. Whether you're a seasoned
          fanatic or a newcomer exploring the wonders of anime, our webpage is
          your go-to source for the latest and hottest titles captivating
          audiences worldwide. Stay in the loop, discover new favorites as we
          spotlight the top picks that are currently dominating the scene.
        </p>
      </div>

      <div className="anime-list ">
        <div className="anime flex flex-col gap-8">
          {anime.map((anime) => (
            <div
              className="anime-name flex lg:flex-row flex-col  lg:h-[600px] "
              key={anime.animeName}
              style={{
                backgroundColor: anime.animeColor,
              }}
              id="anime"
            >
              <div className="flex lg:flex-row flex-col">
                <motion.div className=" w-1/2 h-full "
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          style={{ x: 100 }}
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transform: "translateX(60)",
            transition: { duration: 2.1 },
          }}
                >
                <img
                  src={anime.animeImage}
                  alt="anime image"
                  className="object-contain  w-full h-full p-2"
                />
                </motion.div>
                
                <motion.div
                  className="flex lg:flex-col flex-col text-center lg:w-2/3 p-16"
                  initial={{ opacity: 0 }}
                  whileInView={{
                    opacity: 1,
                    transform: "translateX(60)",
                    transition: { duration: 2.1 },
                  }}
                >
                  <div>
                    <h3
                      className="text-6xl font-bold lg:text-center mt-8 text-white"
                      style={{
                        color: anime.animeColor,
                      }}
                      id="anime-name"
                    >
                      {anime.animeName}
                    </h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: anime.animeContent,
                      }}
                      id="anime-content"
                      className="text-xl  left-0 right-0 m-auto p-4  h-full leading-8  text-white "
                    ></p>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}

          <div className="">
            <PlayQuiz />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnimeCorner;
