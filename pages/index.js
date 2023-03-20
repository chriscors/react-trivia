import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


const colors = ["Red","Yellow","Pink","Green","Orange","Purple","Blue"]


export default function Home() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const URL = "https://opentdb.com/api_category.php"
    
    axios.get(URL).then((response) => setCategories(response.data))
  },[])


  return (
    <>
      <main className={styles.body}>
        <div className="title"><h1>Choose a Category</h1></div>
        {!categories && <FontAwesomeIcon icon={faSpinner} spin />}
        {/* <div className={styles.options}>
          {categories && categories.map(category =>  <input type="radio" name="option" >)
          }
        </div> */}
      </main>
    </>
  );
}
