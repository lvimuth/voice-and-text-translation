import { IconMicrophone } from "@tabler/icons-react";
import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function SpeechRecognitionComponent({ setSourceText }) {
  const { transcript, listing } = useSpeechRecognition();
  useEffect(() => {
    setSourceText(transcript);
  }, [transcript, setSourceText]);

  const handlingVoiceRecording = () => {
    if (listing) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
  };

    return <div>
        <IconMicrophone
            size={22}
            className="text-gray-400"
            onClick={handlingVoiceRecording}
        />
  </div>;
}

export default SpeechRecognitionComponent;
