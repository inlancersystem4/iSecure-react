import { Routes, Route } from "react-router-dom";
import QRHandler from "./context/QRHandler";
import HomePage from "./pages/Home";

function App() {
  return (
    <QRHandler>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </QRHandler>
  );
}

export default App;
