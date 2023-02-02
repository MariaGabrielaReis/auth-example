import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Auth | Example</title>
      </Head>
      <main className={styles.container}>
        <h1>Hello world</h1>
      </main>
    </>
  );
}
