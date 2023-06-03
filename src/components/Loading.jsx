import React from "react";
import { Modal, Spin } from "antd";
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
      <Spin />
    </Modal>
  );
};

export default Loading;
