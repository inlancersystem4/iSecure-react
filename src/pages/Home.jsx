import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactMic } from "react-mic";
import {
  ArrowLeft,
  QrCode,
  RotateCcw,
  Mic,
  CircleStop,
  Aperture,
} from "lucide-react";
import { setNewQR } from "../redux/actions/actions";
import { post } from "../utils/apiHelper";

export default function HomePage() {
  const { qrDetails } = useSelector((state) => state.visitor);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const webcamRef = useRef(null);
  const questionIndexRef = useRef(0);

  const [record, setRecord] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    { id: 0, image_answer: null },
    { id: 1, question: "What is your Name?", answer_file: "" },
    { id: 2, question: "Flat Owner Name?", answer_file: "" },
    { id: 3, question: "Flat Number or Flat Owner Name?", answer_file: "" },
    { id: 4, question: "Reason of Visit?", answer_file: "" },
  ]);

  useEffect(() => {
    questionIndexRef.current = questionIndex;
  }, [questionIndex]);

  const handleFileUpload = async (file, index) => {
    try {
      const response = await post("/qr-details", {
        process_id: index,
        society_id: qrDetails.apartment,
        gate_id: qrDetails.gate,
        media_file: file,
      });
      if (response.success !== 1) {
        console.error("Failed to send file:", response);
      }
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[0].image_answer = imageSrc;
        return updatedQuestions;
      });

      handleFileUpload(imageSrc, 0);
      setTimeout(() => changeQuestionIndex(1), 100);
    }
  }, [handleFileUpload]);

  const handleRecordingStop = useCallback(
    (file) => {
      const currentIndex = questionIndexRef.current;
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[currentIndex].answer_file = file;
        return updatedQuestions;
      });

      handleFileUpload(file, currentIndex);
      setTimeout(() => changeQuestionIndex(1), 100);
    },
    [handleFileUpload]
  );

  const changeQuestionIndex = useCallback(
    (increment) => {
      setQuestionIndex((prevIndex) => {
        const nextIndex = prevIndex + increment;
        return nextIndex >= 0 && nextIndex < questions.length
          ? nextIndex
          : prevIndex;
      });
    },
    [questions.length]
  );

  const handleToggleRecording = useCallback(() => {
    setRecord((prevRecord) => !prevRecord);
  }, []);

  const handleResetQuestions = () => setQuestionIndex(0);

  const handleNewQrCode = () => {
    dispatch(setNewQR("yes"));
    navigate("/");
  };

  const renderQuestionContent = () => {
    const currentQuestion = questions[questionIndex];

    if (currentQuestion.id === 0) {
      return (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{ facingMode: "user" }}
          onUserMediaError={() => console.error("Error accessing camera")}
        />
      );
    }

    return (
      <>
        <h3>{currentQuestion.question}</h3>
        {currentQuestion.answer_file?.blob && (
          <audio controls>
            <source
              src={URL.createObjectURL(currentQuestion.answer_file.blob)}
            />
            Your browser does not support the audio element.
          </audio>
        )}
        {currentQuestion.image_answer && (
          <img
            src={currentQuestion.image_answer}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </>
    );
  };

  return (
    <div className="full-page">
      <header className="header">
        {questionIndex > 0 ? (
          <button className="btn" onClick={() => changeQuestionIndex(-1)}>
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div></div>
        )}
        <div className="btn-group">
          <button className="btn" onClick={handleResetQuestions}>
            <RotateCcw size={18} />
          </button>
          <button className="btn" onClick={handleNewQrCode}>
            <QrCode size={18} />
          </button>
        </div>
      </header>

      <main className="body">{renderQuestionContent()}</main>

      <footer className="footer">
        {questionIndex === 0 ? (
          <div className="controls">
            <button className="btn" onClick={handleCapture}>
              <Aperture />
            </button>
          </div>
        ) : (
          <>
            <ReactMic
              record={record}
              onStop={handleRecordingStop}
              strokeColor="#FF0000"
              backgroundColor="#000000"
            />
            <div className="controls">
              <button className="btn" onClick={handleToggleRecording}>
                {record ? <CircleStop /> : <Mic />}
              </button>
            </div>
          </>
        )}
      </footer>
    </div>
  );
}
