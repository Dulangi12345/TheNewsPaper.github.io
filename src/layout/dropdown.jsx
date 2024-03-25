import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection , query  , getDocs } from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";

const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate(); 


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const handleSelectedArticle = (index) => {
        setSelectedIndex(index);
        setIsOpen(false);
        const articleId = articles[index].id;
        console.log(articleId);
        navigate(`/catalyst/free-articles/${articleId}`);
        
     };


    useEffect(() => {
        fetchArticleIndices();
    }, []);


    const fetchArticleIndices = async () => {
        try {

            const collectionReference = collection(db, "CatalystFreeArticles");
            const querySnapshot = await getDocs(collectionReference);

            const articles = [];
            querySnapshot.forEach((doc) => {
                const article = doc.data();
                article.id = doc.id;
                articles.push(article);
            });

            setArticles(articles);
  
        } catch (error) {
            console.log(error); 
        }


    }

 


    return (
        <div className="relative">
            <button
                id="dropdownDefaultButton"
                className=" focus:outline-none  rounded-lg    text-center inline-flex items-center hover:underline block rounded-md px-3 py-1  font-bold"
                type="button"
                onClick={toggleDropdown} // Toggle dropdown visibility on button click
            >
                Free Articles{" "}
                <svg
                    className={`w-2.5 h-2.5 ml-2.5 transform transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="z-10 absolute top-full left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                     {
                            articles.map((article, index) => (
                                <li key={article.id} className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                  
                                    <Link
                                        className={`block px-5 py-3 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedIndex === index ? "bg-gray-100 dark:bg-gray-600" : ""
                                            }`}
                                        to={`/catalyst/free-articles/${article.id}`}
                                        onClick={() => handleSelectedArticle(index)}
                                    >
                                        {article.title}
                                        
                                    </Link>
                                 

                                </li>
                            ))
                     }
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;