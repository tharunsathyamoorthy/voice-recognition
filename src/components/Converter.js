import React, { useState, useEffect } from "react";
import axios from "axios";
import './Converter.css';


function Converter() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (window.SpeechRecognition) {
      const recognition = new window.SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };

      if (isListening) recognition.start();
      else recognition.stop();

      return () => recognition.stop();
    } else {
      alert("Your browser does not support speech recognition.");
    }
  }, [isListening]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(speech);
      speech.onstart = () => setIsSpeaking(true);
      speech.onend = () => setIsSpeaking(false);
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  };

  const saveTranscript = async (type) => {
    const text = type === 'voice' ? transcript : textToSpeak;
    if (!text.trim()) {
      alert("No text to save.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/save-transcript", { text, type });
      alert(`${type === 'voice' ? "Voice" : "Text"} Transcript saved!`);
      fetchTranscripts(); // Refresh the transcript list
    } catch (error) {
      console.error("Error saving transcript:", error);
    }
  };

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-transcripts");
      setTranscripts(response.data);
    } catch (error) {
      console.error("Error fetching transcripts:", error);
    }
  };

  useEffect(() => {
    fetchTranscripts(); // Fetch transcripts on component mount
  }, []);

  return (
    <div>
      <h1>Voice and Speech Converter</h1>
      <div className="voice-recognition">
        <button onClick={() => setIsListening(!isListening)}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <p className="transcript">{transcript}</p>
        <button onClick={() => saveTranscript('voice')} disabled={!transcript.trim()}>
          Save Voice Transcript
        </button>
      </div>

      <div className="text-to-speech">
        <textarea
          value={textToSpeak}
          onChange={(e) => setTextToSpeak(e.target.value)}
          placeholder="Enter text to convert to voice"
        />
        <button onClick={handleSpeak} disabled={isSpeaking || !textToSpeak.trim()}>
          {isSpeaking ? "Speaking..." : "Speak Text"}
        </button>
        <button onClick={() => saveTranscript('text')} disabled={!textToSpeak.trim()}>
          Save Text Transcript
        </button>
      </div>

      <h2>Saved Transcripts</h2>
      <ul>
        {transcripts.map((item, index) => (
          <li key={index}>
            <strong>{item.type === 'voice' ? 'Voice' : 'Text'}:</strong> {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Converter;
