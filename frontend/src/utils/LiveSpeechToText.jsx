import { useEffect, useRef, useState } from "react";

const LiveSpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;  // IMPORTANT for fast updates
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk + " ";
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      // Show combined final + interim transcript for live update
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionRef.current = recognition;

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "80%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "12px",
        fontSize: "18px",
        fontWeight: "500",
        textAlign: "center",
        zIndex: 9999,
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "pre-wrap",
      }}
    >
      {transcript || "Speak now..."}
    </div>
  );
};

export default LiveSpeechToText;
