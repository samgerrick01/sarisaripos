import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button, Input } from "antd";
import "../styles/addItems.scss";
import axios from "axios";
import { baseUrl } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadingOff, loadingOn } from "../../redux/loadingSlice";
import { BsDatabaseAdd } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Logout } from "../../functions";

const AddName = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    item: "",
    total: 0,
  });

  const addItems = (e) => {
    if (!formData.name) {
      toast.warning("Please Fill the Field!");
    } else {
      dispatch(loadingOn());
      axios
        .post(`${baseUrl}/addcreditor`, formData)
        .then((res) => {
          toast.success(res.data);
          dispatch(loadingOff());
          onBack();
        })
        .catch((err) => {
          toast.error("Server Error!");
          dispatch(loadingOff());
        });
    }
  };

  const onClear = () => {
    setFormData({ ...formData, name: "" });
    toast.dismiss();
  };

  const onBack = () => {
    navigate("/credit-list");
  };

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      Logout(dispatch, navigate);
    }
  }, []);
  return (
    <div className="add-items">
      <div className="add-items-container">
        <label>
          Credit Profile <BsDatabaseAdd color="lime" />
        </label>
        <div className="add-items-body">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name of Creditor"
          />
        </div>
        <div className="btns-container">
          <Button onClick={addItems} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <BsDatabaseAdd color="lime" /> Add
            </span>
          </Button>
          <Button onClick={onClear} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <GrPowerReset color="red" /> Clear
            </span>
          </Button>
          <Button onClick={onBack} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <RiArrowGoBackFill color="blue" /> Back
            </span>
          </Button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AddName;
