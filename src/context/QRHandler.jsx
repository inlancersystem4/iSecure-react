import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import LayoutWrapper from "../components/ui/layout/LayoutWrapper";
import { post } from "../utils/apiHelper";
import { setQrToken, setQrDetail, setNewQR } from "../redux/actions/actions";
import { useNavigate, useLocation } from "react-router-dom";

const QRHandler = ({ children }) => {
  const { newQr } = useSelector((state) => state.visitor);
  const dispatch = useDispatch();

  const [token, setToken] = useState(null);
  const [qrFetchSuccess, setQRFetchSuccess] = useState(false);
  const [loader, setLoader] = useState(false);

  const [scanQROn, setScanQROn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  async function qrDetailsFetch(token) {
    const from_data = new FormData();
    from_data.append("gate_token", token);
    setLoader(true);
    try {
      const response = await post("/info/society-info", from_data);
      if (response.success == 1) {
        dispatch(
          setQrDetail({
            gate: response.data.id,
            apartment: response.data.society_id,
          })
        );
        dispatch(setQrToken(token));
        dispatch(setNewQR(""));
        navigate(`/?token=${token}`);
        setQRFetchSuccess(true);
        setScanQROn(false);
        setLoader(false);
      } else {
        dispatch(setQrToken(""));
        dispatch(setNewQR(""));
        setScanQROn(true);
        setLoader(false);
        setQRFetchSuccess(false);
        toast.error("Failed to fetch QR details. Please try again later.");
      }
    } catch (e) {
      dispatch(setQrToken(""));
      setLoader(false);
      dispatch(setNewQR(""));
      setQRFetchSuccess(false);
      setScanQROn(true);
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
          qrDetailsFetch(urlToken);
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
    if (newQr === "yes" || newQr == "yes") {
      setScanQROn(true);
    }
  }, [newQr]);

  return (
    <LayoutWrapper>
      {loader ? (
        <div className="full-page">
          <div className="qr-logo">
            <img src="/logo.png" alt="" width="180px" />
          </div>
          <div className="body border-y">
            <div>Please Wait a Second 😊😊</div>
          </div>
        </div>
      ) : location.pathname == "/response" ? (
        <div>{children}</div>
      ) : scanQROn ? (
        <div className="full-page">
          <div className="qr-logo">
            <img src="/logo.png" alt="" width="180px" />
          </div>
          <div className="body border-y">
            <Scanner delay={300} onError={handleError} onScan={handleScan} />
          </div>
          <div className="qr-scan-title">
            <h1>Scann QR Code</h1>
          </div>
        </div>
      ) : qrFetchSuccess ? (
        <div>{children}</div>
      ) : (
        <div>Something went wrong</div>
      )}
    </LayoutWrapper>
  );
};

QRHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QRHandler;
