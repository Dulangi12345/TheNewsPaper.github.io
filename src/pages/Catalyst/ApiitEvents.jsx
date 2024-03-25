import React, { useState, useEffect } from "react";
import { doc, collection, getDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { Container, Row, Col } from "react-grid-system";
import { Link } from "react-router-dom";
import Footer from "../../layout/footer";

const truncateString = (str, num) => {
  if (str) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "... ";
  }
};

const ApiitEvents = () => {
  const [ArticlesData, setArticlesData] = useState([
    { articleTitle: "", articleAuthor: "" , articleDescription: "", articleImage: "" },
  ]);
  const [Loading, setLoading] = useState(true);

  const firstArticleIndex = 0;
  const secondArticleIndex = 1;
  const thirdArticleIndex = 2;
  const fourthArticleIndex = 3;
  const fifthArticleIndex = 4;
  const sixthArticleIndex = 5;
  const seventhArticleIndex = 6;
  const eighthArticleIndex = 7;

  useEffect(() => {
    fetchArticleData();
  }, []);

  const fetchArticleData = async () => {
    try {
      const docRef = doc(db, "Catalyst", "ApiitEvents");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Assuming data is an object with numbered keys representing the articles
        const articlesArray = Object.keys(data).map((key) => data[key]);
        // Set the state using the fetched data
        setArticlesData(articlesArray);
        console.log("Document data:", articlesArray);
      } else {
        // doc.data() will be undefined in this case
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching article data: ", error);
      setError("Failed to fetch article data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="lg:mx-24 mt-24">
        {firstArticleIndex >= 0 &&
        secondArticleIndex >= 0 &&
        secondArticleIndex < ArticlesData.length ? (
          <Row>
            <Col md={8}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 flex items-center flex lg:flex-row flex-col ">
                  <div>
                    <Link
                      to={`/catalyst/apiit-events/${firstArticleIndex}`}
                    >
                      <div
                        className="font-bold text-3xl mb-2 hover:text-gray-600"
                        id="article-title"
                      >
                        {ArticlesData[firstArticleIndex].articleTitle}
                      </div>
                    </Link>
                    <h1 className='font-bold  mb-2'>by {ArticlesData[firstArticleIndex].articleAuthor}</h1>

                    <p
                      className="text-gray-700 text-base"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[firstArticleIndex].articleDescription,
                        590
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${firstArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                  
                  <img
                    className="md:w-80 h-52 ml-4 object-cover"
                    src={ArticlesData[firstArticleIndex].articleImage}
                    alt="Current Event"
                  />
                </div>
                <div className="border border-gray-400 mt-16"></div>
              </div>
            </Col>

            <Col md={4}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 items-center">
                  <div>
                    <Link
                      to={`/catalyst/apiit-events/${secondArticleIndex}`}
                    >
                      <div
                        className="font-bold text-3xl mb-2 hover:text-gray-600"
                        id="article-title"
                      >
                        {ArticlesData[secondArticleIndex].articleTitle}
                      </div>
                    </Link>
                    <h1 className='font-bold  mb-2'>by {ArticlesData[secondArticleIndex].articleAuthor}</h1>

                    <p
                      className="text-gray-700 text-base"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[secondArticleIndex].articleDescription,
                        300
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${secondArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                  <img
                    className="w-full md:h-56 object-cover mt-4"
                    src={ArticlesData[secondArticleIndex].articleImage}
                    alt="Current Event"
                  />
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Col>
            <div className="rounded overflow-hidden mb-6 h-96">
              <p className="text-3xl">Loading...</p>
            </div>
          </Col>
        )}

        {thirdArticleIndex >= 0 &&
        fourthArticleIndex >= 0 &&
        fourthArticleIndex < ArticlesData.length ? (
          <Row>
            <Col md={8}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 flex items-center flex lg:flex-row flex-col ">
                  <div>
                    <Link
                      to={`/catalyst/apiit-events/${thirdArticleIndex}`}
                    >
                      <div
                        className="font-bold text-3xl mb-2 hover:text-gray-600"
                        id="article-title"
                      >
                        {ArticlesData[thirdArticleIndex].articleTitle}
                      </div>
                    </Link>
                    <h1 className='font-bold  mb-2'>by {ArticlesData[thirdArticleIndex].articleAuthor}</h1>

                    <p
                      className="text-gray-700 text-base"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[thirdArticleIndex].articleDescription,
                        600
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${thirdArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                  <img
                    className="md:w-80 h-52 ml-4 object-cover"
                    src={ArticlesData[thirdArticleIndex].articleImage}
                    alt="Current Event"
                  />
                </div>
                <div className="border border-gray-400 mt-16"></div>
              </div>
            </Col>

            <Col md={4}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 items-center">
                  <div>
                    <Link
                      to={`/catalyst/apiit-events/${fourthArticleIndex}`}
                    >
                      <div
                        className="font-bold text-3xl mb-2 hover:text-gray-600"
                        id="article-title"
                      >
                        {ArticlesData[fourthArticleIndex].articleTitle}
                      </div>
                    </Link>
                    <h1 className='font-bold  mb-2'>by {ArticlesData[fourthArticleIndex].articleAuthor}</h1>

                    <p
                      className="text-gray-700 text-base"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[fourthArticleIndex].articleDescription,
                        300
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${fourthArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                  <img
                    className="w-full md:h-56 object-cover mt-4"
                    src={ArticlesData[fourthArticleIndex].articleImage}
                    alt="Current Event"
                  />
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Col>
            <div className="rounded overflow-hidden mb-6 h-96">
              <p className="text-3xl">Loading...</p>
            </div>
          </Col>
        )}

        {fifthArticleIndex >= 0 &&
        sixthArticleIndex >= 0 &&
        sixthArticleIndex < ArticlesData.length ? (
          <Row>
            <Col md={8}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 flex items-center flex lg:flex-row flex-col ">
                  <div>
                    <Link
                      to={`/catalyst/apiit-events/${fifthArticleIndex}`}
                    >
                      <div
                        className="font-bold text-3xl mb-2 hover:text-gray-600"
                        id="article-title"
                      >
                        {ArticlesData[fifthArticleIndex].articleTitle}
                      </div>
                    </Link>
                    <h1 className='font-bold  mb-2'>by {ArticlesData[fifthArticleIndex].articleAuthor}</h1>

                    <p
                      className="text-gray-700 text-base"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[fifthArticleIndex].articleDescription,
                        600
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${fifthArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                  <img
                    className="md:w-80 h-52 ml-4 object-cover"
                    src={ArticlesData[fifthArticleIndex].articleImage}
                    alt="Current Event"
                  />
                </div>
                <div className="border border-gray-400 mt-16"></div>
              </div>
            </Col>

            <Col md={4}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 items-center">
                  <div>
                    <Link
                      to={`/catalyst/apiit-events/${sixthArticleIndex}`}
                    >
                      <div
                        className="font-bold text-3xl mb-2 hover:text-gray-600"
                        id="article-title"
                      >
                        {ArticlesData[sixthArticleIndex].articleTitle}
                      </div>
                    </Link>
                    <h1 className='font-bold  mb-2'>by {ArticlesData[sixthArticleIndex].articleAuthor}</h1>

                    <p
                      className="text-gray-700 text-base"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[sixthArticleIndex].articleDescription,
                        300
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${sixthArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                  <img
                    className="w-full md:h-56 object-cover mt-4"
                    src={ArticlesData[sixthArticleIndex].articleImage}
                    alt="Current Event"
                  />
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Col>
            <div className="rounded overflow-hidden mb-6 h-96">
              <p className="text-3xl">Loading...</p>
            </div>
          </Col>
        )}

        {seventhArticleIndex >= 0 &&
        eighthArticleIndex >= 0 &&
        eighthArticleIndex < ArticlesData.length ? (
          <Row className="mt-12">
            <Col md={6}>
              <div className="rounded overflow-hidden mb-6 lg:border-r-2 pr-4">
                <div className="px-6 py-4 items-center ">
                  <Link
                    to={`/catalyst/apiit-events/${seventhArticleIndex}`}
                  >
                    <div
                      className="font-bold text-3xl mb-2 hover:text-gray-600"
                      id="article-title"
                    >
                      {ArticlesData[seventhArticleIndex].articleTitle}
                    </div>
                  </Link>
                  <h1 className='font-bold  mb-2'>by {ArticlesData[seventhArticleIndex].articleAuthor}</h1>


                  <div className="flex  lg:flex-row flex-col">
                    <img
                      className="md:w-72 h-64 object-cover"
                      src={ArticlesData[seventhArticleIndex].articleImage}
                      alt="Current Event"
                    />

                    <p
                      className="text-gray-700 text-base ml-4"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[seventhArticleIndex].articleDescription,
                        500
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${seventhArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="rounded overflow-hidden mb-6">
                <div className="px-6 py-4 items-center">
                  <Link
                    to={`/catalyst/apiit-events/${eighthArticleIndex}`}
                  >
                    <div
                      className="font-bold text-3xl mb-2 hover:text-gray-600"
                      id="article-title"
                    >
                      {ArticlesData[eighthArticleIndex].articleTitle}
                    </div>
                  </Link>
                  <h1 className='font-bold  mb-2'>by {ArticlesData[eighthArticleIndex].articleAuthor}</h1>

                  <div className="flex  lg:flex-row flex-col">
                    <img
                      className="md:w-72 h-64 object-cover"
                      src={ArticlesData[eighthArticleIndex].articleImage}
                      alt="Current Event"
                    />
                    
                    <p
                      className="text-gray-700 text-base ml-4"
                      id="article-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {truncateString(
                        ArticlesData[eighthArticleIndex].articleDescription,
                        500
                      )}
                      <Link
                        to={`/catalyst/apiit-events/${eighthArticleIndex}`}
                        className="text-blue-500"
                      >
                        Read More
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <Col>
            <div className="rounded overflow-hidden mb-6 h-96">
              <p className="text-md">Loading...</p>
            </div>
          </Col>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ApiitEvents;
