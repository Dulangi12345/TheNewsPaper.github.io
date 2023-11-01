import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";

const FreeArticle = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

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
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <img src={article.image1} alt="" />
      <img src={article.image2} alt="" />
      <img src={article.image3} alt="" />
      {/* Render other details */}
    </div>
  );
};

export default FreeArticle;
