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
    const [quizId, setQuizId] = useState([]);



    const FetchQuizName = async () => {
        try {
            const collectionRef = collection(db, 'Quiz');
            const Docs = await getDocs(collectionRef);
            const quizNames = Docs.docs.map(doc => doc.data().title);
            setQuizNames(quizNames);
            console.log('quiz names ', quizNames);
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
                setCorrectAnswerIndices(quizData.questions.map(question => question.correctAnswerIndex));
                setQuestionCount(quizData.questions.length);
                console.log('Fetched quiz questions:', quizData.questions);
            }
        } catch (error) {
            console.log('Error fetching quiz:', error);
        }
    };



    const CheckIfCorrect = async (selectedAnswer , quizName) => {

        try {
            const collectionRef = collection(db, 'Quiz');
            const querySnapshot = await getDocs(collectionRef);
            const quizData = querySnapshot.docs.find(doc => doc.data().title === quizName)?.data();
            if (quizData) {
                setQuizQuestions(quizData.questions);
                setCorrectAnswerIndices(quizData.questions.map(question => question.correctAnswerIndex));
                setQuestionCount(quizData.questions.length);
                console.log('Fetched quiz questions:', quizData.questions);
            }
        } catch (error) {
            console.log('Error fetching quiz:', error);
        }

        if (selectedAnswer.index === correctAnswerIndices.correctAnswerIndices) {
            console.log('correct answer');
            Score();
            handleNextQuestion();
        } else {
            console.log('wrong answer');
        }
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





    useEffect(() => {
        setCorrectAnswerIndices(quizQuestions.map(question => question.correctAnswerIndex));
        FetchQuizName();
    }, []);

    return (
        <div>
            <h1>Play Quiz</h1>


            <div>
                <h1>Quizzes</h1>
                {quizNames.map((quizName, index) => (
                    <div key={index}>
                        <button onClick={() => fetchTheQuiz(quizName)}
                            className="border-2  text-black p-4 "
                        >{quizName}</button>
                    </div>
                ))}

            </div>
            <div>
                {quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length && (
                    <div key={currentQuestionIndex}>
                        <h1>{quizQuestions[currentQuestionIndex].question}</h1>
                        <div>
                            {quizQuestions[currentQuestionIndex].answers.map((answer, answerIndex) => (
                                <div key={answerIndex}>
                                    <label>
                                        <input
                                            type="radio"
                                            value={answer}
                                            checked={selectedAnswer === answer}
                                            onChange={() => setSelectedAnswer(answer)}
                                        />
                                        {answer}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div>
                            <button onClick={() => CheckIfCorrect(
                                {
                                    answer: selectedAnswer,
                                    questionIndex: currentQuestionIndex,

                                    quizName: quizNames[currentQuestionIndex]

                                }
                               
                            )}>Submit</button>
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
