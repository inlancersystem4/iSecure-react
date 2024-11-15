import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./styles/global.css";
import App from "./App.jsx";
import store from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster
      position="top-center"
      toastOptions={{
        className: "toast",
      }}
    />
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <App />
    </BrowserRouter>
  </Provider>
);
