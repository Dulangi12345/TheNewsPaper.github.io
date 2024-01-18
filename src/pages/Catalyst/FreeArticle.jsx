import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import Footer from "../../layout/footer";

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
    return (
      <div className="flex items-center justify-center">
        <p className="text-md">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="lg:mx-32 mt-10">
        <div className="flex flex-wrap ">
          <div className="p-2">
            <div className="rounded-md p-4">
              <div>
                <h1
                  className="font-bold text-5xl text-center  mb-3"
                  id="article-title"
                >
                  {article.title}
                </h1>
              </div>
              <h3 className=" text-xl italic text-center mb-10 ">
                by {article.author}
              </h3>

              <img
                src={article.image1}
                alt=""
                id="free-article-header-image"
                className="w-full lg:h-[800px] object-fill mt-4"
              />

              <div
                className="flex flex-col mt-14 gap-6 text-xl text-gray-700  "
                id="article-content"
              >
                {paragraphs.map((paragraph, index) => {
                  return (
                    <p style={{ whiteSpace: "pre-line" }} key={index}>
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              <div
                className="flex lg:flex-row flex-col w-full justify-evenly mt-20"
                id="free-articles-sub-images-section"
              >
                <img
                  src={article.image2}
                  alt=""
                  id="free-articles-sub-images"
                  className="w-[500px] lg:h-[500px] h-[300px] m-auto left-0 right-0"
                />
                <img
                  src={article.image3}
                  alt=""
                  id="free-articles-sub-images"
                  className="w-[500px] lg:h-[500px]  h-[300px] m-auto left-0 right-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreeArticle;
