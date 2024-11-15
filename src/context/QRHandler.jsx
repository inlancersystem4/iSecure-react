import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import LayoutWrapper from "../components/ui/layout/LayoutWrapper";
import { post } from "../utils/apiHelper";
import { setQrToken, setQrDetail } from "../redux/actions/actions";

const QRHandler = ({ children }) => {
  const [token, setToken] = useState(null);
  const [qrFetchSuccess, setQRFetchSuccess] = useState(true);
  const [scanQROn, setScanQROn] = useState(false);

  async function qrDetailsFetch(token) {
    try {
      const response = await post("/qr-details", { token: token });
      if (response.success === 1) {
        setQrDetail({
          gate: response.data.gate,
          apartment: response.data.apartment,
        });
        setQrToken(token);
        setQRFetchSuccess(true);
      } else {
        setQrToken("");
        setQRFetchSuccess(false);
        toast.error("Failed to fetch QR details. Please try again later.");
      }
    } catch (e) {
      setQrToken("");
      // setQRFetchSuccess(false);
      console.error("Error fetching QR details", e);
    }
  }

  const handleScan = (data) => {
    const rawValue = data[0].rawValue;
    console.log(rawValue);

    if (rawValue) {
      const decodedUrl = decodeURIComponent(rawValue);

      const urlToken = new URLSearchParams(data).get("token");

      if (urlToken) {
        setToken(urlToken);

        const url = new URL(decodedUrl);
        const domain = url.hostname;

        if (domain !== import.meta.env.VITE_DOMAIN) {
          toast.error(
            "Error: The URL domain does not match the expected domain."
          );
        }
      } else {
        toast.error("Error: No token found in the URL.");
      }
    } else {
      toast.error("Error: Raw value is empty.");
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      qrDetailsFetch(token);
      setScanQROn(false);
    } else {
      setScanQROn(true);
    }
  }, [token]);

  return (
    <LayoutWrapper>
      {scanQROn ? (
        <Scanner delay={300} onError={handleError} onScan={handleScan} />
      ) : qrFetchSuccess ? (
        <div>{children}</div>
      ) : (
        <div>Loading...</div>
      )}
    </LayoutWrapper>
  );
};

QRHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QRHandler;
