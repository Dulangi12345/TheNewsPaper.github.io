import React, { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  query,
  updateDoc,
  where,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import AdminSidebar from "../../layout/AdminSidebar";
import { set } from "mongoose";

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [isCreateQuizClicked, setIsCreateQuizClicked] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [editedAnswers, setEditedAnswers] = useState([]);
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState("");
  const [editedQuiz, setEditedQuiz] = useState([]);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [newCorrectAnswerIndex, setNewCorrectAnswerIndex] = useState(0);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([{ id: 0, text: "" }]);
  const [isAddNewQuestionClicked, setIsAddNewQuestionClicked] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [quizClicked, setQuizClicked] = useState(false);

  const handleQuizTitleChange = (e) => {
    e.preventDefault();
    setQuizTitle(e.target.value);
    console.log(quizTitle);
  };

  const handleQuizDescriptionChange = (e) => {
    e.preventDefault();
    setQuizDescription(e.target.value);
  };

  const handleAddAQuestion = (e) => {
    e.preventDefault();
    setQuestions([...questions, ""]);
    setQuestionAnswers([
      ...questionAnswers,
      { answers: [], correctAnswerIndex: null },
    ]);
    setCorrectAnswers([...correctAnswers, null]);
  };

  const handleQuestionInputChange = (index, e) => {
    setQuestions([...questions, ""]);
    e.preventDefault();
    const updatedQuestions = [...questions];
    updatedQuestions[index] = e.target.value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedAnswers = [...questionAnswers];
    updatedAnswers[questionIndex].answers.push("");
    setQuestionAnswers(updatedAnswers);
    console.log(updatedAnswers);
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
          }),
        };
      }
      return question;
    });
    setQuestionAnswers(updatedAnswers);
    console.log(updatedAnswers);
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
    console.log(updatedAnswers);
  };

  const handleEditCorrectAnswerInputChange = (editedQuestion, index) => {
    console.log(editedQuestion);
    console.log(index);
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const updatedAnswers = questionAnswers.map((question, index) => {
      if (index === questionIndex) {
        return {
          ...question,
          answers: question.answers.filter(
            (answer, index) => index !== answerIndex
          ),
          correctAnswerIndex:
            question.correctAnswerIndex === answerIndex
              ? null
              : question.correctAnswerIndex,
        };
      }
      return question;
    });
    setQuestionAnswers(updatedAnswers);
    // console.log(updatedAnswers);
  };

  const submitQuiz = async (e) => {
    e.preventDefault();

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
    setQuiz(quiz);

    //validate the form before submitting

    const emptyAnswers = questionAnswers.some((question) =>
      question.answers.some((answer) => answer.trim() === "")
    );

    if (quizTitle === "" || quizDescription === "") {
      alert("title and description cannot be empty");
      return;
    } else if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    } else if (questionAnswers.length === 0) {
      alert("Please add at least one answer");
      return;
    } else if (
      questionAnswers
        .map((question) => question.correctAnswerIndex)
        .includes(null)
    ) {
      alert("Please select a correct answer for each question");
      return;
    } else if (
      questionAnswers.map((question) => question.answers).includes("")
    ) {
      alert("Please enter an answer for each question");
      return;
    } else if (emptyAnswers) {
      alert("Answer fields cannot be empty");
      return;
    } else {
      try {
        const collectionRef = collection(db, "Quiz");
        const docRef = await addDoc(collectionRef, quiz);
        alert("Quiz created successfully");
        isCreateQuizClicked(false);
        setQuiz(quiz);
        fetchQuizzes();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchQuizzes = async () => {
    const collectionRef = collection(db, "Quiz");
    const snapshot = await getDocs(collectionRef);
    const quizzes = snapshot.docs.map((doc) => doc.data());
    setQuizzes(quizzes);
  };

  const deleteQuestion = async (e, questionToDelete, quizId, index) => {
    e.preventDefault();
    // console.log("delete", questionToDelete);

    try {
      const collectionRef = collection(db, "Quiz");
      const q = query(collectionRef, where("quizId", "==", quizId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        // console.log("No documents found for the given quizId");
        return;
      }

      const firstDoc = querySnapshot.docs[0].data();

      const questionWeWantToDelete = firstDoc.questions.find(
        (question) => question.question === questionToDelete.question
      );
      // console.log("detele ", questionWeWantToDelete);
      const updatedQuestionsArray = firstDoc.questions.filter((question) => {
        // console.log(question);
        // console.log(questionWeWantToDelete);
        return question.question != questionWeWantToDelete.question;
      });

      const updatedQuiz = {
        ...firstDoc,
        questions: updatedQuestionsArray,
      };
      // console.log(updatedQuiz);

      const docRef = doc(db, "Quiz", querySnapshot.docs[0].id);
      await updateDoc(docRef, updatedQuiz);
      alert("Question deleted successfully");
      setIsEditClicked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteQuiz = async (e, quizId) => {
    e.preventDefault();
    // console.log(quizId);
    try {
      const collectionRef = collection(db, "Quiz");
      const q = query(collectionRef, where("quizId", "==", quizId));
      const querySnapshot = await getDocs(q);

      const updatedQuizzes = quizzes.filter((quiz) => quiz.quizId !== quizId);
      if (querySnapshot.docs.length === 0) {
        console.log("No documents found for the given quizId");
        return;
      }
      const docRef = doc(db, "Quiz", querySnapshot.docs[0].id);
      await deleteDoc(docRef);

      alert("Quiz deleted successfully");
      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAddAnotherAnswerInputChange = (index, e) => {
    const updatedAnswers = [...editedAnswers];
    updatedAnswers[index] = e.target.value;
    setEditedAnswers(updatedAnswers);
    // console.log(updatedAnswers);
  };

  const handleNewAnswerChange = (index, e, newQuestion) => {
    // console.log(index);
    // console.log(newQuestion);
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = e.target.value;
    setNewAnswers(updatedAnswers);
    // console.log(updatedAnswers);
  };

  const handleAddNewAnswer = () => {
    setNewAnswers([...newAnswers, ""]);
  };

  const handleRemoveNewAnswer = (id) => {
    const updatedAnswers = newAnswers.filter((answer) => answer.id !== id);
    setNewAnswers(updatedAnswers);
  };

  const handleSelectNewCorrectAnswer = (index) => {
    setNewCorrectAnswerIndex(index);
  };

  const handleAddNewQuestion = (newQuestion, newAnswers) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions.push(newQuestion);
    setEditedQuestions(updatedQuestions);
    // console.log(updatedQuestions);

    const updatedAnswers = [...editedAnswers];
    updatedAnswers.push(newAnswers);
    setEditedAnswers(updatedAnswers);
    // console.log(updatedAnswers);

    const updatedCorrectAnswer = [...editedCorrectAnswer];
    updatedCorrectAnswer.push(newCorrectAnswerIndex);
    setEditedCorrectAnswer(updatedCorrectAnswer);
    // console.log(updatedCorrectAnswer);

    const question = {
      question: newQuestion,
      answers: newAnswers,
      correctAnswerIndex: newCorrectAnswerIndex,
      correctAnswerText: newAnswers[newCorrectAnswerIndex],
    };

    const updatedQuiz = {
      ...editedQuiz,
      questions: [...editedQuiz.questions, question],
    };

    setEditedQuiz(updatedQuiz);
    // console.log("here", updatedQuiz);
    setIsAddNewQuestionClicked(false);
    setNewQuestion("");
  };

  const handleEditQuestion = (e, index) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[index] = e.target.value;
    setEditedQuestions(updatedQuestions);
    // console.log(editedQuestions);
  };

  const handleEditAnswer = (e, index, question) => {
    // console.log(index);
    // console.log(question);
    const updatedAnswers = [...editedAnswers];
    updatedAnswers[question.answers.index] = e.target.value;
    setEditedAnswers(updatedAnswers);
  };

  const handleEditQuiz = (selectedQuiz) => {
    setEditedQuiz(selectedQuiz);
    setEditedQuestions(
      selectedQuiz.questions.map((question) => question.question)
    );
    setEditedAnswers(
      selectedQuiz.questions.map((question) => question.answers)
    );
    setEditedCorrectAnswer(
      selectedQuiz.questions.map((question) => question.correctAnswerIndex)
    );
    setIsEditClicked(true);
  };

  const updateQuiz = async (e) => {
    e.preventDefault();
    // console.log(editedQuiz);
    // console.log(editedQuestions);
    // console.log(editedAnswers);
    // console.log(editedCorrectAnswer);

    const updatedQuiz = {
      ...editedQuiz,
      questions: editedQuiz.questions.map((question, index) => ({
        question: editedQuestions[index],
        answers: editedAnswers[index],
        correctAnswerIndex: editedCorrectAnswer[index],
        correctAnswerText: editedAnswers[index][editedCorrectAnswer[index]], // Store the correct answer text
      })),
    };

    // console.log(updatedQuiz);

    try {
      const collectionRef = collection(db, "Quiz");
      const q = query(collectionRef, where("quizId", "==", updatedQuiz.quizId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
      });

      const docRef = doc(db, "Quiz", querySnapshot.docs[0].id);
      await updateDoc(docRef, updatedQuiz);
      alert("Quiz updated successfully");
      setEditedQuiz(updatedQuiz);
      setQuiz(updatedQuiz);
      fetchQuizzes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex ">
      <div className="w-64 bg-gray-200">
        <AdminSidebar />
      </div>
      <div className="w-2/3">
        <div className="m-auto ">
          <button
            onClick={() => setIsCreateQuizClicked(!isCreateQuizClicked)}
            className="shadow-md  p-3 rounded-full w-full m-4 bg-green-400   "
          >
            {isCreateQuizClicked ? "Cancel" : "Create Quiz"}
          </button>
        </div>

        {/* <PlayQuiz /> */}

        {/* Display Quizzes */}

        <div className="w-2/3 ">
          {quizzes.map((selectedQuiz, index) => (
            <div
              key={index}
              className="border-2 border-black p-6 "
              id={selectedQuiz.quizId}
            >
              <h1>Title: {selectedQuiz.title}</h1>
              <h3>Description: {selectedQuiz.description}</h3>
              <h3>Questions </h3>
              {selectedQuiz.questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  <h4>{question.question}</h4>
                  <h5>Answers</h5>
                  <div>
                    {question.answers.map((answer, index) => (
                      <div key={index}>
                        <label htmlFor={`answer${index + 1}`}>{`Answer ${
                          index + 1
                        }`}</label>

                        <input
                          key={index}
                          className="border-black border-2 m-3"
                          type="text"
                          value={question.answers[index]}
                          name={`answer${index + 1}`}
                          onChange={(e) => {
                            handleAddAnotherAnswerInputChange(index, e);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <h5 className="mt-4 ">Correct Answer</h5>
                  <p>{question.correctAnswerText}</p>
                </div>
              ))}
              <button
                className="shadow-md  p-3 rounded-full bg-green-400 w-20 m-4 "
                onClick={() => {
                  // setIsEditClicked(!isEditClicked)
                  // setEditedQuiz(quiz);

                  handleEditQuiz(selectedQuiz);
                  // Show the edit form or toggle a modal here
                }}
              >
                Edit
              </button>
              <button
                className="shadow-md  p-3 rounded-full bg-red-400 w-20 m-4 "
                onClick={(e) => {
                  e.preventDefault();
                  deleteQuiz(e, selectedQuiz.quizId);
                }}
              >
                delete
              </button>
            </div>
          ))}
        </div>

        {/*Edit form  */}

        {isEditClicked ? (
          <div key={quiz} className="">
            <form className="bg-white border-2 border-black rounded-lg shadow-lg  p-4 m-2  flex flex-col ">
              <div>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddNewQuestionClicked(!isAddNewQuestionClicked);
                  }}
                  className="shadow-md  p-3 rounded-full  m-4 "
                >
                  {isAddNewQuestionClicked ? "Cancel" : "Add New Question"}
                </button>

                {isAddNewQuestionClicked ? (
                  <div>
                    <label htmlFor="newQuestion">New Question</label>
                    <input
                      type="text"
                      className="border-2 border-black m-3"
                      id="newQuestion"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />

                    <div>
                      {newAnswers.map((answer, index) => (
                        <div key={index}>
                          <label htmlFor={`newAnswer${index}`}>{`Answer ${
                            index + 1
                          }`}</label>
                          <input
                            type="text"
                            className="border-2 border-black m-3"
                            id={`newAnswer${index}`}
                            value={answer.text}
                            onChange={(e) =>
                              handleNewAnswerChange(index, e, newQuestion)
                            }
                          />

                          <input
                            type="checkbox"
                            className="border-2 border-black m-3"
                            checked={newCorrectAnswerIndex === index}
                            onChange={() => {
                              handleSelectNewCorrectAnswer(index),
                                setEditedCorrectAnswer(parseInt(index));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewAnswer(answer.id)}
                            className="shadow-md  p-3 rounded-full bg-red-400 w-20 m-4 "
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddNewAnswer}
                        className="bg-cyan-500 p-4 text-white m-2 "
                      >
                        Add an answer
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleAddNewQuestion(newQuestion, newAnswers);
                        setIsAddNewQuestionClicked(false);
                      }}
                      className="bg-cyan-500 p-4 text-white m-2 "
                    >
                      Save Question
                    </button>
                  </div>
                ) : null}
              </div>
              <label htmlFor="">Question</label>
              {editedQuiz.questions.map((question, index) => (
                <div key={index} className="">
                  <input
                    className="border-2 border-black m-3"
                    type="text"
                    value={editedQuestions[index]}
                    name={`question${index + 1}`}
                    onChange={(e) => {
                      handleEditQuestion(e, index);
                    }}
                  />
                  <button
                    type="submit"
                    className="shadow-md  p-3 rounded-full bg-red-400 m-4 "

                    onClick={(e) => {
                      e.preventDefault();
                      deleteQuestion(e, question, editedQuiz.quizId, index);
                    }}
                  >
                    Delete Question
                  </button>

                  <label htmlFor="">Answers</label>
                  {editedAnswers[index].map((answer, index) => (
                    <div key={index}>
                      <input
                        className="border-2 border-black m-3"
                        type="text"
                        value={answer}
                        name={`answer${index + 1}`}
                        onChange={(e) => {
                          handleEditAnswer(e, index, question);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAnswer(index, answer)}
                        className="bg-red-500 p-4 text-white m-2 "
                      >
                        Remove
                      </button>
                    </div>
                  ))}
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
                        setEditedCorrectAnswer(parseInt(e.target.value));
                        handleEditCorrectAnswerInputChange(
                          question,
                          parseInt(e.target.value)
                        );
                      }}
                    >
                      {question.answers.map((answer, index) => (
                        <option key={index} value={index}>
                          {question.answers[index]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  updateQuiz(e);
                }}
              >
                update Quiz
              </button>

              <button>Delete Quiz</button>
            </form>
          </div>
        ) : null}

        <div>
          {/* Add Quiz */}

          {isCreateQuizClicked ? (
            <div className="mt-32">
              <form action="" className="relative z-10 ">
                <div className="space-y-12  w-2/3 m-8 p-8 border-gray-900/10 border-2 rounded fixed inset-0 bg-white  transition-opacity overflow-scroll ">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="quizTitle"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Title
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          onChange={handleQuizTitleChange}
                          placeholder="Title of the quiz"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="quizDescription"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        type="text"
                        placeholder="Description of the quiz"
                        className="block w-full rounded-md border-0 py-1.5 pl-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={handleQuizDescriptionChange}
                      />{" "}
                    </div>
                  </div>

                  {/* <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <label htmlFor="quizDescription">Description</label>
                 
                </div> */}

                  {questions.map((question, questionIndex) => (
                    <div key={questionIndex}>
                      <label
                        htmlFor={`question${questionIndex + 1}`}
                      >{`Question ${questionIndex + 1}`}</label>
                      <input
                        className="border-2 border-black m-3"
                        type="text"
                        id={`question${questionIndex + 1}`}
                        value={question}
                        onChange={(e) =>
                          handleQuestionInputChange(questionIndex, e)
                        }
                      />

                      {questionAnswers[questionIndex].answers.map(
                        (answer, answerIndex) => (
                          <div key={answerIndex} className="border-2 p-8 ">
                            <label
                              htmlFor={`answer${answerIndex + 1}`}
                            >{`Answer ${answerIndex + 1}`}</label>
                            <input
                              className="border-2 border-black m-3"
                              type="text"
                              value={answer}
                              id={`answer${answerIndex + 1}`}
                              onChange={(e) =>
                                handleAnswerInputChange(
                                  questionIndex,
                                  answerIndex,
                                  e
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAnswer(questionIndex, answerIndex)
                              }
                              className="shadow-md  p-3 rounded-full bg-red-400 "
                            >
                              Remove
                            </button>

                            <input
                              type="checkbox"
                              className="border-2 border-black m-3"
                              checked={
                                questionAnswers[questionIndex]
                                  .correctAnswerIndex === answerIndex
                              }
                              onChange={() =>
                                handleCorrectAnswerInputChange(
                                  questionIndex,
                                  answerIndex
                                )
                              }
                            />
                          </div>
                        )
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddAnswer(questionIndex)}
                        className="shadow-md  p-3 rounded-full  "
                      >
                        Add an answer
                      </button>
                    </div>
                  ))}

                  <div>
                    <button
                      type="submit"
                      onClick={handleAddAQuestion}
                      className="shadow-md  p-3 rounded-full  "
                    >
                      Add a question
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      onClick={submitQuiz}
                      className="shadow-md  p-3 rounded-full  "
                    >
                      Save Quiz
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
