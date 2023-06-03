import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginStatus } from "../redux/loginSlice";
import { Button, Input } from "antd";
import "./styles/addItems.scss";
import axios from "axios";
import { baseUrl } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    barcode: "1",
    label: "",
    price: "",
    stocks: "1",
  });
  console.log(formData);

  const addItems = (e) => {
    e.preventDefault();
    if (formData.barcode) {
      axios
        .post(`${baseUrl}/add`, formData)
        .then((res) => {
          toast.success(res.data);
        })
        .catch((err) => toast.error("Server Error!"));
    }
  };

  const onClear = () => {
    setFormData({ barcode: "1", label: "", price: "", stocks: "1" });
    toast.dismiss();
  };

  const onBack = () => {
    navigate("/home-page");
    dispatch(loginStatus(false));
  };
  return (
    <div className="add-items">
      <div className="add-items-container">
        <label>Add items</label>
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
            Add
          </Button>
          <Button onClick={onClear} className="btns">
            Clear
          </Button>
          <Button onClick={onBack} className="btns">
            Back
          </Button>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AddItems;
