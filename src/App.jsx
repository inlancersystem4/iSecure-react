import { Routes, Route } from "react-router-dom";
import QRHandler from "./context/QRHandler";
import HomePage from "./pages/Home";
import ResponsePage from "./pages/Response";
import { SocketProvider } from "./context/SocketProvider";

function App() {
  return (
    <SocketProvider>
      <QRHandler>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/response" element={<ResponsePage />} />
        </Routes>
      </QRHandler>
    </SocketProvider>
  );
}

export default App;
