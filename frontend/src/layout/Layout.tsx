import Header from "../components/Header";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white" }}>
      {/* NAVBAR FIXED */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#141414",
          borderBottom: "1px solid #222",
        }}
      >
        <Header />
      </div>

      {/* CONTENT CONTAINER */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {children}
      </main>
    </div>
  );
}