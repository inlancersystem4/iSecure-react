import { useState } from "react";
import { ReactMic } from "react-mic";
import { ArrowLeft, QrCode, RotateCcw } from "lucide-react";

export default function HomePage() {
  const [record, setRecord] = useState(false);

  const handleStart = () => {
    setRecord(true);
  };

  const handleStop = () => {
    setRecord(false);
  };

  const onStop = (recordedBlob) => {
    console.log("Recorded Blob:", recordedBlob);
  };

  return (
    <div className="full-page">
      <div className="header">
        <button className="btn">
          <ArrowLeft size={18} />
        </button>
        <div className="btn-group">
          <button className="btn">
            <RotateCcw size={18} />
          </button>
          <button className="btn">
            <QrCode size={18} />
          </button>
        </div>
      </div>
      <div className="body"></div>
      <div className="footer">
        <ReactMic
          record={record}
          onStop={onStop}
          strokeColor="#FF0000"
          backgroundColor="#000000"
        />
        <div className="controls">
          <button className="btn" onClick={handleStart}>
            Start Recording
          </button>
          <button className="btn" onClick={handleStop}>
            Stop Recording
          </button>
        </div>
      </div>
    </div>
  );
}
