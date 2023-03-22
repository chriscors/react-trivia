import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Quiz.module.css";
import parse from 'html-react-parser';
import classNames from "classnames";
import {clsx} from "clsx";

const colors = ["yellow","pink","orange","purple","blue"]

export default function Quiz() {
  const router = useRouter()
  //States
  const [questions, setQuestions] = useState(null)
  const [questionNum, setQuestionNum] = useState(0)
  const [quizState, setQuizState] = useState('loading') //STATES: loading, playing, correct, incorrect, clearing finished
  //Refs
  const category = useRef(null)
  const score = useRef(0)

  useEffect(() => {
    if (!router.isReady) return;
  
    const categoryID = router.query.id
    
    const URL = `https://opentdb.com/api.php?amount=10&category=${categoryID}`
    axios.get(URL).then((response) => {
      category.current = response.data.results[0].category
      let cleanResult = response.data.results

      //Make an array of questions and shuffle them
      for (const question of cleanResult){
        question.answers = [question.correct_answer ]
        question['incorrect_answers'].forEach(element => { question.answers.push(element) });
        question.answers = shuffle(question.answers)
      }
      setQuestions(cleanResult)

      
    })
  }, [router.isReady])
  
  //Set components have loaded so they stop fading in on rerender
  useEffect(() => {
    if(quizState === "loading")
    setTimeout(() => {
      setQuizState('playing')
    }, 1000);
  },[quizState])

  function handleStartOver(e){
    e.target.classList.replace('fade-in','fade-out')

    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  if (questions) {
    if (quizState === "finished") {
      return(<>
        <div className={`${styles.title} my05`}>
          <h1 className={clsx({ "text-center": true, [styles['fade-in']]: quizState != 'clearing', [styles['fade-out']]: quizState === 'clearing' })}>You scored {score.current} out of {questions.length}</h1>
        </div>
        <div class="button-row row gx-3 my-5 justify-content-center">
          <div class="col-md-auto justify-content-center align-items-center">
            <input className={styles.input} type="radio" name="startOver" id="startOver" key="inputStartOver" />
            <label className={clsx({ [styles.label]: true, [styles['fade-in']]: quizState === 'finished', 'd-flex':true, [styles['fade-out']]: quizState === 'clearing' })} htmlFor="startOver" key="labelStartOver" style={{ "--color": "green" }} onClick={event => handleStartOver(event)}>New Quiz</label>
          </div>
        </div>
        </>
      )
    } else {
      return (
        <><div className="mx-2">
          <div className="d-flex mt-2 justify-content-between">
            <h2 className="col">{category.current}</h2>
            <h2 className="col" style={{ "text-align": 'center' }}>Score: {score.current}</h2>
            <h2 className="col text-right" style={{ "text-align": 'right' }}>Question {questionNum + 1}/{questions.length}</h2>
          </div >
          <div className={`${styles.title} mx-6`}>
            <h1 className={clsx({ 'text-center': true, [styles['fade-in']]: quizState === 'loading', [styles['fade-out']]: quizState === 'clearing' })}>{parse(questions[questionNum].question)}</h1>
          </div>
          <div class="button-row row gx-3 my-5 justify-content-center">
            {questions[questionNum].answers.map((answer, ind) => {
              return <Choice
                answer={answer}
                correctAnswer={questions[questionNum]["correct_answer"]}
                questionNum={questionNum}
                setQuestionNum={setQuestionNum}
                score={score}
                key={ind}
                index={ind}
                quizState={quizState}
                setQuizState={setQuizState}
                limit={questions.length - 1}
              />
            })}
          </div>
          {quizState === "correct" && (
            <div className={clsx({ [styles.title]: true, "my05": true, })}><h1 className={clsx({ "text-center": true, [styles['fade-in']]: quizState != 'clearing', [styles['fade-out']]: quizState === 'clearing' })}>Correct</h1></div>)}
          {quizState === "incorrect" && (
            <div className={`my-5 ${styles.title}`}><h1 className={`text-center ${styles['fade-in']}`}>Incorrect</h1></div>)}
        </div>
        </>
      )
    }
  }
}


function Choice({ answer, correctAnswer, questionNum, setQuestionNum, score, index, quizState, setQuizState, limit }) {
  const clicked = useRef(false)
  function handleAnswer(e) {
    clicked.current = true
    if (correctAnswer === answer) {
      setQuizState("correct")
      score.current++;
    }
    else {
      setQuizState("incorrect")
    }
    //let el = e.target
    console.log(e);
    setTimeout(() => {
      setQuizState('clearing') //for ONE SECOND, then go to loading
      setTimeout(() => {
        if (questionNum < limit) {
          setQuestionNum(setQuestionNum => setQuestionNum + 1)
          setQuizState('loading')
        } else {
          setQuizState('finished')
        }
        clicked.current = false
      }, 1000)
    }, 3000);
  }
  //While clearing/loadig: disable the button and set the style (these could be combined but lazy)
  if (quizState === "clearing") {
    return (
      (<><div class="col-md-auto my-2">
      <input className={styles.input} type="radio" name={index} id={index} key={`input${answer}`} checked={false} disabled={true}/>
      <label className={`${styles.label} ${styles['fade-out']} ${styles.hidden}`} htmlFor={index} key={`label${answer}`} style={{ "--color": colors[index % (colors.length - 1)] }}>{parse(answer)}</label>
      </div></>))
  } else if (quizState === "loading") {
    return (
      (<><div class="col-md-auto my-2">
        <input className={styles.input} type="radio" name={index} id={index} key={`input${answer}`} checked={false} disabled={true} />
        <label className={`${styles.label} ${styles['fade-in']} ${styles.hidden}`} htmlFor={index} key={`label${answer}`} style={{ "--color": colors[index % (colors.length - 1)] }}>{parse(answer)}</label>
      </div></>))
  } else if (clicked.current) {
      //if this was the correct answer and it was clicked: make green
    if (quizState === "correct") {
      console.log(`CORRECT ANSWER CLICKED: ${answer}`);
      return (<><div className={`col-md-auto my-2 ${styles.correct}`}>
        <input className={styles.input} type="radio" name={index} id={index} key={`input${answer}`} />
        <label className={`${styles.label} ${styles.selected}`} htmlFor={index} key={`label${answer}`} style={{ "--color": "green" }}>{parse(answer)}</label>
      </div></>)
      //if this was the incorrect answer and it was clicked: make red
    } else if (quizState === "incorrect") {
      console.log(`INCORRECT ANSWER CLICKED: ${answer}`);
      return (<><div className={`col-md-auto my-2 ${styles.incorrect}`}>
        <input className={styles.input} type="radio" name={index} id={index} key={`input${answer}`} />
        <label className={`${styles.label} ${styles.selected}`} htmlFor={index} key={`label${answer}`} style={{ "--color": "red" }}>{parse(answer)}</label>
      </div></>)
    } //The question WAS answered incorrect and this was the correct answer 
  } else if (quizState === "incorrect" && !clicked.current && correctAnswer === answer) {
    console.log(`CORRECT ANSWER NOT CLICKED: ${answer}`);
    return <><div class="col-md-auto my-2">
      <input className={styles.input} type="radio" name={`${index} other`} id={index} key={`input${index}`} checked={false}/>
      <label className={`${styles.label}`} htmlFor={index} key={`label${answer}`}  style={{ "--color": "green" }} >{parse(answer)}</label>
    </div></>
    //The question WAS answered but this wasnt the one clicked: hide the button
  } else if ((quizState === "correct" || quizState === "incorrect") && !clicked.current) {
    console.log(`INCORRECT ANSWER NOT CLICKED: ${answer}`);
    return (<><div class="col-md-auto my-2">
      <input className={styles.input} type="radio" name={index} id={index} key={`input${answer}`} checked={false} />
      <label className={`${styles.label} ${styles['fade-out']} ${styles.hidden}`} htmlFor={index} key={`label${answer}`} style={{ "--color": colors[index % (colors.length - 1)] }}>{parse(answer)}</label>
    </div></>)
  } 
    //else print regularly
   else {
    console.log(`EVERYTHING ELSE: ${answer} ${quizState}`);
    return (
      <><div class="col-md-auto my-2">
        <input className={styles.input} type="radio" name={index} id={index} key={`input${answer}`} />
        <label className={styles.label} htmlFor={index} key={`label${answer}`} style={{ "--color": colors[index % (colors.length - 1)] }} onClick={event => handleAnswer(event)}>{parse(answer)}</label>
      </div></>
    )
  }
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}