import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button, Input } from "antd";
import "./styles/addItems.scss";
import axios from "axios";
import { baseUrl } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadingOff, loadingOn } from "../redux/loadingSlice";
import { BsDatabaseAdd } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Logout } from "../functions";

const AddItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    barcode: "1",
    label: "",
    price: "",
    stocks: "1",
  });

  const addItems = (e) => {
    if (!formData.label || !formData.price) {
      toast.warning("Please Fill the Field!");
    } else {
      dispatch(loadingOn());
      axios
        .post(`${baseUrl}/add`, formData)
        .then((res) => {
          toast.success(res.data);
          dispatch(loadingOff());
        })
        .catch((err) => {
          toast.error("Server Error!");
          dispatch(loadingOff());
        });
    }
  };

  const onClear = () => {
    setFormData({ barcode: "1", label: "", price: "", stocks: "1" });
    toast.dismiss();
  };

  const onBack = () => {
    navigate("/home-page");
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
          Add items <BsDatabaseAdd color="lime" />
        </label>
        <div className="add-items-body">
          {/* <Input
            value={formData.barcode}
            onChange={(e) =>
              setFormData({ ...formData, barcode: e.target.value })
            }
            placeholder="Barcode"
          /> */}
          <Input
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            placeholder="Name of the item"
          />
          <Input
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="How much the Price"
          />
          {/* <Input
            value={formData.stocks}
            onChange={(e) =>
              setFormData({ ...formData, stocks: e.target.value })
            }
            placeholder="How Many Stocks"
          /> */}
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

export default AddItems;
