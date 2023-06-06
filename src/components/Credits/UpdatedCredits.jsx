import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Modal, Select } from "antd";
import "../styles/addItems.scss";
import "../styles/deleteModal.scss";
import axios from "axios";
import { baseUrl } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadingOff, loadingOn } from "../../redux/loadingSlice";
import { BsDatabaseAdd } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoWarning } from "react-icons/io5";
import { Logout } from "../../functions";
import { setSelectedCredit } from "../../redux/creditSlice";
import { getItems } from "../../redux/itemsSlice";
import { AiOutlineUnorderedList } from "react-icons/ai";

//bootstrap
import { Row, Col, Button, FormControl, Card } from "react-bootstrap";

let item = [];
let total = 0;

const UpdatedCredits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { id } = useParams();

  const { selectedCredit } = useSelector((state) => state.credits);

  const { items } = useSelector((state) => state.items);

  const [openModal, setOpenModal] = useState(false);

  const [openModal1, setOpenModal1] = useState(false);

  const [openModal2, setOpenModal2] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    item: "",
    price: "",
    qty: "",
    total: "",
  });

  useEffect(() => {
    const idVal =
      Object.keys(selectedCredit).length !== 0
        ? selectedCredit.item.length !== 0 &&
          selectedCredit.item[selectedCredit.item.length - 1].id
        : 0;

    setFormData({ ...formData, id: idVal + 1 });
  }, [selectedCredit]);

  const addItem = () => {
    if (!formData.item || !formData.qty) {
      toast.warning("Please Fill the Field!");
    } else {
      item.push(formData);
      total = total + formData.total;
      dispatch(loadingOn());
      axios
        .put(`${baseUrl}/updateCredit/${id}`, { item, total })
        .then((res) => {
          item = [];
          total = 0;
          toast.success(res.data);
          dispatch(loadingOff());
          callSelectedAPI();
          onClear();
        })
        .catch((err) => {
          toast.error("Server Error!");
          dispatch(loadingOff());
          onClear();
        });
    }
  };

  const paidHandle = () => {
    dispatch(loadingOn());
    axios
      .delete(`${baseUrl}/deleteCredit/${id}`)
      .then((res) => {
        toast.success(res.data);
        navigate("/credit-list");
        setOpenModal(false);
        setOpenModal1(false);
        dispatch(loadingOff());
      })
      .catch((err) => {
        toast.error("Server Error!");
        dispatch(loadingOff());
      });
  };

  const onClear = () => {
    setFormData({ ...formData, item: "", price: "", qty: "", total: "" });
    toast.dismiss();
  };

  const onBack = () => {
    navigate("/credit-list");
  };

  const callSelectedAPI = () => {
    axios
      .post(`${baseUrl}/selectedCredit`, { id })
      .then((res) => {
        dispatch(setSelectedCredit(res.data));
        if (res.data.item.length !== 0) {
          item = item.concat(res.data.item);
          total = res.data.total;
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      Logout(dispatch, navigate);
    } else {
      if (!items.length) {
        axios
          .get(`${baseUrl}/items`)
          .then((res) => dispatch(getItems(res.data)))
          .catch((err) => console.log(err));
      }
      total = 0;
      item = [];
      callSelectedAPI();
    }
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      total: parseInt(formData.price) * parseInt(formData.qty) || "",
    });
  }, [formData.qty]);

  const [itemToRemove, setItemToRemove] = useState(null);
  const removeItem = () => {
    let idx = item.findIndex((data) => data.id === itemToRemove.id);
    item.splice(idx, 1);
    total = total - itemToRemove.total;
    dispatch(loadingOn());
    axios
      .put(`${baseUrl}/updateCredit/${id}`, { item, total })
      .then((res) => {
        item = [];
        total = 0;
        toast.success("Remove Success!");
        dispatch(loadingOff());
        callSelectedAPI();
      })
      .catch((err) => {
        toast.error("Server Error!");
        dispatch(loadingOff());
      });

    setOpenModal2(false);
  };
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
            <BsDatabaseAdd color="black" /> Mag add ng item
          </Card.Title>
          <Row className="mb-2">
            <Col>
              <Select
                size="large"
                className="w-100"
                mode="combobox"
                showSearch
                value={formData.item}
                onChange={(e) => {
                  const getPrice = items.find((el) => el.label === e).price;
                  setFormData({
                    ...formData,
                    item: e,
                    price: getPrice,
                  });
                  if (e !== "Load") {
                    document.getElementById("quantity").focus();
                  }
                }}
              >
                {items
                  .filter(
                    (data) =>
                      data.label
                        .toLowerCase()
                        .includes(formData.item.toLowerCase()) ||
                      data.barcode
                        .toLowerCase()
                        .includes(formData.item.toLowerCase())
                  )
                  .map((data) => (
                    <Select.Option key={data.id} value={data.label}>
                      {data.label}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormControl
                id="presyo"
                disabled={formData.item !== "Load"}
                autoComplete="off"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Price"
              />
            </Col>

            <Col>
              <FormControl
                autoComplete="off"
                id="quantity"
                type="number"
                value={formData.qty}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    qty: e.target.value,
                  });
                }}
                placeholder="Qty"
              />
            </Col>
          </Row>
        </Card.Body>

        <Row>
          <Col sm className="mb-1">
            <Button className="w-100" variant="success" onClick={addItem}>
              <span
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <BsDatabaseAdd color="black" /> Add
              </span>
            </Button>
          </Col>

          <Col sm className="mb-1">
            <Button
              className="w-100"
              variant="warning"
              onClick={() => setOpenModal(true)}
            >
              <span
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <AiOutlineUnorderedList color="black" /> View Items
              </span>
            </Button>
          </Col>
        </Row>

        <Row>
          <Col sm className="mb-1">
            <Button className="w-100" variant="secondary" onClick={onClear}>
              <span
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <GrPowerReset color="black" /> Clear
              </span>
            </Button>
          </Col>

          <Col sm className="mb-1">
            <Button className="w-100" variant="primary" onClick={onBack}>
              <span
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <RiArrowGoBackFill color="black" /> Back
              </span>
            </Button>
          </Col>
        </Row>
      </Card>

      <ToastContainer position="top-center" />
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoWarning /> List of Items
          </div>
        }
        closable={false}
        footer={false}
        open={openModal}
      >
        <div className="delete-modal">
          {selectedCredit.total !== 0 && (
            <div
              style={{ fontSize: "14px", color: "red" }}
              className="d-flex justify-content-center"
            >
              ⬇️ Click the item to remove!⬇️
            </div>
          )}

          <div style={{ fontSize: "20px", overflow: "auto" }}>
            <div className="d-flex">
              <div className="list-utang" style={{ width: "60%" }}>
                Item
              </div>
              <div
                className="list-utang d-flex justify-content-center"
                style={{ width: "15%" }}
              >
                Qty
              </div>
              <div
                className="list-utang d-flex justify-content-center"
                style={{ width: "25%" }}
              >
                Total
              </div>
            </div>
            <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
              {Object.keys(selectedCredit).length
                ? selectedCredit.item.length !== 0 &&
                  selectedCredit.item.map((data) => (
                    <div
                      onClick={() => {
                        setItemToRemove(data);
                        setOpenModal2(true);
                      }}
                      key={data.id}
                      className="d-flex w-100"
                      style={{ border: "1px solid black", padding: "2px" }}
                    >
                      <div className="text-item-detail">{data.item}</div>
                      <div
                        style={{
                          borderRight: "1px solid black",
                          width: "15%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {data.qty}
                      </div>
                      <div
                        style={{
                          width: "25%",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {data.total}
                      </div>
                    </div>
                  ))
                : null}
            </div>

            {selectedCredit.total === 0 && (
              <div className="d-flex justify-content-center">
                Wala pa syang utang!
              </div>
            )}

            {selectedCredit.total !== 0 && (
              <div className="d-flex justify-content-end">
                Total:
                <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                  {selectedCredit.total}
                </span>
              </div>
            )}
          </div>
          <div className="del-modal-btn">
            {selectedCredit.total > 0 ? (
              <Button variant="danger" onClick={() => setOpenModal1(true)}>
                Paid
              </Button>
            ) : null}
            <div
              className={
                selectedCredit.total === 0
                  ? "d-flex justify-content-end w-100"
                  : ""
              }
            >
              <Button variant="primary" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoWarning /> Warning
          </div>
        }
        closable={false}
        footer={false}
        open={openModal1}
      >
        <div className="delete-modal">
          <div style={{ fontSize: "20px", overflow: "auto" }}>
            Are you sure {selectedCredit.name} is paid ?
          </div>
          <div className="del-modal-btn">
            <Button variant="danger" onClick={paidHandle}>
              Paid
            </Button>
            <Button variant="primary" onClick={() => setOpenModal1(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoWarning /> Remove Item
          </div>
        }
        closable={false}
        footer={false}
        open={openModal2}
      >
        <div className="delete-modal">
          <div style={{ fontSize: "20px", overflow: "auto" }}>
            Remove {itemToRemove !== null && itemToRemove.item} ?
          </div>
          <div className="del-modal-btn">
            <Button variant="danger" onClick={removeItem}>
              Remove
            </Button>
            <Button variant="primary" onClick={() => setOpenModal2(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpdatedCredits;
