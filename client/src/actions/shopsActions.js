import axios from "axios";

import { 
  GET_OUR_PRODUCTS, 
  SET_OUR_PRODUCTS_LOADING, 
  SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
  SET_SHOPS_DATA_LOADING, 
  GET_SHOPS_DATA,
} from "./types";

export const getOurProducts = () => dispatch => {
  dispatch({
    type: SET_OUR_PRODUCTS_LOADING,
    payload: true
  })
  axios
    .get("/our-products")
    .then(res => {
      const { products } = res.data;

      dispatch({
          type: GET_OUR_PRODUCTS,
          payload: products
      });
      dispatch({
        type: SET_OUR_PRODUCTS_LOADING,
        payload: false
      })
    })
    .catch(err => {
        console.log(err)
      }
    );
};

export const refreshOurProducts = (userId) => dispatch => {
  dispatch({
    type: SET_OUR_PRODUCTS_LOADING,
    payload: true
  })
  axios
    .post("/our-products/refresh", {_id: userId})
    .then(res => {
      const { message } = res.data;
      
      dispatch({
        type: SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
        payload: new Date().toISOString()
      })

      dispatch({
        type: SET_OUR_PRODUCTS_LOADING,
        payload: false
      })

    })
    .catch(err => {
        console.log(err)
      }
    );
};

export const getDateLastUpdateOurProducts = () => dispatch => {
  dispatch({
    type: SET_OUR_PRODUCTS_LOADING,
    payload: true
  })
  axios
    .get("/our-products/one")
    .then(res => {
      const { product } = res.data;

      dispatch({
        type: SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
        payload: product.updatedAt
      })

      dispatch({
        type: SET_OUR_PRODUCTS_LOADING,
        payload: false
      })

    })
    .catch(err => {
        console.log(err)
      }
    );
};

export const getShopsData = () => dispatch => {
  dispatch({
    type: SET_SHOPS_DATA_LOADING,
    payload: true
  })
  dispatch(getOurProducts())
  axios
    .get("/vprok")
    .then(res => {
      const { products } = res.data;

      dispatch({
          type: GET_SHOPS_DATA,
          payload: products
      });
      dispatch({
        type: SET_SHOPS_DATA_LOADING,
        payload: false
      })
    })
    .catch(err => {
        console.log(err)
      }
    );
};

