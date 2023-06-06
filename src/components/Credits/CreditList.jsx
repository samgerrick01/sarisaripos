import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import "../styles/homepage.scss";
import { baseUrl } from "../../api";
import { BsDatabaseAdd } from "react-icons/bs";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Logout } from "../../functions";
import { getCredits } from "../../redux/creditSlice";

//bootstrap
import {
  Row,
  Col,
  Button,
  FormControl,
  Card,
  Table,
  Spinner,
} from "react-bootstrap";

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
      <Card
        style={{
          padding: "12px",
          background: "lightblue",
          margin: "12px",
          width: "100%",
        }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between w-100 mb-1">
            <label className="component-title">
              <AiOutlineUnorderedList color="red" />
              List of Creditors
            </label>
            <label className="component-title">
              May Utang: {listOfCredits.length}
            </label>
          </div>

          <FormControl
            placeholder="Seach name here"
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="home-table">
            {!listOfCredits.length && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner />
              </div>
            )}
            {listOfCredits.length != 0 && (
              <Table
                striped
                bordered
                hover
                variant="light"
                className="my-table"
              >
                <thead>
                  <tr>
                    <th style={{ width: "60%" }}>Name</th>
                    <th style={{ width: "20%" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {listOfCredits
                    .filter((data) =>
                      data.name.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((data) => (
                      <tr
                        key={data.id}
                        onClick={() => navigate(`/updatecredit/${data.id}`)}
                        style={{ height: "52px" }}
                      >
                        <td>{data.name}</td>
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
              </Table>
            )}
          </div>

          <Row>
            <Col sm className="mb-2">
              <Button
                className="w-100"
                onClick={() => navigate("/add-name")}
                variant="success"
              >
                <span
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <BsDatabaseAdd color="black" /> I-Add ang uutang
                </span>
              </Button>
            </Col>
            <Col sm className="mb-2">
              <Button
                className="w-100"
                onClick={() => navigate("/home-page")}
                variant="primary"
              >
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreditList;
