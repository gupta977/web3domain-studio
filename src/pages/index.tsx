import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Web3Domain Search
        </h1>
        <p className={styles.description}>
          Connect your wallet and start playing around
        </p>
      </main>
    </div>
  );
};

export default Home;
