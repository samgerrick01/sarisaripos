import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import "../styles/homepage.scss";
import { baseUrl } from "../../api";
import { Button, Input, Spin } from "antd";
import { BsDatabaseAdd } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Logout } from "../../functions";
import { getCredits } from "../../redux/creditSlice";

const CreditList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { listOfCredits } = useSelector((state) => state.credits);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const [query, setQuery] = useState("");

  //Load the Items
  useEffect(() => {
    if (!sessionStorage.getItem("user")) {
      Logout(dispatch, navigate);
    } else {
      axios
        .get(`${baseUrl}/credits`)
        .then((res) => dispatch(getCredits(res.data)))
        .catch((err) => console.log(err));
    }
  }, []);

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
              List of Credits <AiOutlineUnorderedList color="red" />
            </span>
            <span style={{ fontWeight: "600" }}>
              May Utang: {listOfCredits.length}
            </span>
          </div>
          <Input
            placeholder="Seach items here"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="home-table">
          {!listOfCredits.length && (
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
          {listOfCredits.length != 0 && (
            <table className="my-table">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Name</th>
                  <th style={{ width: "20%" }}>Total</th>
                  {/* <th style={{ width: "20%" }}>Stocks</th> */}
                </tr>
              </thead>
              <tbody>
                {listOfCredits
                  .filter((data) =>
                    data.name.toLowerCase().includes(query.toLowerCase())
                  )
                  .map((data) => (
                    <tr
                      style={{ border: "1px solid darkred" }}
                      key={data.id}
                      onClick={() => {
                        if (user.status !== "user") {
                          navigate(`/updatecredit/${data.id}`);
                        }
                      }}
                    >
                      <td
                        style={{
                          width: "60%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {data.name}
                      </td>
                      <td
                        style={{
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        {data.total}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="btns-container">
          <Button onClick={() => navigate("/add-name")} className="btns">
            <span
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <BsDatabaseAdd color="lime" /> I-Add ang uutang
            </span>
          </Button>

          <Button onClick={() => navigate("/home-page")} className="btns">
            <span
              style={{ display: "flex", gap: "8px", justifyContent: "center" }}
            >
              <RiArrowGoBackFill color="red" /> Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreditList;
