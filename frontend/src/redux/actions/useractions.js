import { logoutUser } from "../../services/authService";
import { SET_LOGOUT_USER } from "../features/auth/authSlice";
export const logout = () => async (dispatch) => {
  try {
    await logoutUser();
    dispatch(SET_LOGOUT_USER(false));
  } catch (error) {
    console.log(error);
  }
};
