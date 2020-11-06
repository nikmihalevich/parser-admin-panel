import axios from "axios";

import {
  GET_OUR_PRODUCTS,
  SET_DATA_LOADING,
  SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
  GET_SHOPS_DATA,
} from "./types";

export const getOurProducts = () => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .get("/our-products")
    .then((res) => {
      const { products } = res.data;

      dispatch({
        type: GET_OUR_PRODUCTS,
        payload: products,
      });
      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const refreshOurProducts = (userId) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .post("/our-products/refresh", { _id: userId })
    .then((res) => {
      dispatch({
        type: SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
        payload: new Date().toISOString(),
      });

      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDateLastUpdate = () => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .get("/data/lastupdate")
    .then((res) => {
      const { lastUpdate } = res.data;

      dispatch({
        type: SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
        payload: lastUpdate,
      });

      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getShopsData = () => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .get("/data")
    .then((res) => {
      const { data } = res.data;

      dispatch({
        type: GET_SHOPS_DATA,
        payload: data,
      });
      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const refreshPerekrestok = (userId) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .post("/vprok/parse", { _id: userId })
    .then((res) => {
      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const refreshOkey = (userId) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .post("/okey/parse", { _id: userId })
    .then((res) => {
      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
