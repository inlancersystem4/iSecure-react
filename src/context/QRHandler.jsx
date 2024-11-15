import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LayoutWrapper from "../components/ui/layout/LayoutWrapper";
import { post } from "../utils/apiHelper";
import { setQrToken, setQrDetail } from "../redux/actions/actions";
import { useNavigate } from "react-router-dom";

const QRHandler = ({ children }) => {
  const { newQr } = useSelector((state) => state.visitor);
  const dispatch = useDispatch();

  const [token, setToken] = useState(null);
  const [qrFetchSuccess, setQRFetchSuccess] = useState(true);
  const [scanQROn, setScanQROn] = useState(true);
  const navigate = useNavigate();

  async function qrDetailsFetch(token) {
    try {
      const response = await post("/qr-details", { token: token });
      if (response.success === 1) {
        dispatch(
          setQrDetail({
            gate: response.data.gate,
            apartment: response.data.apartment,
          })
        );
        dispatch(setQrToken(token));
        setQRFetchSuccess(true);
      } else {
        dispatch(setQrToken(""));
        setQRFetchSuccess(false);
        toast.error("Failed to fetch QR details. Please try again later.");
      }
    } catch (e) {
      dispatch(setQrToken(""));
      // setQRFetchSuccess(false);
      console.error("Error fetching QR details", e);
    }
  }

  const handleScan = (data) => {
    const rawValue = data[0].rawValue;

    if (rawValue) {
      const decodedUrl = decodeURIComponent(rawValue);

      const url = new URL(decodedUrl);
      const urlToken = url.searchParams.get("token");

      if (urlToken) {
        const url = new URL(decodedUrl);
        const domain = url.hostname;
        if (domain !== import.meta.env.VITE_DOMAIN) {
          toast.error(
            "Error: The URL domain does not match the expected domain."
          );
        } else {
          setToken(urlToken);
          dispatch(setQrToken(urlToken));
          navigate(`/?token=${urlToken}`);
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
    if (err.name === "OverconstrainedError") {
      toast.error(
        "Overconstrained error: Please check your camera settings or permissions."
      );
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      navigate(`/?token=${urlToken}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      qrDetailsFetch(token);
      setScanQROn(false);
    } else {
      setScanQROn(true);
    }
  }, [token]);

  useEffect(() => {
    if (newQr && newQr === "yes") {
      setScanQROn(true);
    }
  }, [newQr]);

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
