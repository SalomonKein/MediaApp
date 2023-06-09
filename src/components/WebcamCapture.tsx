import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture() {
  const [isShowVideo, setIsShowVideo] = useState(false);
  const videoElement = useRef<Webcam>(null);

  const videoConstraints = {
    facingMode: "user",
  };

  const startCam = () => {
    setIsShowVideo(true);
  };

  const stopCam = () => {
    if (videoElement.current != null) {
      let stream = videoElement.current.stream;
      const tracks = stream?.getTracks();
      tracks?.forEach((track: { stop: () => void }) => track.stop());
      setIsShowVideo(false);
    }
  };

  return (
    <div>
      <div className="camView">
        {isShowVideo && (
          <Webcam
            audio={false}
            ref={videoElement}
            videoConstraints={videoConstraints}
            style={{
              width: "200px",
              position: "absolute",
              top: `20px`,
              left: `20px`,
              borderRadius: "20%",
              overflow: "hidden",
              zIndex: "3",
            }}
          />
        )}
      </div>
      <button
        style={{
          margin: "20px",
          background: `${isShowVideo ? "red" : "lightgreen"}`,
          borderRadius: "5px",
          borderColor: "darkgray",
          color: `${isShowVideo ? "white" : "black"}`,
        }}
        onClick={isShowVideo ? stopCam : startCam}
      >
        {isShowVideo ? "Stop streaming" : "Start streaming"}
      </button>
    </div>
  );
}
