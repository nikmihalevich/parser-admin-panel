import {
  GET_OUR_PRODUCTS,
  SET_DATA_LOADING,
  GET_SHOPS_DATA,
  GET_DATE_LAST_UPDATE,
  SET_IMPORT_OUR_PRODUCTS_MESSAGE
} from "../actions/types";

const initialState = {
  our_products: {},
  data_loading: false,
  date_last_update: {},
  shops_messages: {},
  shops_data: [],
  import_our_products_message: ""
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
    case GET_DATE_LAST_UPDATE:
      return {
        ...state,
        date_last_update: action.payload,
      };
    case SET_IMPORT_OUR_PRODUCTS_MESSAGE:
      return {
        ...state,
        import_our_products_message: action.payload,
      };
    default:
      return state;
  }
}
