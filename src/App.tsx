import { useEffect, useState } from "react";

function App() {
  const [hello, setHello] = useState("...");
  const [ping, setPing] = useState<string | number>("...");

  useEffect(() => {
    fetch("/api/hello").then(r => r.text()).then(setHello).catch(() => setHello("error"));
    fetch("/api/db/ping").then(r => r.json()).then(d => setPing(d.ok)).catch(() => setPing("error"));
  }, []);

  return (
    <div style={{fontFamily:"system-ui", padding:"24px"}}>
      <h1>Frontend ✓</h1>
      <p><b>/api/hello:</b> {hello}</p>
      <p><b>/api/db/ping:</b> {String(ping)}</p>

      <div style={{marginTop:"24px", padding:"8px 12px", border:"1px solid #ddd", borderRadius:8, display:"inline-block", fontSize:12, color:"#555"}}>
        ver {import.meta.env.VITE_APP_VERSION} ·
        commit {import.meta.env.VITE_GIT_COMMIT} ·
        built {import.meta.env.VITE_BUILD_TIME}
      </div>
    </div>
  );
}

export default App;
