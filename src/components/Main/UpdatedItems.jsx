import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Button, Input, Modal } from "antd";
import "../styles/addItems.scss";
import "../styles/deleteModal.scss";
import axios from "axios";
import { baseUrl } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setSelectedItem } from "../../redux/itemsSlice";
import { loadingOff, loadingOn } from "../../redux/loadingSlice";
import { BsDatabaseAdd } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { Logout } from "../../functions";

const UpdateItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));
  let { id } = useParams();

  const { selectedItem } = useSelector((state) => state.items);

  const [formData, setFormData] = useState({
    barcode: "1",
    label: "",
    price: "",
    stocks: "1",
  });

  const [open, setOpen] = useState(false);

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
    if (!formData.label || !formData.price) {
      toast.warning("Please Fill the Field!");
    } else {
      dispatch(loadingOn());
      axios
        .put(`${baseUrl}/update/${id}`, formData)
        .then((res) => {
          toast.success(res.data);
          navigate("/home-page");
          dispatch(loadingOff());
        })
        .catch((err) => {
          toast.error("Server Error!");
          dispatch(loadingOff());
        });
    }
  };

  const deleteItem = () => {
    if (!formData.label || !formData.price) {
      toast.warning("Please Fill the Field!");
    } else {
      setOpen(true);
    }
  };

  const deleteHandle = () => {
    dispatch(loadingOn());
    axios
      .delete(`${baseUrl}/delete/${id}`)
      .then((res) => {
        toast.success(res.data);
        navigate("/home-page");
        dispatch(loadingOff());
      })
      .catch((err) => {
        toast.error("Server Error!");
        dispatch(loadingOff());
      });
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
        <label>
          Update items <BsDatabaseAdd color="lime" />
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
            type="number"
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
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <BsDatabaseAdd color="lime" /> Update
            </span>
          </Button>
          {user.status === "administrator" && (
            <Button onClick={deleteItem} className="btns">
              <span
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <FaTrash color="red" /> Delete
              </span>
            </Button>
          )}
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
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoWarning /> Warning!
          </div>
        }
        closable={false}
        footer={false}
        open={open}
      >
        <div className="delete-modal">
          <div style={{ fontSize: "20px" }}>
            Are you sure you want to delete {formData.label} ?
          </div>
          <div className="del-modal-btn">
            <Button className="del-btn" onClick={deleteHandle}>
              Delete
            </Button>
            <Button className="cancel-btn" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateItems;
