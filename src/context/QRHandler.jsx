import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import LayoutWrapper from "../components/ui/layout/LayoutWrapper";
import { toast } from "sonner";
import { post } from "../utils/apiHelper";
import { setQrToken, setQrDetail } from "../redux/actions/actions";

const QRHandler = ({ children }) => {
  const [token, setToken] = useState(null);
  const [qrFetchSuccess, setQRFetchSuccess] = useState(true);

  async function qrDetailsFetch(token) {
    try {
      const response = await post("/qr-details", { token: token });
      if (response.success == 1) {
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
      console.error("Error apartment data", e);
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      qrDetailsFetch(token);
    }
  }, [token]);

  return (
    <LayoutWrapper>
      {qrFetchSuccess ? <div>{children}</div> : <div className="">Loading</div>}
    </LayoutWrapper>
  );
};

QRHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default QRHandler;
