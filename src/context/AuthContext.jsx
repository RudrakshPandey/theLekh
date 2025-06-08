import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useReducer, useRef } from "react";
import axios from "axios";
import { checkToken, removeToken, setToken } from "../utils/checkToken";
import { socket } from "../utils/socket";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("blog_AuthToken") || null,
  isAuthenticated: false,
  loading: true,
  allBlogs: [],
  notifications: [],
  unreadCount: 0,
};

const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  LOAD_USER: "LOAD_USER",
  LOAD_ALL_BLOGS: "LOAD_ALL_BLOGS",
  SET_LOADING: "SET_LOADING",
  NEW_NOTIFICATION: "NEW_NOTIFICATION",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload.decoded,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: true,
        notifications: [],
        unreadCount: 0,
      };
    case actionTypes.LOAD_USER:
      return {
        ...state,
        user: action.payload.userData,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actionTypes.LOAD_ALL_BLOGS:
      return {
        ...state,
        allBlogs: action.payload,
      };
    case actionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };
    case actionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case actionTypes.ADD_NOTIFICATION: {
      const newNotification = {
        ...action.payload,
        read: false,
        createdAt: action.payload.timestamp || new Date().toISOString(),
      };

      const updatedNotifications = [newNotification, ...state.notifications];

      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const base_url = import.meta.env.VITE_API_BASE_URL;

  // useRef to keep stable notification handler for cleanup
  const notificationHandlerRef = useRef();

  const loadUser = async () => {
    const token = localStorage.getItem("blog_AuthToken");
    if (checkToken(token)) {
      try {
        const res = await axios.get(`${base_url}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        dispatch({
          type: actionTypes.LOAD_USER,
          payload: { userData, token },
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: actionTypes.LOGOUT });
      }
    } else {
      dispatch({ type: actionTypes.LOGOUT });
    }

    dispatch({ type: actionTypes.SET_LOADING, payload: false });
  };

  const loginUser = async (credentials) => {
  try {
    // Get super admin email from env
    const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL;
    const isSuperAdmin = credentials.email === superAdminEmail;

    // Determine which login route to hit
    const loginEndpoint = isSuperAdmin
      ? `${base_url}/admin/login`
      : `${base_url}/users/login`;

    // Perform login request
    const res = await axios.post(loginEndpoint, credentials);
    const { token } = res.data;

    // Store token and decode
    setToken(token);
    const decoded = jwtDecode(token);

    // Dispatch login to context
    dispatch({
      type: actionTypes.LOGIN,
      payload: { decoded, token },
    });
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};


  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${base_url}/notifications`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({
        type: actionTypes.SET_NOTIFICATIONS,
        payload: res.data.notifications,
      });
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchAllBlog = async () => {
    try {
      const res = await axios.get(`${base_url}/blogs`);
      dispatch({
        type: actionTypes.LOAD_ALL_BLOGS,
        payload: res.data.blogs,
      });
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  const logout = () => {
    removeToken();
    dispatch({ type: actionTypes.LOGOUT });
    if (socket.connected) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    loadUser();
    fetchAllBlog();
  }, []);

  useEffect(() => {
  if (!state.user || !state.user._id) {
    if (socket.connected) {
      socket.disconnect();
    }
    return;
  }

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("addUser", state.user._id);

  notificationHandlerRef.current = (notification) => {
    console.log("🚨 Received Notification:", notification);
    dispatch({
      type: actionTypes.ADD_NOTIFICATION,
      payload: notification,
    });
  };

  socket.on("getNotification", notificationHandlerRef.current);
  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err.message);
  });

  // Cleanup to remove listener
  return () => {
    socket.off("getNotification", notificationHandlerRef.current);
  };
}, [state.user]);


  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        loginUser,
        logout,
        loadUser,
        fetchAllBlog,
        fetchNotifications,
        clearNotifications: () =>
          dispatch({ type: actionTypes.CLEAR_NOTIFICATIONS }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;