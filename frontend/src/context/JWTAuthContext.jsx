import { createContext, useEffect, useReducer, useRef } from "react";
import axiosInstance from "../services/axios";
import { validateToken } from "../utils/jwt";
import { resetSession, setSession } from "../utils/session";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

export const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && validateToken(accessToken)) {
          setSession(accessToken);

          const response = await axiosInstance.get("/users/me");
          const { data: user } = response;
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };
    initialize();
    isMounted.current = true;
  }, []);

  const getTokens = async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      setSession(response.data.access_token, response.data.refresh_token);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await getTokens(email, password);
      const response = await axiosInstance.get("/users/me");
      const { data: user } = response;
      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const logout = () => {
    resetSession();
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = async (userId, userData) => {
    try {
      console.log("123", userData)
      const response = await axiosInstance.put(`/users/update`, userData);
      const updatedUser = response.data;

      // Optionally, update the local session or state with the new user info
      // This depends on how your session management is set up
      // For example, if you're storing the user in Redux:
      dispatch({
        type: "UPDATE_USER",
        payload: {
          user: updatedUser,
        },
      });
      console.log("upd: ", updatedUser)
      // Return the updated user data
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;
