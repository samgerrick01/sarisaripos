import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Button, Input } from "antd";
import "./styles/addItems.scss";
import axios from "axios";
import { baseUrl } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setSelectedItem } from "../redux/itemsSlice";

const UpdateItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { id } = useParams();

  const { selectedItem } = useSelector((state) => state.items);
  const { loginSuccess } = useSelector((state) => state.login);

  const [formData, setFormData] = useState({
    barcode: "1",
    label: "",
    price: "",
    stocks: "1",
  });

  useEffect(() => {
    if (Object.keys(selectedItem).length !== 0) {
      setFormData({
        ...formData,
        barcode:
          Object.keys(selectedItem).length !== 0 ? selectedItem.barcode : "",
        label: Object.keys(selectedItem).length !== 0 ? selectedItem.label : "",
        price: Object.keys(selectedItem).length !== 0 ? selectedItem.price : "",
        stocks:
          Object.keys(selectedItem).length !== 0 ? selectedItem.stocks : "",
      });
    }
  }, [selectedItem]);

  const updateItem = (e) => {
    e.preventDefault();
    if (!formData.label || !formData.price) {
      toast.warning("Please Fill the Field!");
    } else {
      axios
        .put(`${baseUrl}/update/${id}`, formData)
        .then((res) => {
          toast.success(res.data);
          navigate("/home-page");
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
  };

  useEffect(() => {
    if (!loginSuccess) {
      navigate("/");
    } else {
      axios
        .post(`${baseUrl}/selected`, { id })
        .then((res) => dispatch(setSelectedItem(res.data)))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="add-items">
      <div className="add-items-container">
        <label>Update items</label>
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
          <Button onClick={updateItem} className="btns">
            Update
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

export default UpdateItems;
