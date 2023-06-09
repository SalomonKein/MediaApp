import React, { useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ScreenRecorder() {
  let stream: MediaStream | null = null,
    chunks: Blob[] | undefined = [],
    recorder: MediaRecorder | null = null;
  const startButton = useRef<HTMLButtonElement>(null);
  const stopButton = useRef<HTMLButtonElement>(null);
  const downloadButton = useRef<HTMLAnchorElement>(null);

  async function setupStream() {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function startRecording() {
    await setupStream();
    const options = {
      mimeType: "video/webm",
    };

    if (stream && startButton.current && stopButton.current) {
      const mixedStream = new MediaStream([...stream.getTracks()]);
      recorder = new MediaRecorder(mixedStream, options);
      recorder.ondataavailable = handleDataAvailable;
      recorder.onstop = handleStop;
      recorder.start(1000);

      startButton.current.disabled = true;
      stopButton.current.disabled = false;

      console.log("Recording started");
    } else {
      console.warn("No stream available.");
    }
  }
  function stopRecording() {
    if (recorder && startButton.current && stopButton.current) {
      recorder.stop();

      startButton.current.disabled = false;
      stopButton.current.disabled = true;
    }
  }

  function handleDataAvailable(e: { data: Blob; timeStamp: number }) {
    chunks?.push(e.data);
  }

  function handleStop() {
    stream?.getTracks().forEach((track) => track.stop());
    console.log("Recording stopped");
  }

  function saveArchive(event: { preventDefault: () => void }) {
    event?.preventDefault();
    // Trimming to the last 5 minutes
    const sliceChunks =
      chunks && chunks.length > 300 ? chunks?.slice(-300) : chunks;
    const blob = new Blob(sliceChunks, { type: "video/webm" });
    chunks = [];
    const zip = new JSZip();
    console.log("work");
    zip.file("videoStreem.mp4");
    const video = zip.folder("video");
    video?.file("videoStreem.mp4", blob, { base64: true });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "archive.zip");
    });
  }

  return (
    <div>
      <button
        ref={startButton}
        onClick={() => startRecording()}
        style={{
          margin: "20px",
          background: "blue",
          color: "white",
          borderRadius: "5px",
          borderColor: "darkgray",
          height: "35px",
        }}
      >
        Start recording
      </button>
      <button
        ref={stopButton}
        onClick={() => stopRecording()}
        style={{
          margin: "20px",
          background: "blue",
          color: "white",
          borderRadius: "5px",
          borderColor: "darkgray",
          height: "35px",
        }}
      >
        Stop recording
      </button>
      <a
        ref={downloadButton}
        href="someURl"
        onClick={(event) => saveArchive(event)}
      >
        Download
      </a>
    </div>
  );
}
