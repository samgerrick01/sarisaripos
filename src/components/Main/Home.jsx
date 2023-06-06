import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/home.scss";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../../redux/loginSlice";
import { IoLogIn } from "react-icons/io5";
import { loadingOff, loadingOn } from "../../redux/loadingSlice";
import { CgLogIn } from "react-icons/cg";
import { GrPowerReset } from "react-icons/gr";
//antd
// import { Input, Button } from "antd";
//bootstrap
import { Row, Col, Button, FormControl, Card } from "react-bootstrap";

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
      <Card
        style={{ padding: "12px", background: "lightblue", margin: "12px" }}
      >
        <Card.Body>
          <Card.Title>
            <IoLogIn style={{ width: "52px", height: "52px" }} />
            Login Form
          </Card.Title>
          <Row>
            <Col sm className="mb-3">
              <FormControl
                autoComplete="off"
                id="username"
                placeholder="Username"
                type="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </Col>
            <Col sm className="mb-3">
              <FormControl
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSubmit();
                  }
                }}
                autoComplete="off"
                id="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm className="mb-3">
              <Button onClick={onSubmit} variant="primary" className="w-100">
                <CgLogIn color="black" /> Login
              </Button>
            </Col>
            <Col sm className="mb-3">
              <Button onClick={onClear} variant="secondary" className="w-100">
                <GrPowerReset color="black" /> Clear
              </Button>
            </Col>
          </Row>
          <div className="w-100 d-flex justify-content-end">
            <label>v1.3</label>
          </div>
        </Card.Body>
      </Card>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Home;
