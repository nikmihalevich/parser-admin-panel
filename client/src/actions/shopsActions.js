import axios from "axios";

import {
  GET_OUR_PRODUCTS,
  SET_DATA_LOADING,
  GET_DATE_LAST_UPDATE,
  GET_SHOPS_DATA,
  SET_IMPORT_OUR_PRODUCTS_MESSAGE,
  SET_UPDATE_OUR_PRODUCTS_PRICES_MESSAGE
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

      dispatch(getShopsData())
      dispatch(getDateLastUpdate())

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
        type: GET_DATE_LAST_UPDATE,
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

export const refreshPerekrestok = (userId, percent) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .post("/vprok/parse", { _id: userId, percent })
    .then((res) => {
      dispatch(getShopsData())
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
      dispatch(getShopsData())
      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const importOurProducts = (userId, data) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .post("/our-products/import", {_id: userId, data})
    .then((res) => {
      const { message } = res.data

      dispatch({
        type: SET_IMPORT_OUR_PRODUCTS_MESSAGE,
        payload: message,
      });

      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: SET_IMPORT_OUR_PRODUCTS_MESSAGE,
        payload: "Ошибка сервера",
      });

      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    });
};

export const setImportOurProductsMessage = (message) => (dispatch) => {
    dispatch({
      type: SET_IMPORT_OUR_PRODUCTS_MESSAGE,
      payload: message,
    });
};

export const updateOurProductsPrices = (userId, data) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOADING,
    payload: true,
  });
  axios
    .post("/our-products/updatePrices", { _id: userId, data })
    .then((res) => {
      const { message } = res.data

      dispatch({
        type: SET_UPDATE_OUR_PRODUCTS_PRICES_MESSAGE,
        payload: message,
      });

      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    })
    .catch((err) => {
      console.log(err);

      dispatch({
        type: SET_UPDATE_OUR_PRODUCTS_PRICES_MESSAGE,
        payload: "Ошибка сервера",
      });

      dispatch({
        type: SET_DATA_LOADING,
        payload: false,
      });
    });
};

export const updateOurProductsPricesMessage = (message) => (dispatch) => {
    dispatch({
      type: SET_UPDATE_OUR_PRODUCTS_PRICES_MESSAGE,
      payload: message,
    });
};