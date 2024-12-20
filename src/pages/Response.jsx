import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../context/SocketProvider";

export default function ResponsePage() {
  const [visitorData, setVisitorData] = useState(false);
  const { socket, isConnected } = useSocket();
  const { visitorID } = useSelector((state) => state.visitor);

  useEffect(() => {
    if (socket) {
      socket.on("visitor_verify", (data) => {
        if (data) {
          setVisitorData(data);
        }
        console.log("Received visitor_verify:", data);
      });

      return () => {
        socket.off("visitor_verify");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("visitor_info", visitorID);
      console.log("visitorID ==>", visitorID);
      return () => {
        socket.off("visitor_info");
      };
    }
  });

  return (
    <div className="full-page">
      <div className="header"></div>
      <div className="body">
        {visitorData ? (
          <div className="user-details">
            <img
              src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="user name"
              width="190px"
            />
            <div>
              <h1>Pradip Dobariya</h1>
              <h4>15 NOV 2024</h4>
            </div>
            <img src="/approve.png" alt="approved image here go go" />
            {/* <img src="/rejected.png" alt="approved image here go go" /> */}
          </div>
        ) : (
          <div className="loader">Please Wait A Second..</div>
        )}
      </div>
      <div className="footer">
        {visitorData && <button className="btn-full">Done</button>}
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
      </div>
    </div>
  );
}
