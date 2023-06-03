import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AddItems from "./components/AddItems";
import HomePage from "./components/HomePage";
import UpdateItems from "./components/UpdatedItems";
import Loading from "./components/Loading";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/add-items" element={<AddItems />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/update/:id" element={<UpdateItems />} />
      </Routes>
      <Loading />
    </BrowserRouter>
  );
}

export default App;
