import React, { useState } from 'react';

const MicInput = ({ onText, label = 'Speak or type your report/preferences', placeholder = 'Type or speak here...' }) => {
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  let recognition;

  // Check for browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const startRecording = () => {
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    setError(null);
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setRecording(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? prev + ' ' + transcript : transcript);
      onText && onText(transcript);
      setRecording(false);
    };
    recognition.onerror = (event) => {
      setError('Speech recognition error: ' + event.error);
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);
  };

  const stopRecording = () => {
    if (recognition) recognition.stop();
    setRecording(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onText && onText(e.target.value);
  };

  return (
    <div className="space-y-2 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={3}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`px-3 py-2 rounded-lg text-white font-semibold transition-colors duration-200 text-sm ${recording ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {recording ? 'Stop' : '🎤 Speak'}
        </button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
};

export default MicInput;
