import 'bootstrap/dist/css/bootstrap.css'
import "@/styles/globals.css";
import Head from "next/head";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Script from "next/script";
config.autoAddCss = false

export default function App({ Component, pageProps }) {
  return (
    <>
      <title>Trivia App</title>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <canvas id="particles"></canvas>
      <Script src="/particles.js"/>
    </>
  );
}
