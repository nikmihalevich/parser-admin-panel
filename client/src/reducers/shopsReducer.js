import { 
  GET_OUR_PRODUCTS, 
  SET_OUR_PRODUCTS_LOADING, 
  GET_SHOPS_DATA, 
  SET_SHOPS_DATA_LOADING,
  SET_OUR_PRODUCTS_LOADING_MESSAGE,
  SET_OUR_PRODUCTS_DATE_LAST_UPDATE
 } from "../actions/types";

const initialState = {
  our_products: {},
  our_products_loading: false,
  our_products_date_last_update: null,
  shops_messages: {},
  shops_data: [],
  shops_data_loading: false,
};

const createArrForTable = (state, payload) => {
  let arr = state.our_products
  // eslint-disable-next-line
  arr.map((our_product, key) => {
    // eslint-disable-next-line
    payload.map((item, key) => {
      if(our_product.product_id === item.product_id) {
        // TODO shops price include into our products array MB ONLY DEBUG
        our_product.vprok_price = item.price
      }
    })
  })

  return arr
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_OUR_PRODUCTS:
      return {
        ...state,
        our_products: action.payload
      };
    case SET_OUR_PRODUCTS_LOADING:
      return {
        ...state,
        our_products_loading: action.payload
      };
    case GET_SHOPS_DATA:
      return {
        ...state,
        shops_data: createArrForTable(state, action.payload)
      };
    case SET_SHOPS_DATA_LOADING:
      return {
        ...state,
        shops_data_loading: action.payload
      };
    case SET_OUR_PRODUCTS_DATE_LAST_UPDATE:
      return {
        ...state,
        our_products_date_last_update: action.payload
      };
    case SET_OUR_PRODUCTS_LOADING_MESSAGE:
      return state;
    default:
      return state;
  }
}
