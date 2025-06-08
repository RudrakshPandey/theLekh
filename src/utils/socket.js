import { io } from "socket.io-client";

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || ";

export const socket = io("http://localhost:5000", {
  autoConnect: false, // Prevent auto-connecting; call socket.connect() manually
});
