import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
console.log("Socket URL:", import.meta.env.VITE_SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevent auto-connecting; call socket.connect() manually
});