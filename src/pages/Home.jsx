import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";
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
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [record, setRecord] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    { id: 0, answer_file: "" },
    { id: 1, question: "What is your Name?", answer_file: "" },
    { id: 2, question: "Flat Owner Name?", answer_file: "" },
    { id: 3, question: "Flat Number or Flat Owner Name?", answer_file: "" },
    { id: 4, question: "Reason of Visit?", answer_file: "" },
  ]);

  const changeQuestionIndex = useCallback(
    (increment) => {
      setQuestionIndex((prevIndex) => {
        const nextIndex = prevIndex + increment;
        if (nextIndex >= 0 && nextIndex < questions.length) {
          return nextIndex;
        }
        return prevIndex;
      });
    },
    [questions.length]
  );

  const handleToggleRecording = useCallback(() => {
    setRecord((prev) => !prev);
  }, []);

  const onStop = useCallback(
    (file) => {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex].answer_file = file;
        console.log(updatedQuestions);
        return updatedQuestions;
      });

      changeQuestionIndex(1);
    },
    [questionIndex, changeQuestionIndex]
  );

  const handleResetQuestions = useCallback(() => {
    setQuestionIndex(0);
  }, []);

  const handleNewQrCode = () => {
    console.log("call");
    dispatch(setNewQR("yes"));
    navigate("/");
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].image_answer = imageSrc;
      return updatedQuestions;
    });
    changeQuestionIndex(1);
  }, [webcamRef, questionIndex, changeQuestionIndex]);

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
          onUserMediaError={() => console.log("Error accessing camera")}
          onScreenshot={(imageData) => onStop(imageData)}
        />
      );
    }

    return (
      <>
        <h3>{currentQuestion.question}</h3>
        {currentQuestion.audio_answer && (
          <audio controls>
            <source src={currentQuestion.audio_answer} />
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
      <div className="header">
        {questionIndex != 0 ? (
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
      </div>

      <div className="body">{renderQuestionContent()}</div>

      <div className="footer">
        {questionIndex == 0 ? (
          <div className="controls">
            <button className="btn" onClick={capture}>
              <Aperture />
            </button>
          </div>
        ) : (
          <>
            <ReactMic
              record={record}
              onStop={onStop}
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
      </div>
    </div>
  );
}
