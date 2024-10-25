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

  // State to hold an array of recorded analyses
  const [recordedAnalyses, setRecordedAnalyses] = useState([]);

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

  const handlePoseResults = (results) => {
    const landmarks = results.poseLandmarks;

    if (landmarks) {
      const analysis = analyzeUpperBodyPosture(landmarks);
      setBodyAnalysis(analysis);

      // Save the current analysis into the recordedAnalyses array
      setRecordedAnalyses((prev) => [...prev, analysis]);
      console.log("Recorded Analyses:", [...recordedAnalyses, analysis]); // Log the updated array
    }
  };

  // Analyze upper body posture based on upper body landmarks
  const analyzeUpperBodyPosture = (landmarks) => {
    const shoulderLeft = landmarks[11];
    const shoulderRight = landmarks[12];
    const elbowLeft = landmarks[13];
    const elbowRight = landmarks[14];
    const nose = landmarks[0];

    // Calculate shoulder symmetry
    const shoulderSymmetry = Math.abs(shoulderLeft.y - shoulderRight.y);

    // Return an object with relevant posture information
    return {
      shoulderLeft,
      shoulderRight,
      elbowLeft,
      elbowRight,
      nose,
      shoulderSymmetry,
      timestamp: Date.now(), // Optional: add timestamp for each entry
    };
  };

  return (
    <div>
      <video ref={videoRef} autoPlay></video>
      {/* Add additional UI elements as needed */}
    </div>
  );
};

export default UpperBodyPostureAnalyzer;
