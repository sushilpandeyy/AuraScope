import React, { useRef, useState, useEffect } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

const UpperBodyPostureAnalyzer = () => {
  const videoRef = useRef(null);
  const [bodyAnalysis, setBodyAnalysis] = useState({});
  const [camera, setCamera] = useState(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  
  const [recordedData, setRecordedData] = useState([]); // Array to hold recorded parameters

  useEffect(() => {
    if (videoRef.current) {
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(handlePoseResults);

      const videoElement = videoRef.current;
      const cam = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      setCamera(cam);
      cam.start();
    }
  }, []);

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        console.log(bodyAnalysis); // Log current body analysis
        setRecordedData((prevData) => [...prevData, bodyAnalysis]); // Push to recorded data array
      }, 1000); // Log every second
    }

    return () => {
      clearInterval(interval); // Clean up the interval
    };
  }, [isRecording, bodyAnalysis]);

  const handlePoseResults = (results) => {
    const landmarks = results.poseLandmarks;

    if (landmarks) {
      const analysis = analyzeUpperBodyPosture(landmarks);
      setBodyAnalysis(analysis);
    }
  };

  // Analyze upper body posture based on upper body landmarks
  const analyzeUpperBodyPosture = (landmarks) => {
    const shoulderLeft = landmarks[11];
    const shoulderRight = landmarks[12];
    const elbowLeft = landmarks[13];
    const elbowRight = landmarks[14];
    const nose = landmarks[0];

    // Example analysis - you can expand this
    const shoulderSymmetry = Math.abs(shoulderLeft.x - shoulderRight.x);
    const elbowAngleLeft = calculateAngle(elbowLeft, shoulderLeft, nose);
    const elbowAngleRight = calculateAngle(elbowRight, shoulderRight, nose);

    return {
      shoulderSymmetry,
      elbowAngleLeft,
      elbowAngleRight,
      // Include any other analysis parameters you want to track
    };
  };

  // Function to calculate angles (example, implement your own logic)
  const calculateAngle = (pointA, pointB, pointC) => {
    // Implement angle calculation based on landmark coordinates
    return 0; // Placeholder
  };

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <button onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div>
        <h3>Recorded Data:</h3>
        <pre>{JSON.stringify(recordedData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default UpperBodyPostureAnalyzer;
