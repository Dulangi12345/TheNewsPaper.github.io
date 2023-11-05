import React, { useState } from 'react';
import PlayQuiz from './PlayQuiz';
import { db } from '../../firebase';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore/lite';
import { addDoc, getDocs } from 'firebase/firestore/lite';
import { useEffect } from 'react';
import { set } from 'mongoose';



const Quiz = () => {

    const [quiz, setQuiz] = useState([])
    const [questions, setQuestions] = useState([]);
    const [quizTitle, setQuizTitle] = useState('')
    const [quizDescription, setQuizDescription] = useState('')
    const [questionAnswers, setQuestionAnswers] = useState([])
    const [correctAnswers, setCorrectAnswers] = useState([])
    const [isCreateQuizClicked, setIsCreateQuizClicked] = useState(false)
    const [editedQuestions, setEditedQuestions] = useState(
       []
    );
    const [editedAnswers, setEditedAnswers] = useState([]); 
    const [editedCorrectAnswer, setEditedCorrectAnswer] = useState('')
    const [editedQuiz, setEditedQuiz] = useState([])
    const [isEditClicked, setIsEditClicked] = useState(false)
    const [newCorrectAnswerIndex, setNewCorrectAnswerIndex] = useState(0);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswers, setNewAnswers] = useState([{ id: 0, text: '' }]);
    const [answerIdCounter, setAnswerIdCounter] = useState(1);
    const [isAddNewQuestionClicked, setIsAddNewQuestionClicked] = useState(false)





    const [quizId, setQuizId] = useState('')

    const handleQuizTitleChange = (e) => {
        e.preventDefault();
        setQuizTitle(e.target.value)
        console.log(quizTitle)
    }

    const handleQuizDescriptionChange = (e) => {
        e.preventDefault();
        setQuizDescription(e.target.value)
    }



    const handleAddAQuestion = (e) => {
        e.preventDefault();
        setQuestions([...questions, ''])
        setQuestionAnswers([...questionAnswers, { answers: [], correctAnswerIndex: null }]);
        setCorrectAnswers([...correctAnswers, null]);
    }

    const handleQuestionInputChange = (index, e) => {
        setQuestions([...questions, ''])
        e.preventDefault();
        const updatedQuestions = [...questions];
        updatedQuestions[index] = e.target.value;
        setQuestions(updatedQuestions);
        console.log(updatedQuestions)

    }

    const handleAddAnswer = (questionIndex) => {
        const updatedAnswers = [...questionAnswers];
        updatedAnswers[questionIndex].answers.push('');
        setQuestionAnswers(updatedAnswers);
        console.log(updatedAnswers)
    };


    const handleAnswerInputChange = (questionIndex, answerIndex, e) => {

        const updatedAnswers = questionAnswers.map((question, index) => {
            if (index === questionIndex) {
                return {
                    ...question,
                    answers: question.answers.map((answer, index) => {
                        if (index === answerIndex) {
                            return e.target.value;
                        }


                        return answer;
                    })
                };
            }
            return question;
        });
        setQuestionAnswers(updatedAnswers);
        console.log(updatedAnswers)



    };


    const handleCorrectAnswerInputChange = (questionIndex, answerIndex) => {
        const updatedAnswers = questionAnswers.map((question, index) => {
            if (index === questionIndex) {
                return {
                    ...question,
                    correctAnswerIndex: answerIndex,
                    correctAnswerText: question.answers[answerIndex], // Store the answer text
                };
            }
            return question;
        });
        setQuestionAnswers(updatedAnswers);
        console.log(updatedAnswers)
    };


    const handleEditCorrectAnswerInputChange = (editedQuestion, index) => {

        console.log(editedQuestion)
        console.log(index)


    }


    const handleRemoveAnswer = (questionIndex, answerIndex) => {
        const updatedAnswers = questionAnswers.map((question, index) => {
            if (index === questionIndex) {
                return {
                    ...question,
                    answers: question.answers.filter((answer, index) => index !== answerIndex),
                    correctAnswerIndex: question.correctAnswerIndex === answerIndex ? null : question.correctAnswerIndex,
                };
            }
            return question;
        });
        setQuestionAnswers(updatedAnswers);
        console.log(updatedAnswers)
    };


    const submitQuiz = async (e) => {
        e.preventDefault();
        console.log(questionAnswers)
        console.log(questions)
        console.log(correctAnswers)
        console.log(quizTitle)
        console.log(quizDescription)
        const quiz = {

            title: quizTitle,
            quizId: quizTitle,
            description: quizDescription,
            questions: questionAnswers.map((question) => ({

                question: questions[questionAnswers.indexOf(question)],
                answers: question.answers,
                correctAnswerIndex: question.correctAnswerIndex,
                correctAnswerText: question.answers[question.correctAnswerIndex],
            })),
        };
        setQuiz(quiz)
        console.log(quiz)

        //validate the form before submitting

        const emptyAnswers = questionAnswers.some((question) =>
            question.answers.some((answer) => answer.trim() === '')
        );

        if (quizTitle === '') {
            alert('Please enter a title for the quiz')
        } else if (quizDescription === '') {
            alert('Please enter a description for the quiz')
        } else if (questions.length === 0) {
            alert('Please add at least one question')
        } else if (questionAnswers.length === 0) {
            alert('Please add at least one answer')
        } else if
            (questionAnswers.map((question) => question.correctAnswerIndex).includes(null)) {
            alert('Please select a correct answer for each question')
        } else if
            (questionAnswers.map((question) => question.answers).includes('')) {
            alert('Please enter an answer for each question')
        } else if (emptyAnswers) {
            alert('Answer fields cannot be empty')

        } else {
            try {
                const collectionRef = collection(db, 'Quiz');
                const docRef = await addDoc(collectionRef, quiz);
                console.log('Document written with ID: ', docRef.id);
                alert('Quiz created successfully')



            } catch (error) {
                console.log(error)

            }


        }


    }

    const fetchQuizzes = async () => {
        const collectionRef = collection(db, 'Quiz');
        const snapshot = await getDocs(collectionRef);
        const quizzes = snapshot.docs.map(doc => doc.data());
        setQuiz(quizzes)

    };


    useEffect(() => {
        fetchQuizzes()
    }, [])


    const handleAddAnotherAnswer = () => {
        setNewAnswers([...newAnswers, { id: answerIdCounter, text: '' }]);
        setAnswerIdCounter(answerIdCounter + 1);
    };


    const handleAddAnotherAnswerInputChange = (index, e) => {

        const updatedAnswers = [...editedAnswers];
        updatedAnswers[index] = e.target.value;
        setEditedAnswers(updatedAnswers);
        console.log(updatedAnswers)
    }


    const handleAddAQuestionEdit = (e) => {
        e.preventDefault();


        console.log(editedQuiz)
    };




    // const handleNewQuestionChange = (e) => {
    //     setNewQuestion(e.target.value);
    // };




    const handleNewAnswerChange = (index, e, newQuestion) => {
        console.log(index)
        console.log(newQuestion)
        const updatedAnswers = [...newAnswers];
        updatedAnswers[index] = e.target.value;
        setNewAnswers(updatedAnswers);
        console.log(updatedAnswers)
    };

    const handleAddNewAnswer = () => {
        setNewAnswers([...newAnswers, '']);
    };

    const handleRemoveNewAnswer = (id) => {
        const updatedAnswers = newAnswers.filter((answer) => answer.id !== id);
        setNewAnswers(updatedAnswers);
    };


    const handleSelectNewCorrectAnswer = (index) => {
        setNewCorrectAnswerIndex(index);
    };

    const handleAddNewQuestion = () => {
        if (newQuestion.trim() === '') {
            alert('Please enter a question');
            return;
        }

        // Add the new question to the edited quiz
        const updatedQuiz = {
            ...editedQuiz,
            questions: [
                ...editedQuiz.questions,
                {
                    question: newQuestion,
                    answers: newAnswers,
                    correctAnswerIndex: newCorrectAnswerIndex,
                    correctAnswerText: newAnswers[newCorrectAnswerIndex], // Store the correct answer text
                },
            ],
        };

        console.log(updatedQuiz)

        setEditedQuiz(updatedQuiz);
        setNewQuestion('');
        setNewAnswers(['']);
        setNewCorrectAnswerIndex(0);
    };

    const handleEditQuestion = (e, index) => {
        const updatedQuestions = [...editedQuestions];
        updatedQuestions[index] = e.target.value;
        setEditedQuestions(updatedQuestions);
        console.log(editedQuestions)
       
    };

    const handleEditAnswer = (e , index , question) => {
        console.log(index)
        console.log(question)
        const updatedAnswers = [...editedAnswers];
        updatedAnswers[question.answers.index] = e.target.value;
        setEditedAnswers(updatedAnswers);

    }


    const handleEditQuiz = (selectedQuiz) => {
        setEditedQuiz(selectedQuiz);
        setEditedQuestions(selectedQuiz.questions.map((question) => question.question));
        setEditedAnswers(selectedQuiz.questions.map((question) => question.answers));
        setEditedCorrectAnswer(selectedQuiz.questions.map((question) => question.correctAnswerIndex));
        setIsEditClicked(true);

    };

    const updateQuiz = async (e) => {
        e.preventDefault();
        console.log(editedQuiz)
        console.log(editedQuestions)
        console.log(editedAnswers)
        console.log(editedCorrectAnswer)

        const updatedQuiz = {
            ...editedQuiz,
            questions: editedQuiz.questions.map((question, index) => ({
                question: editedQuestions[index],
                answers: editedAnswers[index],
                correctAnswerIndex: editedCorrectAnswer[index],
                correctAnswerText: editedAnswers[index][editedCorrectAnswer[index]], // Store the correct answer text
            })),
        };

        console.log(updatedQuiz)

        try {
            const collectionRef = collection(db, 'Quiz');
            const q = query( collectionRef , where('quizId', '==', updatedQuiz.quizId));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            }
            );

            const docRef = doc(db, 'Quiz', querySnapshot.docs[0].id);
            await updateDoc(docRef, updatedQuiz);
            alert('Quiz updated successfully')
            



        }
        catch (error) {
            console.log(error)
        }
        


    }


    return (
        <div>

            <PlayQuiz />

            {/* Display Quizzes */}

            <div>
                {
                    quiz.map((selectedQuiz, index) => (
                        <div key={index} className='border-2 border-black p-6 ' id={selectedQuiz.quizId}>
                            <h1>Title: {quiz.title}</h1>
                            <h3>Description: {quiz.description}</h3>
                            <h3>Questions </h3>
                            {selectedQuiz.questions.map((question, questionIndex) => (
                                <div key={questionIndex}>
                                    <h4>{question.question}</h4>
                                    <h5>Answers</h5>
                                    <div>
                                        {
                                            question.answers.map((answer, index) => (
                                                <div key={index}>
                                                    <label htmlFor={`answer${index + 1}`}>{`Answer ${index + 1}`}</label>

                                                    <input
                                                        key={index}
                                                        className='border-black border-2 m-3'
                                                        type="text"
                                                        value={question.answers[index]}
                                                        name={`answer${index + 1}`}
                                                        onChange={(e) => {
                                                            handleAddAnotherAnswerInputChange(index, e)
                                                        }}

                                                    />

                                                </div>
                                            ))
                                        }
                                    </div>
                                    <h5 className='mt-4 '>Correct Answer</h5>
                                    <p>{question.correctAnswerText}</p>
                                </div>
                            ))}
                            <button
                                className='bg-green-400 p-2'
                                onClick={() => {
                                    // setIsEditClicked(!isEditClicked)
                                    // setEditedQuiz(quiz);

                                    handleEditQuiz(selectedQuiz)
                                    // Show the edit form or toggle a modal here
                                }}>
                                Edit
                            </button>
                        </div>
                    ))
                }


            </div>

            {/*Edit form  */}

            {isEditClicked ?
                <div key={quiz}>
                    <form className='bg-gray-200 flex flex-col '>
                        <div>
                            <button type="submit" onClick={
                                (e) => {
                                    e.preventDefault();
                                    setIsAddNewQuestionClicked(!isAddNewQuestionClicked)
                                }
                            } className='bg-cyan-500 p-4 text-white m-2 '>
                                {isAddNewQuestionClicked ? 'Cancel' : 'Add New Question'}
                            </button>

                            {
                                isAddNewQuestionClicked ? (
                                    <div>
                                        <label htmlFor="newQuestion">
                                            New Question
                                        </label>
                                        <input
                                            type="text"
                                            className='border-2 border-black m-3'
                                            id='newQuestion'
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                        />

                                        <div>
                                            {newAnswers.map((answer, index) => (
                                                <div key={index}>
                                                    <label htmlFor={`newAnswer${index}`}>{`Answer ${index + 1}`}</label>
                                                    <input
                                                        type="text"
                                                        className='border-2 border-black m-3'
                                                        id={`newAnswer${index}`}
                                                        value={answer.text}
                                                        onChange={(e) =>
                                                            handleNewAnswerChange(
                                                                index,
                                                                e,
                                                                newQuestion


                                                            )}
                                                    />


                                                    <input
                                                        type="checkbox"
                                                        className='border-2 border-black m-3'
                                                        checked={newCorrectAnswerIndex === index}
                                                        onChange={() => {
                                                            handleSelectNewCorrectAnswer(index),
                                                                setEditedCorrectAnswer(parseInt(index))
                                                        }
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewAnswer(answer.id)}
                                                        className='bg-red-500 p-4 text-white m-2 '
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={handleAddNewAnswer}
                                                className='bg-cyan-500 p-4 text-white m-2 '
                                            >
                                                Add an answer
                                            </button>



                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                handleAddNewQuestion();
                                                setIsAddNewQuestionClicked(false);
                                            }}
                                            className='bg-cyan-500 p-4 text-white m-2 '
                                        >
                                            Save Question
                                        </button>
                                        {/* <button
                                type='button'
                                onClick={handleAddNewQuestion}
                                className='bg-cyan-500 p-4 text-white m-2 '
                            >
                                Add New Question
                            </button> */}

                                    </div>
                                ) : null
                            }

                            {/* input field to add a new question  */}

                            {/* <div>
                                <label htmlFor="newQuestion">New Question</label>
                                <input
                                    type="text"
                                    className='border-2 border-black m-3'
                                    id='newQuestion'
                                    value={newQuestion}
                                    onChange={handleNewQuestionChange}
                                />
                                <button
                                    type='button'
                                    onClick={handleAddNewQuestion}
                                    className='bg-cyan-500 p-4 text-white m-2'
                                >
                                    Add New Question
                                </button>
                            </div> */}

                        </div>
                        <label htmlFor="">Question</label>
                        {
                            editedQuiz.questions.map((question, index) => (
                                <div key={index}>
                                    <input
                                        key={index}
                                        className='border-black border-2 m-3'
                                        type="text"
                                        value={
                                            editedQuestions[index] 
                                        }
                                        name={`question${index + 1}`}
                                        onChange={(e) => {
                                            
                                            handleEditQuestion(e, index);
                                        }}
                                    />

                                    {/* <button
                                        type="button"
                                        onClick={() => setNewAnswerQuestionIndex(index)}
                                        className='bg-cyan-500 p-2 text-white m-2'
                                    >
                                        Add Another New Answer
                                    </button> */}

                                    {
                                        question.answers.map((answer, index ) => (
                                            <div key={index}>
                                                <label htmlFor={`answer${index + 1}`}>{`Answer ${index + 1}`}</label>

                                                <input
                                                    key={index}
                                                    className='border-black border-2 m-3'
                                                    type="text"
                                                    value={question.answers[index]}
                                                    
                                                    name={`answer${index + 1}`}
                                                    onChange={(e) => {
                                                        handleEditAnswer(e, index, question)
                                                    }}
                                                /> 


                                            </div>


                                        ))
                                    }
                                    {/*  continously be able to open input fileds to add new answers*/}


                                    {/* 
                                    <button
                                        type='submit'
                                        onClick={

                                            () => {
                                                handleAddAnotherAnswer()
                                            }
                                        }>
                                        Add an answer
                                    </button> */}

                                    <div>
                                        <label htmlFor=""></label>
                                        <select
                                            value={editedCorrectAnswer}
                                            onChange={(e) => {
                                                setEditedCorrectAnswer(parseInt(e.target.value))
                                                handleEditCorrectAnswerInputChange(
                                                    question,
                                                    parseInt(e.target.value)
                                                )
                                            }

                                            }
                                        >
                                            {question.answers.map((answer, index) => (
                                                <option key={index} value={index}

                                                >
                                                    {question.answers[index]}

                                                </option>
                                            ))}
                                        </select>


                                    </div>




                                </div>


                            ))



                        }



                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                updateQuiz(e)
                            }
                        }>
                            update  Quiz
                        </button>

                        <button>
                            Delete Quiz
                        </button>

                    </form>
                </div> : null}







            <div>
                <button onClick={
                    () => setIsCreateQuizClicked(!isCreateQuizClicked)
                } className='bg-cyan-500 p-4 text-white m-2 '>
                    {isCreateQuizClicked ? 'Cancel' : 'Create Quiz'}


                </button>
            </div>

            <div>
                {/* Add Quiz */}

                {isCreateQuizClicked ? <div>



                    <form action="" className='border-2 border-black p-6 '>
                        <div>
                            <label htmlFor="quizTitle">Title</label>
                            <input type="text" className='border-2 border-black m-3 '
                                onChange={handleQuizTitleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="quizDescription">Description</label>
                            <input type="text" className='border-2 border-black m-3 '
                                onChange={handleQuizDescriptionChange}
                            />
                        </div>

                        {questions.map((question, questionIndex) => (
                            <div key={questionIndex}>
                                <label htmlFor={`question${questionIndex + 1}`}>{`Question ${questionIndex + 1}`}</label>
                                <input
                                    className='border-2 border-black m-3'
                                    type="text"
                                    id={`question${questionIndex + 1}`}
                                    value={question}
                                    onChange={(e) => handleQuestionInputChange(questionIndex, e)}
                                />

                                {questionAnswers[questionIndex].answers.map((answer, answerIndex) => (
                                    <div key={answerIndex}>
                                        <label htmlFor={`answer${answerIndex + 1}`}>{`Answer ${answerIndex + 1}`}</label>
                                        <input
                                            className='border-2 border-black m-3'
                                            type="text"
                                            value={answer}
                                            id={`answer${answerIndex + 1}`}
                                            onChange={(e) => handleAnswerInputChange(questionIndex, answerIndex, e)}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
                                            className='bg-red-500 p-4 text-white m-2 '
                                        >
                                            Remove
                                        </button>


                                        <input
                                            type="checkbox"
                                            className='border-2 border-black m-3'
                                            checked={questionAnswers[questionIndex].correctAnswerIndex === answerIndex}
                                            onChange={() => handleCorrectAnswerInputChange(questionIndex, answerIndex)}
                                        />

                                    </div>
                                ))}


                                <button
                                    type="button"
                                    onClick={() => handleAddAnswer(questionIndex)}
                                    className='bg-cyan-500 p-4 text-white m-2 '
                                >
                                    Add an answer
                                </button>
                            </div>
                        ))}

                        <div>
                            <button type="submit" onClick={handleAddAQuestion} className='bg-cyan-500 p-4 text-white m-2 '>
                                Add a question
                            </button>
                        </div>


                        <div>
                            <button type="submit" onClick={submitQuiz} className='bg-cyan-500 p-4 text-white m-2 '>
                                Create Quiz
                            </button>
                        </div>

                    </form>
                </div> : null}

            </div>
        </div>
    );


}


export default Quiz;