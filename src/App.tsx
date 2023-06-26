import React, { useEffect, useRef } from "react";
import "./App.css";
import RecordCrop from "./components/RecordCrop";
import ScreenRecorder from "./components/ScreenRecorder";
import WebcamCapture from "./components/WebcamCapture";

const videoFile = require("./assets/zhil-byl-pes.mp4");

function App() {
  const videoPlayerRef = useRef<HTMLDivElement>(null);

 useEffect(()=>{
  const pos =  videoPlayerRef.current?.getBoundingClientRect()
  console.log(pos)
},[])
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
      <RecordCrop/>
    </div>
  );
}

export default App;
