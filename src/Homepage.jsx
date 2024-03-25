import React, { useState } from "react";
import photo from "./assets/logo.png";
import photo2 from "./assets/kaguralogo.png";
import photo3 from "./assets/CTTlogo.png";
import Footer from "./layout/footer";
import DropdownMenu from "./layout/dropdown";
import { motion, useScroll } from "framer-motion";
import PaymentForm from "./components/PaymentForm";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const { scrollYprogress } = useScroll();
  const navigate = useNavigate();

 


  return (
    <motion.div
      className="flex flex-col "
      id="homepage-bg"
      style={{ scaleX: scrollYprogress }}
    >
      <p
        className="lg:text-7xl text-center text-black  w-2/3 m-auto  mt-16 w-full text-6xl "
        id="welcome-paragraph"
      >
        Welcome to the world of APIIT news
      </p>

      <div className="grid lg:grid-cols-2 md:gid-row-2 ">
        {/* <h1 >Main Homepage</h1>
            <h2>IDK What to say</h2> */}

        <div className="">
          <ul id="list-motto" className="lg:mt-20 mt-10 lg:text-left  text-center lg:text-6xl  text-5xl">
            <li className=" font-bold w-2/3 m-auto text-cyan-700  leading-snug fadeInLeft delay-1">
              Integrity
            </li>
            <li className=" font-bold w-2/3 m-auto text-red-600  leading-snug  fadeInLeft delay-2">
              Valor
            </li>
            <li className=" font-bold w-2/3 m-auto fadeInLeft leading-snug  delay-3">
              Dedication
            </li>
          </ul>

          <div className="flex flex-col">
            <p
              className="text-2xl text-center text-black w-2/3 m-auto mt-10"
              id="paragraph"
            >
              Subscribe to stay up to date on what's happening in APIIT and
              around the world. Read our articles and get to know about the
              latest news and events.
            </p>
            <button 
            //go to register page on click
            onClick={
              () => {
                navigate('/register');
              }
            }
            
            className="bg-none rounded-full border-2  border-black text-lg m-auto mt-10 p-4 w-2/3  ">
              Subscribe
            </button>
           
          </div>
        </div>

        <div className="">
          <img
            src={photo}
            alt="logo"
            className="m-auto lg:pt-24 w-full h-full"
          />
        </div>
      </div>

      <div className="m-auto w-full  lg:mt-48  ">
        <div className="">
          <div className="">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1, transform: "translateX(60)" , transition: { duration: 2.1 } }}
            >
              <div
                className="flex lg:flex-row bg-[#54d2b5]"
                id="Catalyst-section"
              >
                <div className="left-0 right-0 m-auto p-4 lg:h-[500px]  ">
                  <h1 className=" font-bold  text-5xl  text-white  pt-16 ml-4 ">
                    We Are..
                  </h1>

                  <p id="about-us-paragraph" className="text-2xl mt-4  p-3">
                    'The Catalyst,' official media club of APIIT - your dynamic
                    gateway to the world of news, awareness, and boundless
                    creativity! Armed with the sole duty of spreading the latest
                    news, we are not just a club; we are a vibrant force on
                    campus, creating an environment that blends awareness and
                    knowledge with a dash of fun. At 'The Catalyst,' we go
                    beyond the headlines, striving to be the pulse of APIIT by
                    delivering news in a way that's both informative and
                    entertaining. From quirky campus updates to insightful
                    features, we're here to keep you in the know with a smile on
                    your face. Join us in this journey of information,
                    creativity, and endless possibilities. 'The Catalyst' is not
                    just a club; it's a family where we work hard, play harder,
                    and always have a blast doing it. Embrace the fun side of
                    media with us and let's create memories, make headlines, and
                    be the spark that ignites change!
                  </p>

                  <button className="bg-none  rounded-full border-2  border-black text-lg p-2 mt-4 ">
                    <DropdownMenu />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          {/* <div className='h-96' id='section-xyz'> 

                          <div className='bg-black'>
                            <h1 className='text-4xl font-bold text-center '>The Catalyst</h1>
                          </div>

                       

                        </div> */}
          <div className="flex flex-col gap-8 mt-8" id="kagura-CTT-description">
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1, transform: "translateX(60)" , transition: { duration: 2.1 } }}
            >
            <div
              id="section"
              className="flex lg:flex-row flex-col bg-[#FF8080]"
            >
              <div className="m-auto left-0 right-0  ">
                <div className=" ">
                  <img src={photo3} alt="logo" className="h-96 w-96 lg:m-8" />
                </div>
              </div>

              <div className="w-full ">
                <h1 className=" font-bold text-center text-5xl pt-16 ">CTT</h1>
                <p id="about-us-paragraph" className=" p-9 text-xl   ">
                  Introducing "Catalyst Tea Time Live" APIIT's first ever talk
                  show that promises to be an exciting mix of dialogue, humor,
                  games and insights! Welcome to the talk show revolution at
                  APIIT! As we bring together the humor, insight, and warmth of
                  our college community, be ready for a game show unlike
                  anything you've ever experienced. Come for a meeting with
                  remarkable people who help to shape APIIT's colorful fabric.
                  "Catalyst Tea Time Live" is your place to see fascinating
                  conversations, gripping tales, and the occasional surprise
                  that will have you on the edge of your seat, featuring faculty
                  members, students, alumni, and special guests. Join us for
                  "Catalyst Tea Time Live" and get your virtual beverage.
                </p>
              </div>
            </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1, transform: "translateX(60)" , transition: { duration: 2.1 } }}
            >
            <div
              id="kagura-section"
              className="flex lg:flex-row flex-col bg-[#B6BBC4] "
            >
              <div className=" m-auto left-0 right-0 ">
                <div className=" ">
                  <img src={photo2} alt="logo" className="h-96 w-96 lg:m-8 " />
                </div>
              </div>

              <div className="w-full  ">
                <h1 className=" font-bold text-center text-5xl text-white  pt-16 ">
                  Kagura
                </h1>
                <p id="about-us-paragraph" className=" p-9 text-xl   ">
                  the interuniversity film festival, which is solely held at
                  Catalyst. This event is historic since APIIT is taking the
                  lead in creating a film festival unlike any other. Kagura
                  presents a boundary-pushing celebration that unites the joy of
                  filming, the wonder of cinematography, and the craft of
                  storytelling for the first time at APIIT. Kagura gives
                  filmmakers a stage on which to excel and experiment with
                  narrative conventions. We cordially invite you to share in the
                  birth of a cinematic tradition within our walls as Catalyst
                  sets new standards with Kagura. Prepare yourself for a feast
                  for the eyes, where tales are told, feelings are expressed,
                  and the essence of filmmaking shines through in every frame.
                  Kagura, where the reel comes to life and creativity is
                  highlighted.
                </p>
              </div>
            </div>
            </motion.div>


          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Homepage;
