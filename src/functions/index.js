import { loadingOff, loadingOn } from "../redux/loadingSlice";
import { setUser } from "../redux/loginSlice";

export const Logout = async (dispatch, navigate) => {
  dispatch(loadingOn());
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(500);
  dispatch(loadingOff());
  dispatch(setUser({}));
  sessionStorage.removeItem("user");
  navigate("/");
};
