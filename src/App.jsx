import { Routes, Route } from "react-router-dom";
import QRHandler from "./context/QRHandler";
import HomePage from "./pages/Home";
import ResponsePage from "./pages/Response";

function App() {
  return (
    <QRHandler>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/response" element={<ResponsePage />} />
      </Routes>
    </QRHandler>
  );
}

export default App;
