import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import {Button} from 'primereact/button';

export default function WebcamVideo({ setVideoList }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setRecordingTime(0);
    setCapturing(true);
    setVideoUrl(null);
    setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();

    timerRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);

  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  
  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setCapturing(false);
  },[mediaRecorderRef, setCapturing, timerRef]);
  
  const handleVideoPlay = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    }
  }, [recordedChunks, setVideoUrl]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks, setRecordedChunks]);

  const handleSave = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setVideoList((prevVideoList) => [...prevVideoList, url]);
    }
  }, [recordedChunks, setVideoList]);

  const videoConstraints = {
    width: { min: 720 },
    height: { min: 480 },
    aspectRatio: 1.5,
    facingMode: "user"
  };

  return (
    <>
        {videoUrl &&
          <video controls width="720" height="480" src={videoUrl} />
        }
        <div style={{ display: videoUrl ? "none" : "block"}}>
          <Webcam
          width={720}
          height={480} 
          imageSmoothing={true}
          mirrored={true}
          ref={webcamRef}
          videoConstraints={videoConstraints}
          />
        </div>
        <div style={{ color: "black"}}>Recording Time: {recordingTime} seconds</div>
        <div>
          {capturing ? (
            <><Button variant="light" onClick={handleStopCaptureClick}>Stop</Button>{' '}</>
          ) : (
            <><Button variant="light" onClick={handleStartCaptureClick}>Start</Button>{' '}</>
          )}
          {recordedChunks.length > 0 && (
            <>
              <Button variant="light" onClick={handleVideoPlay}>Replay</Button>{' '}
              <Button variant="light" onClick={handleSave}>Save</Button>{' '}
              <Button variant="light" onClick={handleDownload}>Download</Button>{' '}
            </>
          )}
        </div>
    </>
  );
}