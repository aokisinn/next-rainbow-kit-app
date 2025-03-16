"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import styles from "./page.module.css";
import { useAccount, useDisconnect } from "wagmi";

export default function Home() {
  const {
    address,
  } = useAccount();

  const {
    disconnect,
  } = useDisconnect();

  const {
    openConnectModal,
  } = useConnectModal();

  return (
    <div
    style={{
      display: 'flex',
      gap: '1rem',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
    >
      <h1>Home</h1>
      <p>Account: {address}</p>
      {
        address ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : (
          <button onClick={openConnectModal}>Connect</button>
        )
      }
    </div>
  );
}
