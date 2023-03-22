import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";


const colors = ["red","yellow","pink","green","orange","purple","blue"]


export default function Home() {
  const [categories, setCategories] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const URL = "https://opentdb.com/api_category.php"
    
    axios.get(URL).then((response) => {
      console.log(response.data["trivia_categories"])
      setCategories(response.data)})
    
  },[])


  return (
    <>
      <main className={styles.body}>
        <div className={`${styles.title} ${styles['fade-in']} mx-2`}><h1 >Choose a Category</h1></div>
        <div className={`row ${styles.buttonscontainer}`}>
          {!categories && <FontAwesomeIcon icon={faSpinner} spin />}
          <div className={styles.options}>
            {categories && categories["trivia_categories"].map((category, index) =>
              <>
                <input className={styles.input} type="radio" name={category.id} id={category.id} key={`input${category.id}`} />
                <label className={`${styles.label} ${styles['fade-in']}`} htmlFor={category.id} key={`label${category.id}`} style = {{"--color": colors[index%(colors.length-1)]}} onClick={() => router.push(`/category/${category.id}`)}>{category.name}</label>
              </>)}
          </div>
        </div>
      </main>
    </>
  );
}
