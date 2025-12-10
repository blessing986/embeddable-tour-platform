import {  useEffect } from "react";
import "./App.css";
import { initOnboard } from "./widget-entry";

function App() {

  useEffect(() => {
    widget?.start();
  }, []);

    const widget = initOnboard({
      tourId: 12,
      secret_key: '25a70b72-d19b-4758-91a4-ff0d98d90609',
      resume: true
    });

  return (
   <div
  className="card"
  id="card"
  style={{
    maxWidth: 600,
    margin: "80px auto",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  }}
>
  <h1
    className="logo"
    id="logo"
    style={{
      fontSize: 28,
      marginBottom: 30,
      color: "#333",
    }}
  >
    Onboarding Widget Preview
  </h1>

  <button
    className="read-the-docs"
    // onClick={() => }
    id="btn"
    style={{
      padding: "12px 24px",
      fontSize: 16,
      borderRadius: 8,
      border: "none",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    Demo Button
  </button>

  <p
    id="text-p"
    style={{
      marginTop: 24,
      fontSize: 14,
      color: "#666",
      lineHeight: 1.5,
    }}
  >
    This screen exists <strong>ONLY</strong> for local development.  
    The real widget is embedded externally.
  </p>
</div>

  );
}

export default App;
