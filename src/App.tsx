import { useEffect, useState } from "react";

type BackendVersion = { app:string; version:string; commit:string; builtAt:string; node:string };

function App() {
  const [hello, setHello] = useState("...");
  const [ping, setPing] = useState<string | number>("...");
  const [backend, setBackend] = useState<BackendVersion | null>(null);

  useEffect(() => {
    fetch("/api/hello").then(r => r.text()).then(setHello).catch(() => setHello("error"));
    fetch("/api/db/ping").then(r => r.json()).then(d => setPing(d.ok)).catch(() => setPing("error"));
    fetch("/api/version").then(r => r.json()).then(setBackend).catch(() => setBackend(null));
  }, []);

  return (
    <div style={{fontFamily:"system-ui", padding:"24px"}}>
      <h1>Frontend ✓</h1>
      <p><b>/api/hello:</b> {hello}</p>
      <p><b>/api/db/ping:</b> {String(ping)}</p>

      <div style={{marginTop:"24px", padding:"8px 12px", border:"1px solid #ddd", borderRadius:8, display:"inline-block", fontSize:12, color:"#555"}}>
        FE ver {import.meta.env.VITE_APP_VERSION} · commit {import.meta.env.VITE_GIT_COMMIT} · built {import.meta.env.VITE_BUILD_TIME}
      </div>

      {backend && (
        <div style={{marginTop:"8px", padding:"8px 12px", border:"1px solid #ddd", borderRadius:8, display:"inline-block", fontSize:12, color:"#555"}}>
          BE {backend.app} v{backend.version} · {backend.commit} · {backend.builtAt} · {backend.node}
        </div>
      )}
    </div>
  );
}
export default App;
