import { setUser } from "../redux/loginSlice";

export const Logout = (dispatch, navigate) => {
  dispatch(setUser({}));
  sessionStorage.removeItem("user");
  navigate("/");
};
