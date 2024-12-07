import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_KEY;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!SOCKET_URL) {
      console.error(
        "Socket URL is missing. Please define VITE_SOCKET_KEY in your .env file."
      );
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });

    socketInstance.connect();

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("reconnect_attempt");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSocket = () => {
  return useContext(SocketContext);
};
