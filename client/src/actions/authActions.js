import axios from "axios";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/auth/login", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { _id } = res.data.user;
      localStorage.setItem("_id", _id);
      // Set token to Auth header
      // setAuthToken(token);
      // Decode token to get user data
      // const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(res.data.user));
    })
    .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      }
    );
};

// Set logged in user
export const setCurrentUser = id => {
  return {
    type: SET_CURRENT_USER,
    payload: id
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("_id");
  // Remove auth header for future requests
  // setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
