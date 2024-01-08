import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import { style } from "@mui/system";
import { getAuth } from "firebase/auth";


const PlayQuiz = () => {
    const [quizNames, setQuizNames] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizName, setQuizName] = useState('');
    const [correctAnswerText, setCorrectAnswerText] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const auth = getAuth();



    const FetchQuizName = async () => {
        try {
            const collectionRef = collection(db, 'Quiz');
            const Docs = await getDocs(collectionRef);
            const quizNames = Docs.docs.map(doc => doc.data().title);
            setQuizNames(quizNames);
            // console.log('quiz names ', quizNames);
        } catch (error) {
            console.log('error fetching quiz names ', error);
        }
    };

    const fetchTheQuiz = async (quizName) => {
        try {
            const collectionRef = collection(db, 'Quiz');
            const querySnapshot = await getDocs(collectionRef);
            const quizData = querySnapshot.docs.find(doc => doc.data().title === quizName)?.data();
            if (quizData) {
                setQuizQuestions(quizData.questions);
                // setCorrectAnswerIndices(quizData.questions.map(question => question.correctAnswerIndex));
                setCorrectAnswerIndices(quizQuestions.map(question => question.
                    answers[question.correctAnswerIndex]));
                // console.log('correct answer indices ', correctAnswerIndices);
                setQuestionCount(quizData.questions.length);
                setQuizName(quizName);
            }
        } catch (error) {
            console.log('Error fetching quiz:', error);
        }
    };



    const CheckIfCorrect = async ({ answer, questionIndex, quizName }) => {
        console.log('answer ', answer);
        try {
            const collectionRef = collection(db, 'Quiz');
            const querySnapshot = await getDocs(collectionRef);
            const quizData = querySnapshot.docs.find(doc => doc.data().title === quizName)?.data();
            if (quizData) {
                setQuizQuestions(quizData.questions);

                setQuestionCount(quizData.questions.length);
                setQuizName(quizName);
            }
        } catch (error) {
            console.log('Error fetching quiz:', error);
        }
        const isCorrect = correctAnswerIndices[questionIndex] === answer;
        if (isCorrect) {
            Score();
            handleNextQuestion();
            // console.log('correct answer');
        } else {
            // console.log('wrong answer');
            handleNextQuestion();
        }
        setIsAnswerSubmitted(true);
    };


    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        //check if game is over
        if (currentQuestionIndex === questionCount - 1) {
            // console.log('game over');
            setGameOver(true);
        }

    };

    const replayQuiz = () => {
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameOver(false);
    };

    const skipQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };



    const Score = () => {

        try {
            setScore(prevScore => prevScore + 1);
            // console.log('score ', score + 1);
           
            

            


        } catch (error) {
            console.log('error adding score ', error);
        }

    };

   

    const fetchData = async () => {
        try {
            const collectionRef = collection(db, 'Quiz');
            const Docs = await getDocs(collectionRef);
            const quizData = Docs.docs.find(doc => doc.data().title === quizName)?.data();
            if (quizData) {
                setQuizQuestions(quizData.questions);
                setCorrectAnswerIndices(quizData.questions.map(question => question.answers[question.correctAnswerIndex]));
                setQuestionCount(quizData.questions.length);
                setQuizName(quizName);
                // console.log('Fetched quiz questions:', quizData.questions, correctAnswerIndices);
            }
        } catch (error) {
            console.log('Error fetching quiz:', error);
        }
    };


    useEffect(() => {
        FetchQuizName();
   

        if (quizName) {
            fetchData();
        }
    }, [quizName]);

    // useEffect(() => {

    //     console.log(correctAnswerIndices);
    //     FetchQuizName();
    // }, [correctAnswerIndices]);

    return (
        <div className="flex lg:flex-row flex-col gap-8 m-10">



            <div className="w-full p-8  " >
                <h1 className="text-5xl text-[#116D6E]"  id="quiz-heading"> Put your knowledge to the test</h1>
                <p className="text-2xl mt-4 " id="quiz-heading">Are you the number one anime fan ?!</p>
                {quizNames.map((quizName, index) => (
                    <div key={index}
                    >
                        <ul id="quiz-names-list">
                            <li>
                                <button onClick={() => fetchTheQuiz(quizName)}
                                    id="quiz-name"
                                    className="rounded-full w-1/3 text-white text-wrap h-16  flex justify-center items-center m-4 bg-[#116D6E] text-xl hover:bg-[#A21232] hover:shadow-lg "

                                >{quizName}</button>
                            </li>
                        </ul>

                    </div>
                ))}

            </div>

            <div id="quiz-Content" className="w-full h-[700px]" >
                {quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length && (
                    <div key={currentQuestionIndex}
                    >
                        <div className=" ">


                            <h1 className="text-2xl font-bold p-2 ">{quizQuestions[currentQuestionIndex].question}</h1>

                            <div className="flex flex-col max-w-lg sm:max-w-lg ">
                                {quizQuestions[currentQuestionIndex].answers.map((answer, answerIndex) => (
                                    <div key={answerIndex} id="button-wrapper" className="flex flex-col justify-evenly ">

                                        <input
                                            id={`answer-${answerIndex}`}
                                            type="checkbox"
                                            value={answer}
                                            className=" peer hidden"
                                            checked={selectedAnswer === answer}
                                            onChange={() => {
                                                setSelectedAnswer(answer);
                                            }}
                                        />
                                        <label
                                            htmlFor={`answer-${answerIndex}`}
                                            id="custom-checkbox-label"
                                            className="select-none cursor-pointer rounded-full border-2 border-black m-2 bg-white
                                        py-6 px-6 font-bold text-black transition-colors duration-200 ease-in-out peer-checked:bg-teal-600 peer-checked:text-white peer-checked:border-gray-200"
                                        >
                                            {answer}
                                        </label>
                                        {/* <label
                                        id="custom-checkbox-label "

                                    >
                                        <input
                                            type="checkbox"
                                            value={answer}

                                            class=""
                                            checked={selectedAnswer === answer}
                                            onChange={() => {
                                                setSelectedAnswer(answer)
                                            }
                                            }

                                        />
                                        {answer}
                                    </label> */}
                                    </div>
                                ))}
                            </div>


                            <div className="flex flex-row ">
                                <button
                                    className="bg-[#116D6E] text-white text-lg rounded-full w-44  h-16  flex justify-center items-center m-4 "
                                    onClick={() => {
                                        CheckIfCorrect(
                                            {
                                                answer: selectedAnswer,
                                                questionIndex: currentQuestionIndex,
                                                quizName: quizName,

                                            }


                                        )
                                    }
                                    }

                                >Submit</button>
                                <button
                                        className="bg-[#A21232] text-white text-lg rounded-full w-44  h-16  flex justify-center items-center m-4 "
                                    onClick={skipQuestion}>Skip</button>
                            </div>
                        </div>
                    </div>
                )}

                {
                    gameOver && (
                        <div className="text-center bg-white shadow-md p-12 border-2 border-black rounded-lg">
                        {quizQuestions.length > 0 && currentQuestionIndex === quizQuestions.length && (
                            <div>
                                <h1 className="font-bold text-5xl ">Quiz Completed !</h1>
                                <h1 className="font-bold text-3xl ">Your score is {score}/ {questionCount}
                                </h1>
                                <button 
                                className="bg-[#4D455D] text-white rounded-full w-44 h-16 m-4  hover:bg-[#E96479] hover:shadow-lg hover:translate-y-2 "
                                onClick={replayQuiz}>Replay Quiz</button>
                            </div>
                        )}
                    </div>
                    )
                }

              

            </div>






        </div>
    );

};

export default PlayQuiz;
