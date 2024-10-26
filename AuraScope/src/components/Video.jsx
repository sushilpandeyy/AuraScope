import React, { useRef, useState, useEffect } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WavEncoder from 'wav-encoder';

const UpperBodyPostureAnalyzer = () => {
  let { testid } = useParams();
  const videoRef = useRef(null);
  const [bodyAnalysis, setBodyAnalysis] = useState({});
  const [camera, setCamera] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [question, setQuestion] = useState('');
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [transcription, setTranscription] = useState(''); // Store transcription text

  const ASSEMBLY_AI_API_KEY = '8488517fdeff4eb38f02b0a532753ce0';

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:3000/questions?testId=${testid}`);
        if (response.ok) {
          const data = await response.json();
          const parsedQuestions = data.map((item) => {
            try {
              const questionData = JSON.parse(item.question);
              return questionData.map(q => q.question); // Extract question text
            } catch (error) {
              console.error("Error parsing question JSON:", error);
              return [];
            }
          }).flat();
          setRandomQuestions(parsedQuestions);
        } else {
          console.error('Failed to fetch questions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (testid) {
      fetchQuestions();
    }
  }, [testid]);

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
        width: 320,
        height: 240,
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
    console.log('Starting audio recording...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setAudioChunks([]);

        mediaRecorder.start();
        setIsRecording(true);
        setIsQuestionVisible(true);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.onstop = async () => {
          console.log('Recording stopped. Creating audio blob...');
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Convert to WAV format
          const wavBlob = await convertToWav(audioBlob);
          setAudioBlob(wavBlob);
          setIsRecording(false);

          transcribeAudio(wavBlob); // Transcribe audio after recording stops
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
  };

  const stopRecording = () => {
    console.log('Stopping audio recording...');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Convert WebM Blob to WAV using wav-encoder
  const convertToWav = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const wavArrayBuffer = await WavEncoder.encode({
      sampleRate: audioBuffer.sampleRate,
      channelData: audioBuffer.getChannelData(0) // mono channel
    });

    return new Blob([wavArrayBuffer], { type: 'audio/wav' });
  };

  // Transcribe audio using AssemblyAI
  const transcribeAudio = async (blob) => {
    try {
      console.log("Blob size:", blob.size);
      console.log("Blob type:", blob.type);
  
      const formData = new FormData();
      formData.append('file', blob, 'audio.wav'); 
  
      const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
        headers: {
          authorization: ASSEMBLY_AI_API_KEY,
          'Content-Type': 'multipart/form-data' 
        },
      });
  
      const fileUrl = uploadResponse.data.upload_url;
  
      const transcriptResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        { audio_url: fileUrl },
        { headers: { authorization: ASSEMBLY_AI_API_KEY } }
      );
  
      const transcriptId = transcriptResponse.data.id;
  
      const pollingInterval = setInterval(async () => {
        const { data } = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { authorization: ASSEMBLY_AI_API_KEY },
        });
  
        if (data.status === 'completed') {
          clearInterval(pollingInterval);
          setTranscription(data.text); 
          console.log('Transcription:', data.text);
        } else if (data.status === 'failed') {
          clearInterval(pollingInterval);
          console.error('Transcription failed');
        }
      }, 5000); 
    } catch (error) {
      console.error('Error during transcription:', error);
    }
  };
  

  const handleNewQuestion = () => {
    if (randomQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * randomQuestions.length);
      setQuestion(randomQuestions[randomIndex]);
      console.log('New question:', randomQuestions[randomIndex]);
    } else {
      console.log('No questions available.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen bg-gradient-to-r from-indigo-100 to-blue-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Upper Body Posture Analyzer with Audio</h2>

      <div className="relative w-96 h-96 border-4 border-blue-300 rounded-lg overflow-hidden shadow-lg mb-4">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted></video>
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
              onClick={() => playAudio(audioBlob)}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200"
            >
              Play Recorded Audio
            </button>
            
          </div>
        )}
      </div>

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

      {transcription && (
        <div className="mt-4 p-4 w-full max-w-md bg-white rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Transcription</h3>
          <p className="text-gray-600 text-sm mb-4">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default UpperBodyPostureAnalyzer;
