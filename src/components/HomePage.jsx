import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getItems } from "../redux/itemsSlice";
import "./styles/homepage.scss";
import { baseUrl } from "../api";
import { Button, Input, Spin } from "antd";
import { loginStatus } from "../redux/loginSlice";
import { BsDatabaseAdd } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.items);
  const { loginSuccess } = useSelector((state) => state.login);

  const [query, setQuery] = useState("");

  //Load the Items
  useEffect(() => {
    if (!loginSuccess) {
      navigate("/");
    } else {
      axios
        .get(`${baseUrl}/items`)
        .then((res) => dispatch(getItems(res.data)))
        .catch((err) => console.log(err));
    }
  }, []);

  const addItems = () => {
    navigate("/add-items");
  };

  const onLogout = () => {
    navigate("/");
    dispatch(loginStatus(false));
  };

  return (
    <div className="homepage">
      <div className="homepage-container">
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>
              List of items <AiOutlineUnorderedList color="red" />
            </span>
            <span style={{ fontWeight: "600" }}>
              Total Items: {items.length}
            </span>
          </div>
          <Input
            placeholder="Seach items here"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="home-table">
          {!items.length && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin />
            </div>
          )}
          {items.length != 0 && (
            <table className="my-table">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Items</th>
                  <th style={{ width: "20%" }}>Price</th>
                  {/* <th style={{ width: "20%" }}>Stocks</th> */}
                </tr>
              </thead>
              <tbody>
                {items
                  .filter(
                    (data) =>
                      data.label.toLowerCase().includes(query.toLowerCase()) ||
                      data.barcode.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((data) => (
                    <tr
                      style={{ border: "1px solid darkred" }}
                      key={data.id}
                      onClick={() => navigate(`/update/${data.id}`)}
                    >
                      <td
                        style={{
                          width: "60%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {data.label}
                      </td>
                      <td
                        style={{
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        {data.price}
                      </td>
                      {/* <td style={{ width: "20%", textAlign: "center" }}>
                        {data.stocks}
                      </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="btns-container">
          <Button onClick={addItems} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <BsDatabaseAdd color="lime" /> Add Items
            </span>
          </Button>
          <Button onClick={onLogout} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <BiLogOutCircle color="red" /> Log Out
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
