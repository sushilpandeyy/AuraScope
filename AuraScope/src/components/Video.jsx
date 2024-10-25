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
  const [question, setQuestion] = useState('');
  const [isQuestionVisible, setIsQuestionVisible] = useState(false); // New state to control question visibility

  const randomQuestions = [
    'What is your biggest goal for this week?',
    'How do you feel about your current posture?',
    'What can you do to improve your posture today?',
    'What is one habit you want to build this month?',
    'How do you feel after sitting for long hours?'
  ];

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
        width: 320, // Reduced width
        height: 240, // Reduced height
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

  const analyzeUpperBodyPosture = (landmarks) => {
    const shoulderLeft = landmarks[11];
    const shoulderRight = landmarks[12];
    const elbowLeft = landmarks[13];
    const elbowRight = landmarks[14];
    const nose = landmarks[0];

    const shoulderSymmetry = Math.abs(shoulderLeft.y - shoulderRight.y);
    const shoulderSymmetryScore = shoulderSymmetry < 0.05 ? 'Good' : 'Needs Improvement';

    const armPosition = Math.abs(elbowLeft.y - elbowRight.y);
    const armPositionScore = armPosition < 0.1 ? 'Relaxed' : 'Tensed';

    const headAlignment = Math.abs(nose.x - (shoulderLeft.x + shoulderRight.x) / 2);
    const headAlignmentScore = headAlignment < 0.05 ? 'Aligned' : 'Tilted';

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

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setAudioChunks([]);

        mediaRecorder.start();
        setIsRecording(true);
        setIsQuestionVisible(true); // Show question section when recording starts

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

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = audioURL;
      link.download = 'recorded_audio.webm';
      link.click();
    }
  };

  // Function to show a random question
  const handleNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    setQuestion(randomQuestions[randomIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen bg-gradient-to-r from-indigo-100 to-blue-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upper Body Posture Analyzer with Audio</h2>

      <div className="relative w-[320px] h-[240px] border-4 border-blue-300 rounded-lg overflow-hidden shadow-lg mb-4">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted></video>
      </div>

      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Upper Body Analysis Result</h3>
        {bodyAnalysis.confidenceScore ? (
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>Shoulder Symmetry: {bodyAnalysis.shoulderSymmetry}</li>
            <li>Arm Position: {bodyAnalysis.armPosition}</li>
            <li>Head Alignment: {bodyAnalysis.headAlignment}</li>
            <li>Confidence Score: {bodyAnalysis.confidenceScore}</li>
            <li className="font-semibold">Feedback: {bodyAnalysis.feedback}</li>
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No analysis available yet. Please ensure your webcam is active.</p>
        )}
      </div>

      <div className="mt-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-200"
          >
            Start Audio Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            Stop Audio Recording
          </button>
        )}

        {audioBlob && (
          <div className="mt-2 space-x-2">
            <button
              onClick={playAudio}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
            >
              Play Recorded Audio
            </button>
            <button
              onClick={downloadAudio}
              className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:bg-purple-600 transition duration-200"
            >
              Download Audio
            </button>
          </div>
        )}
      </div>

      {/* Random Question Field */}
      {isQuestionVisible && (
        <div className="mt-6 p-4 w-full max-w-md bg-white rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Question of the Day</h3>
          <p className="text-gray-600 text-sm mb-4">{question || 'Click below to see today\'s question!'}</p>
          <button
            onClick={handleNewQuestion}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
          >
            Next question
          </button>
        </div>
      )}
    </div>
  );
};

export default UpperBodyPostureAnalyzer;
