import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getItems } from "../redux/itemsSlice";
import "./styles/homepage.scss";
import { baseUrl } from "../api";
import { Button, Input, Spin } from "antd";

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
        <label>
          List of items{" "}
          <Input
            placeholder="Seach items here"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
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
                      style={{ border: "1px solid red" }}
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
            Add Items
          </Button>
          <Button onClick={onLogout} className="btns">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
