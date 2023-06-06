import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
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
//antd
import { Modal } from "antd";
//bootstrap
import { Row, Col, Button, FormControl, Card } from "react-bootstrap";

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
      <Card
        style={{
          padding: "12px",
          background: "lightblue",
          margin: "12px",
          width: "100%",
        }}
      >
        <Card.Body>
          <Card.Title>
            <BsDatabaseAdd color="black" /> Update Items
          </Card.Title>

          <Row>
            <Col sm className="mb-3">
              <FormControl
                autoComplete="off"
                id="item"
                placeholder="Name of the item"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </Col>
            <Col sm className="mb-3">
              <FormControl
                autoComplete="off"
                id="price"
                placeholder="How much the Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm className="mb-1">
              <Button onClick={updateItem} variant="success" className="w-100">
                <BsDatabaseAdd color="black" /> Update
              </Button>
            </Col>
            {sessionStorage.getItem("user")
              ? user.status === "administrator" && (
                  <Col sm className="mb-1">
                    <Button
                      onClick={deleteItem}
                      variant="danger"
                      className="w-100"
                    >
                      <FaTrash color="black" /> Delete
                    </Button>
                  </Col>
                )
              : null}
          </Row>
          <Row>
            <Col sm className="mb-1">
              <Button onClick={onClear} variant="secondary" className="w-100">
                <GrPowerReset color="black" /> Clear
              </Button>
            </Col>
            <Col sm className="mb-1">
              <Button onClick={onBack} variant="primary" className="w-100">
                <RiArrowGoBackFill color="black" /> Back
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
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
            <Button variant="danger" onClick={deleteHandle}>
              Delete
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateItems;
