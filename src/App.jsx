import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AddItems from "./components/AddItems";
import HomePage from "./components/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/add-items" element={<AddItems />} />
        <Route path="/home-page" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
