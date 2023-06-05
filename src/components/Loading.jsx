import React from "react";
import { Modal } from "antd";
import Spinner from "react-bootstrap/Spinner";
import "../main.scss";
import { useSelector } from "react-redux";

const Loading = () => {
  const { loading } = useSelector((state) => state.loading);
  return (
    <Modal
      width={62.5}
      className="modal-antd"
      open={loading}
      footer={false}
      closable={false}
    >
      <Spinner />
    </Modal>
  );
};

export default Loading;
