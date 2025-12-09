import "./App.css";
import { initOnboard } from "./widget-entry";


function App() {

  // useEffect(() => {
    // Example steps for development preview
    const steps = [
      { id: "s1", target: "#logo", content: "Welcome!" },
      { id: "s2", target: "#btn", content: "Click this button." },
      { id: "s3", content: "You're almost done." },
      { id: "s4", content: "Bye!" }
    ];

    // Start the widget automatically in DEV
    const widget = initOnboard({ 
      tourId: "demo", 
      steps,
      resume: true,
      onEvent: console.log
    });

    

  // }, []);

  return (
    <div className="card" style={{ padding: 40 }}>
      <h1 className="logo" id="logo">Onboarding Widget Preview</h1>

      <button 
      className=".read-the-docs"
      onClick={()=> widget?.start()}
        id="btn" 
        style={{ padding: "10px 20px", marginTop: 20 }}
      >
        Demo Button
      </button>

      <p style={{ marginTop: 20 }}>
        This screen exists ONLY for local development.  
        The real widget is embedded externally.
      </p>
    </div>
  );
}

export default App;
