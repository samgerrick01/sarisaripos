import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { json, useNavigate } from "react-router";
import "./styles/home.scss";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../redux/loginSlice";
import { IoLogIn } from "react-icons/io5";
import { loadingOff, loadingOn } from "../redux/loadingSlice";
import { CgLogIn } from "react-icons/cg";
import { GrPowerReset } from "react-icons/gr";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.login);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const onSubmit = (e) => {
    if (!formData.username || !formData.password) {
      toast.warning("Please Fill the field!");
    } else {
      dispatch(loadingOn());
      axios
        .post(`${baseUrl}/login`, formData)
        .then((res) => {
          if (res.data.message === "Login Success!") {
            toast.success(res.data.message);
            dispatch(setUser(res.data.user));
            sessionStorage.setItem("user", JSON.stringify(res.data.user));
            dispatch(loadingOff());
          } else {
            toast.warning(res.data.message);
            dispatch(loadingOff());
          }
        })
        .catch((err) => {
          toast.error("Server is not Running!");
          dispatch(loadingOff());
        });
    }
  };

  const onClear = () => {
    setFormData({ username: "", password: "" });
    document.getElementById("username").focus();
    toast.dismiss();
  };

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      navigate("/home-page");
    }
  }, [user]);

  return (
    <div className="home">
      <div className="login-container">
        <label className="home-title">
          <IoLogIn style={{ width: "52px", height: "52px" }} />
          Login Form
        </label>
        <Input
          autoComplete="off"
          id="username"
          onChange={(e) => {
            setFormData({ ...formData, username: e.target.value });
          }}
          value={formData.username}
          placeholder="Username"
          className="input"
          onPressEnter={onSubmit}
        />
        <Input
          autoComplete="off"
          id="password"
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
          }}
          value={formData.password}
          type="password"
          placeholder="Password"
          className="input"
          onPressEnter={onSubmit}
        />
        <div className="btns-container">
          <Button onClick={onSubmit} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <CgLogIn color="lime" /> Login
            </span>
          </Button>
          <Button onClick={onClear} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <GrPowerReset color="red" /> Clear
            </span>
          </Button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Home;
