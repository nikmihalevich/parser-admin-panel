import {
  GET_OUR_PRODUCTS,
  SET_DATA_LOADING,
  GET_SHOPS_DATA,
  SET_OUR_PRODUCTS_DATE_LAST_UPDATE,
} from "../actions/types";

const initialState = {
  our_products: {},
  data_loading: false,
  our_products_date_last_update: null,
  shops_messages: {},
  shops_data: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_OUR_PRODUCTS:
      return {
        ...state,
        our_products: action.payload,
      };
    case SET_DATA_LOADING:
      return {
        ...state,
        data_loading: action.payload,
      };
    case GET_SHOPS_DATA:
      return {
        ...state,
        shops_data: action.payload,
      };
    case SET_OUR_PRODUCTS_DATE_LAST_UPDATE:
      return {
        ...state,
        our_products_date_last_update: action.payload,
      };
    default:
      return state;
  }
}
