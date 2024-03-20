import { combineReducers } from "redux";
import authSlice from "./authSlice";
import cartSlice from "./cartSlice";
export default combineReducers({
  auth: authSlice,
  cart: cartSlice
});
