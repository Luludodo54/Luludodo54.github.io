import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 SocialApp</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("videos")}>Videos</button>
        <button onClick={() => setPage("mideos")}>Mideos</button>
        <button onClick={() => setPage("chat")}>Chat</button>
      </div>

      <hr />

      {page === "home" && <h2>🏠 Feed Home</h2>}
      {page === "videos" && <h2>🎥 YouTube Feed (coming)</h2>}
      {page === "mideos" && <h2>📱 TikTok Feed (coming)</h2>}
      {page === "chat" && <h2>💬 Chat (coming)</h2>}
    </div>
  );
}