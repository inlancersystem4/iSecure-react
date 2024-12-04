import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactMic } from "react-mic";
import { toast } from "sonner";
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
  const [loader, setLoader] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([
    { id: 0, setp: "visitor_img", image_answer: null },
    {
      id: 1,
      setp: "visitor_name",
      question: "What is your Name?",
      answer_file: "",
    },
    {
      id: 2,
      setp: "flat_owner_name",
      question: "Flat Owner Name?",
      answer_file: "",
    },
    { id: 3, setp: "flat_number", question: "Flat Number?", answer_file: "" },
    {
      id: 4,
      setp: "reason",
      question: "Reason of Visit?",
      answer_file: "",
    },
  ]);

  useEffect(() => {
    questionIndexRef.current = questionIndex;
  }, [questionIndex]);

  const handleFileUpload = async () => {
    setLoader(true);
    const transformedQuestions = questions.map((question) => {
      return {
        step: question.setp,
        answer: question.answer_file || question.image_answer || "",
      };
    });

    const form_data = new FormData();
    form_data.append("society_id", qrDetails.apartment);
    form_data.append("gate_id", qrDetails.gate);
    transformedQuestions.forEach((question) => {
      form_data.append(`${question.step}`, question.answer);
    });
    try {
      const response = await post("/step/bulk-step-process", form_data);
      if (response.success == 1) {
        navigate("/response");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error sending file:", error);
    } finally {
      setLoader(false);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const mimeType = "image/jpeg";
      const imageBlob = base64ToBlob(imageSrc, mimeType);

      const file = new File([imageBlob], "image.jpg", { type: mimeType });

      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[0].image_answer = file;
        return updatedQuestions;
      });
      setTimeout(() => changeQuestionIndex(1), 100);
    }
  };

  const handleRecordingStop = (file) => {
    const { blobURL, options } = file;

    const blob = fetch(blobURL)
      .then((response) => response.blob())
      .then((blob) => {
        const mimeType = options.mimeType || "audio/webm";
        const audioFile = new File([blob], "audio_recording.webm", {
          type: mimeType,
        });
        const currentIndex = questionIndexRef.current;

        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[currentIndex].answer_file = audioFile;
          return updatedQuestions;
        });

        if (currentIndex == 4) {
          setTimeout(() => handleFileUpload(), 100);
        }
        setTimeout(() => changeQuestionIndex(1), 100);
      })
      .catch((err) => {
        console.error("Failed to fetch the blob URL", err);
      });
  };

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
          {questionIndex != 0 && (
            <button className="btn" onClick={handleResetQuestions}>
              <RotateCcw size={18} />
            </button>
          )}
          <button className="btn" onClick={handleNewQrCode}>
            <QrCode size={18} />
          </button>
        </div>
      </header>

      <main className="body">
        {renderQuestionContent()}
        {loader && (
          <div className="loader-message">Please wait a second 😊😊</div>
        )}
      </main>

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
              strokeColor="#2a3663"
              backgroundColor="#faf6e3"
            />
            <div className="controls">
              <button className="btn" onClick={handleToggleRecording}>
                {record ? <CircleStop /> : <Mic />}
              </button>
            </div>
          </>
        )}
        <div className="footer-bottom">
          <div className="group">
            <div className="box"></div>
            <div className="box"></div>
          </div>
          <div className="group">
            <div className="box"></div>
            <div className="box"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
