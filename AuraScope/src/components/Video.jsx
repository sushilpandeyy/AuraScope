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
    const shoulderSymmetryScore = shoulderSymmetry < 0.05 ? 'Good' : 'Needs Improvement';

    // Calculate arm position (based on elbow height difference)
    const armPosition = Math.abs(elbowLeft.y - elbowRight.y);
    const armPositionScore = armPosition < 0.1 ? 'Relaxed' : 'Tensed';

    // Calculate head alignment (whether the nose is centered relative to shoulders)
    const headAlignment = Math.abs(nose.x - (shoulderLeft.x + shoulderRight.x) / 2);
    const headAlignmentScore = headAlignment < 0.05 ? 'Aligned' : 'Tilted';

    // Confidence score (based on how well the points align)
    const confidenceScore = Math.floor(
      ((shoulderSymmetryScore === 'Good' ? 1 : 0) +
        (armPositionScore === 'Relaxed' ? 1 : 0) +
        (headAlignmentScore === 'Aligned' ? 1 : 0)) *
        (100 / 3)
    );

    return {
      shoulderSymmetry: shoulderSymmetryScore,
      armPosition: armPositionScore,
      headAlignment: headAlignmentScore,
      confidenceScore,
      feedback: confidenceScore > 70 ? 'Great upper body posture!' : 'Posture needs improvement',
    };
  };

  // Start audio recording
  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setAudioChunks([]);

        mediaRecorder.start();
        setIsRecording(true);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          setIsRecording(false);
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Download recorded audio
  const downloadAudio = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = audioURL;
      link.download = 'recorded_audio.webm';
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-4">Upper Body Posture Analyzer with Audio</h2>

      <video ref={videoRef} className="border rounded" autoPlay muted width="640" height="480"></video>

      {/* Display body analysis */}
      <div className="w-full mt-4 p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-bold mb-2">Upper Body Analysis Result</h3>
        {bodyAnalysis.confidenceScore ? (
          <ul className="list-disc list-inside">
            <li>Shoulder Symmetry: {bodyAnalysis.shoulderSymmetry}</li>
            <li>Arm Position: {bodyAnalysis.armPosition}</li>
            <li>Head Alignment: {bodyAnalysis.headAlignment}</li>
            <li>Confidence Score: {bodyAnalysis.confidenceScore}</li>
            <li>Feedback: {bodyAnalysis.feedback}</li>
          </ul>
        ) : (
          <p>No analysis available yet. Please ensure your webcam is active.</p>
        )}
      </div>

      {/* Audio Recording Controls */}
      <div className="mt-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Start Audio Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Stop Audio Recording
          </button>
        )}

        {audioBlob && (
          <div className="mt-4 space-x-4">
            <button
              onClick={playAudio}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Play Recorded Audio
            </button>
            <button
              onClick={downloadAudio}
              className="px-4 py-2 bg-purple-500 text-white rounded"
            >
              Download Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpperBodyPostureAnalyzer;