import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Quiz.module.css";


export default function Quiz() {
  const router = useRouter()
  const [questions, setQuestions] = useState(null)
  const [questionNum, setQuestionNum] = useState(0)
  const category = useRef(null)
  const score = useRef(0)

  useEffect(() => {
    if (!router.isReady) return;
  
    const categoryID = router.query.id
    console.log(categoryID)
    
    const URL = `https://opentdb.com/api.php?amount=10&category=${categoryID}`
    console.log(URL);
    axios.get(URL).then((response) => {
      console.log(response)
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
  

  return (<>
    <div className="d-flex justify-content-between  flex-direction: column">
      <h1>{category.current}</h1>
      <h1>Question {questionNum + 1}/10</h1>
    </div>
    </>
  )
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