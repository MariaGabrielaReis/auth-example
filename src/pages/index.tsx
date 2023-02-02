import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { FormEvent, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuthContext();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = { email, password };

    await signIn(data);
  }

  return (
    <>
      <Head>
        <title>Auth | Example</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>
      </main>
    </>
  );
}
