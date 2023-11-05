import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import Footer from '../../layout/footer';


const FreeArticle = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const paragraphs = article?.content.split(/\n\s*\n/);





  useEffect(() => {
    const fetchArticle = async () => {
      const docRef = doc(db, "CatalystFreeArticles", articleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div>Loading...</div>;
  }




  return (
    <div className="flex flex-col">
      <div className="flex flex-col m-24 gap-6 ">
        <h1 className="font-bold text-5xl text-center font-['PT Serif']" id="free-article-title">{article.title}</h1>
        <h3 className=" text-2xl italic text-center">
          by Shelly Adams
        </h3>
      </div>





      <img src={article.image1} alt="" id="free-article-header-image" className="w-full p-24 h-[800px] object-fill" />


      <div className="flex flex-col m-24 gap-6  text-xl font-['PT Serif'] lg:mx-56  " id="article-content">
        {paragraphs.map((paragraph, index) => {
          return <p key={index}>{paragraph}</p>;
        })}
      </div>
      
      <div className="flex lg:flex-row flex-col w-full justify-evenly  " id="free-articles-sub-images-section">
        <img src={article.image2} alt="" id="free-articles-sub-images" className="w-[500px] h-[500px] m-auto left-0 right-0" />
        <img src={article.image3} alt="" id="free-articles-sub-images" className="w-[500px] h-[500px] m-auto left-0 right-0"  />


      </div>


      <Footer />



    </div>
  );
};

export default FreeArticle;
