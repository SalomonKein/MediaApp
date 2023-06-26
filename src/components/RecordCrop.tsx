import React, { useRef, useState } from "react";
import RecordRTC from "recordrtc";

interface IRecorder {
  startRecording: () => void;
  stopRecording: (arg0: () => void) => void;
  getBlob: () => Blob;
}

export default function RecordCrop() {
  let CROP_X = 10;
  let CROP_Y = 20;
  let CROP_W = 320;
  let CROP_H = 240;
  let VIDEO_WIDTH = 0;
  let VIDEO_HEIGHT = 0;
  const MAX_VIDEO_WIDTH = 1920;
  const MAX_VIDEO_HEIGHT = 1080;
  const _canvas = useRef<HTMLCanvasElement | null>(null);
  const scanvas = useRef<HTMLCanvasElement | null>(null);
  let _context: CanvasRenderingContext2D | null | undefined;

  const [wRatio, setWRatio] = useState<number>();
  const [hRatio, setHRatio] = useState<number>();
  const [maxRatio, setMaxRatio] = useState<number>();
  const [scanvasWidth, setScanvasWidth] = useState<number>(CROP_W);
  const [scanvasHeight, setScanvasHeight] = useState<number>(CROP_H);

  const [inited, setIiited] = useState<boolean>(false);

  const btnStopRecording = useRef<HTMLButtonElement | null>(null);

  const [recorder, setRecorder] = useState<IRecorder>();

  // function updateHandler () {
  //     var x = document.getElementById("x").value << 0;
  //     var y = document.getElementById("y").value << 0;
  //     var w = document.getElementById("w").value << 0;
  //     var h = document.getElementById("h").value << 0;

  //     if (x >= 0) {
  //         CROP_X = x;
  //     }
  //     if (y >= 0) {
  //         CROP_Y = y;
  //     }

  //     CROP_W = w || 0;
  //     CROP_H = h || 0;
  // };
  _context = _canvas.current?.getContext("2d");

  /**
   * Crops a video frame and shows it to the user
   */
  function CropFrame(
    ev: any,
    stream: any,
    video: any,
    callback?: ((arg0: string) => void) | undefined
  ) {
    callback = callback || function () {};

    if (CROP_X < 0) {
      CROP_X = 0;
    }
    if (CROP_Y < 0) {
      CROP_Y = 0;
    }
    if (CROP_W <= 0) {
      CROP_W = VIDEO_WIDTH;
    }
    if (CROP_H <= 0) {
      CROP_H = VIDEO_HEIGHT;
    }
    if (CROP_W > MAX_VIDEO_WIDTH) {
      CROP_W = MAX_VIDEO_WIDTH;
    }
    if (CROP_H > MAX_VIDEO_HEIGHT) {
      CROP_W = MAX_VIDEO_HEIGHT;
    }

    _context?.drawImage(
      video,
      CROP_X,
      CROP_Y,
      CROP_W,
      CROP_H,
      0,
      0,
      CROP_W,
      CROP_H
    );

    const posCanvas = _canvas.current?.getBoundingClientRect();
    if (posCanvas) {
      setWRatio(posCanvas.width / 320);
      setHRatio(posCanvas.height / 240);
    }
    if (wRatio && hRatio) {
      setMaxRatio(Math.max(wRatio, hRatio));
    }
    if (maxRatio && posCanvas && maxRatio > 1) {
      setScanvasWidth(posCanvas.width / maxRatio);
      setScanvasHeight(posCanvas.height / maxRatio);
    }

    if (scanvas.current && _canvas.current) {
      scanvas.current
        .getContext("2d")
        ?.drawImage(_canvas.current, 0, 0, scanvasWidth, scanvasHeight);
      callback(scanvas.current?.toDataURL("image/jpeg"));
    }
  }

  function getScreenStream(callback: {
    (screen: any): void;
    (arg0: MediaStream): void;
  }) {
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        .then((screenStream) => {
          callback(screenStream);
        });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        .then((screenStream) => {
          callback(screenStream);
        });
    } else {
      alert("getDisplayMedia API is not supported by this browser.");
    }
  }

  const mediaElement = useRef<any>(null);

  //    function  mediaElementOntimeupdate(ev: any) {
  //     if (!inited) {
  //      if  (mediaElement.current){
  //       VIDEO_WIDTH = mediaElement.current.offsetWidth;
  //       VIDEO_HEIGHT = mediaElement.current.offsetHeight;}

  //       // mediaElement.current.style.display = "none";
  //       // document.querySelector("#edit-panel").style.display = "block";

  //       setIiited(true)
  //     }}

  // document.querySelector('#btn-start-recording').onclick = function() {
  //     document.querySelector('#btn-start-recording').style.display = 'none';

  getScreenStream(function (screen) {
    setIiited(false);
    mediaElement.current.ontimeupdate = function (ev: any) {
      if (!inited) {
        VIDEO_WIDTH = mediaElement.current.offsetWidth;
        VIDEO_HEIGHT = mediaElement.current.offsetHeight;

        setIiited(true);
      }
      CropFrame(null, screen, mediaElement);
    };
    if (mediaElement.current) {
      mediaElement.current.srcObject = screen;
      mediaElement.current.screen = screen;
    }

    addStreamStopListener(screen, function () {
      if (btnStopRecording.current && btnStopRecording.current.onclick) {
        // btnStopRecording.current.onclick();
      }
    });

    // RecordRTC goes here
    let captureStream = _canvas.current?.captureStream();
    if (captureStream)
      setRecorder(
        new RecordRTC(captureStream, {
          type: "video",
        })
      );
    recorder?.startRecording();

    //     document.querySelector("#btn-stop-recording").style.display = "inline";
  });

  //   document.querySelector("#btn-stop-recording").onclick = function () {
  //     document.querySelector("#btn-stop-recording").style.display = "none";

  recorder?.stopRecording(function () {
    var blob = recorder.getBlob();

    //   document.querySelector("#edit-panel").style.display = "none";
    //   mediaElement.style.display = "block";

    mediaElement.current.srcObject = null;
    mediaElement.current.src = URL.createObjectURL(blob);

    if (
      mediaElement.current.screen &&
      mediaElement.current.screen.getVideoTracks
    ) {
      mediaElement.current.screen.stop();
      mediaElement.current.screen = null;
    }

    //   document.querySelector("#btn-start-recording").style.display = "inline";
  });

  function addStreamStopListener(
    stream: {
      addEventListener: (
        arg0: string,
        arg1: { (): void; (): void },
        arg2: boolean
      ) => void;
      getTracks: () => {
        addEventListener: (
          arg0: string,
          arg1: { (): void; (): void },
          arg2: boolean
        ) => void;
      }[];
    },
    callback: { (): void; (): void }
  ) {
    stream.addEventListener(
      "ended",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.addEventListener(
      "inactive",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream
      .getTracks()
      .forEach(function (track: {
        addEventListener: (
          arg0: string,
          arg1: { (): void; (): void },
          arg2: boolean
        ) => void;
      }) {
        track.addEventListener(
          "ended",
          function () {
            callback();
            callback = function () {};
          },
          false
        );
        track.addEventListener(
          "inactive",
          function () {
            callback();
            callback = function () {};
          },
          false
        );
      });

    //   function querySelectorAll(selector) {
    //     return Array.prototype.slice.call(document.querySelectorAll(selector));
    //   }

    //   querySelectorAll("input").forEach(function (input) {
    //     input.onkeyup = input.oninput = function () {
    //       if (!document.querySelector("#update").onclick) return;
    //       document.querySelector("#update").onclick();
  }
  //   });

  return (
    <div>
      <button ref={btnStopRecording}>Start Recording</button>
      <button id="btn-stop-recording" style={{ display: "none;" }}>
        Stop Recording
      </button>
      <div id="edit-panel" style={{ border: "1px solid" }}>
        <div>
          <label htmlFor="x">X</label>
          <input type="number" name="x" id="x" value={CROP_X} />
        </div>
        <div>
          <label htmlFor="y">Y</label>
          <input type="number" name="y" id="y" value={CROP_Y} />
        </div>
        <div>
          <label htmlFor="w">Width (-1 = Full size)</label>
          <input type="number" name="w" id="w" value={CROP_W ? CROP_W : "-1"} />
        </div>
        <div>
          <label htmlFor="h">Height (-1 = Full size)</label>
          <input type="number" name="h" id="h" value={CROP_H ? CROP_H : "-1"} />
        </div>

        <button id="update" style={{ display: "none;" }}>
          Update X-Y Width-Height Coordinates
        </button>

        <canvas
          ref={_canvas}
          style={{ width: `${CROP_W}`, height: `${CROP_H}` }}
        ></canvas>
        <canvas
          ref={scanvas}
          style={{ width: `${scanvasWidth}`, height: `${scanvasHeight}` }}
        ></canvas>
      </div>
      <video
        id="mediaElement"
        autoPlay
        playsInline
        // onTimeUpdate={mediaElementOntimeupdate}
      ></video>
    </div>
  );
}
