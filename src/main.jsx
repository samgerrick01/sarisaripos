import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.scss";
import { Provider } from "react-redux";
import store from "./redux/store.js";

//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap/dist/react-bootstrap.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
