import { combineReducers } from "redux";
import authReducer from "./authReducer";
import shopsReducer from "./shopsReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  shops: shopsReducer,
  errors: errorReducer
});
