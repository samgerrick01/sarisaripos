import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { useNavigate } from "react-router";
import "./styles/home.scss";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginStatus } from "../redux/loginSlice";
import { IoLogIn } from "react-icons/io5";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loginSuccess } = useSelector((state) => state.login);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.warning("Please Fill the field!");
    } else {
      axios
        .post(`${baseUrl}/login`, formData)
        .then((res) => {
          if (res.data === "Login Success!") {
            toast.success(res.data);
            dispatch(loginStatus(true));
          } else {
            toast.warning(res.data);
          }
        })
        .catch((err) => toast.error("Server is not Running!"));
    }
  };

  const onClear = () => {
    setFormData({ username: "", password: "" });
    document.getElementById("username").focus();
    toast.dismiss();
  };

  useEffect(() => {
    if (loginSuccess) {
      navigate("/home-page");
    }
  }, [loginSuccess]);

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
            Login
          </Button>
          <Button onClick={onClear} className="btns">
            Clear
          </Button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Home;
