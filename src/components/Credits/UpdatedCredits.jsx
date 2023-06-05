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

const UpdatedCredits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let { id } = useParams();

  const { selectedCredit } = useSelector((state) => state.credits);

  const { items } = useSelector((state) => state.items);

  const [openModal, setOpenModal] = useState(false);

  const [openModal1, setOpenModal1] = useState(false);

  const [totalC, setTotalC] = useState(0);

  const [reqData, setReqData] = useState({
    item: "",
    total: 0,
  });

  const [formData, setFormData] = useState({
    item: "",
    price: "",
    qty: "",
    total: "",
  });

  const parseItems = !selectedCredit.item ? "" : selectedCredit.item.split(",");

  useEffect(() => {
    if (!items.length) {
      axios
        .get(`${baseUrl}/items`)
        .then((res) => dispatch(getItems(res.data)))
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(selectedCredit).length !== 0) {
      setTotalC(
        Object.keys(selectedCredit).length !== 0 ? selectedCredit.total : 0
      );
    }
  }, [selectedCredit]);

  const addItem = () => {
    if (!formData.item || !formData.price || !formData.qty) {
      toast.warning("Please Fill the Field!");
    } else {
      dispatch(loadingOn());
      axios
        .put(`${baseUrl}/updateCredit/${id}`, reqData)
        .then((res) => {
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
      .then((res) => dispatch(setSelectedCredit(res.data)))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      Logout(dispatch, navigate);
    } else {
      callSelectedAPI();
    }
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      total: parseInt(formData.price) * parseInt(formData.qty) || "",
    });
  }, [formData.qty, formData.price]);

  useEffect(() => {
    setReqData({
      ...reqData,
      item: !selectedCredit.item
        ? `${formData.item}/${formData.price}@${formData.qty}=${formData.total}`
        : `${selectedCredit.item},${formData.item}/${formData.price}@${formData.qty}=${formData.total}`,
      total: totalC + parseInt(formData.total) || 0,
    });
  }, [formData]);

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
                  document.getElementById("quantity").focus();
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
                autoComplete="off"
                disabled
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
          <div style={{ fontSize: "20px", overflow: "auto" }}>
            {parseItems.length
              ? parseItems.map((data, id) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: "14px",
                    }}
                    key={id}
                  >
                    {data}
                  </div>
                ))
              : `Si ${selectedCredit.name} ay wala pang nauutang!`}
            <div>Total: {selectedCredit.total}</div>
          </div>
          <div className="del-modal-btn">
            {selectedCredit.total > 0 ? (
              <Button variant="danger" onClick={() => setOpenModal1(true)}>
                Paid
              </Button>
            ) : null}

            <Button variant="primary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
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
    </div>
  );
};

export default UpdatedCredits;
