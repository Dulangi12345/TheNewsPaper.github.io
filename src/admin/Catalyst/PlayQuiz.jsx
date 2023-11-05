import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import { set } from "mongoose";

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
    const  [ correctAnswerText , setCorrectAnswerText ] = useState([]);



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
                    console.log('correct answer indices ', correctAnswerIndices);
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
            console.log('correct answer');
        }else{
            console.log('wrong answer');
            handleNextQuestion();
        }
        setIsAnswerSubmitted(true);
    };


    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };

    const replayQuiz = () => {
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
    };

    const skipQuestion = () => {    
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    };



    const Score = () => {


        //initially score is 0
        //if answer is correct then score will be incremented by 1

        try {
            setScore(prevScore => prevScore + 1);
            console.log('score ', score + 1);

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
                console.log('Fetched quiz questions:', quizData.questions, correctAnswerIndices);
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
        <div className="flex flex-row ">
        


            <div className="" id='quiz-section'>
                <h1 className="font-bold text-3xl" > Put your knowledge to the test</h1>
                <p className="text-2xl m-2 ">Are you the number one anime fan ?!</p>
                {quizNames.map((quizName, index) => (
                    <div key={index}
                    >
                        <ul id="quiz-names-list">
                            <li>
                            <button onClick={() => fetchTheQuiz(quizName)}
                        id="quiz-name"
                        className="rounded-full w-44  h-16  flex justify-center items-center m-4 bg-black" 

                        >{quizName}</button>
                            </li>
                        </ul>
                     
                    </div>
                ))}

            </div>
            <div id="quiz-Content" className="w-full m-auto">
                {quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length && (
                    <div key={currentQuestionIndex}>
                        <h1>{quizQuestions[currentQuestionIndex].question}</h1>
                        <div>
                            {quizQuestions[currentQuestionIndex].answers.map((answer, answerIndex) => (
                                <div key={answerIndex} id="button-wrapper">
                                    <label 
                                     id="custom-checkbox-label "

                                         >
                                        <input
                                            type="checkbox"
                                            value={answer}
                                           
                                            className= ""
                                            checked={selectedAnswer === answer}
                                            onChange={() =>
                                                
                                                 {
                                                    setSelectedAnswer(answer)
                                                 }
                                            }
                                           
                                        />
                                        {answer}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div>
                            <button onClick={() => 
                            {
                            CheckIfCorrect(
                                {
                                    answer: selectedAnswer,
                                    questionIndex: currentQuestionIndex,
                                    quizName: quizName,

                                }

                               
                            )}
                            }
                            
                            >Submit</button>
                            <button onClick={skipQuestion}>Skip</button>
                        </div>
                    </div>
                )}

            </div>

            <div>
                {quizQuestions.length > 0 && currentQuestionIndex === quizQuestions.length && (
                    <div>
                        <h1>Quiz Completed</h1>
                        <h1>Score</h1>
                        <h1>{score}</h1>
                        <button onClick={replayQuiz}>Replay Quiz</button>
                    </div>
                )}
            </div>
        </div>
    );

};

export default PlayQuiz;
