import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevent auto-connecting; call socket.connect() manually
});