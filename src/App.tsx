import "./App.css";
import { initOnboard } from "./widget-entry";

// TODO: Fetch steps from server
// TODO: Add target functionality ___DONE

function App() {

    const widget = initOnboard({ 
      tourId: 1, 
      userId: "56462647-1e02-454e-8927-40d45ceda06a",
      resume: true,
      styles: {
        tooltip: {
        color: '#fff',
        background: 'linear-gradient(145deg, #ff7eb9, #ff758c, #ffafbd, #ffc3a0)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35), 0 0 12px rgba(255, 200, 255, 0.6)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transition: 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
      },
      button: {
        backgroundColor: 'red'
      },
      },
      onEvent: console.log
    });

  return (
    <div className="card" id="card" style={{ padding: 40 }}>
      <h1 className="logo" id="logo">Onboarding Widget Preview</h1>

      <button 
      className=".read-the-docs"
      onClick={()=> widget?.start()}
        id="btn" 
        style={{ padding: "10px 20px", marginTop: 20 }}
      >
        Demo Button
      </button>

      <p id="text-p" style={{ marginTop: 20 }}>
        This screen exists ONLY for local development.  
        The real widget is embedded externally.
      </p>
    </div>
  );
}

export default App;
