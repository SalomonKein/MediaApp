import React, { useRef } from "react";
import "./App.css";
import ScreenRecorder from "./components/ScreenRecorder";
import WebcamCapture from "./components/WebcamCapture";

const videoFile = require("./assets/zhil-byl-pes.mp4");

function App() {
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      <div
        style={{
          position: "relative",
          display: "inline-block",
          margin: "auto",
          marginTop: "150px",
        }}
        ref={videoPlayerRef}
      >
        <video width={500} height={400} controls src={videoFile} />
        <WebcamCapture />
      </div>
      <ScreenRecorder />
    </div>
  );
}

export default App;
