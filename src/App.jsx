import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Main/Home'
import AddItems from './components/Main/AddItems'
import HomePage from './components/Main/HomePage'
import UpdateItems from './components/Main/UpdatedItems'
import Loading from './components/Loading'
import CreditList from './components/Credits/CreditList'
import AddName from './components/Credits/AddName'
import UpdatedCredits from './components/Credits/UpdatedCredits'
import ViewListahan from './components/Listahan/ViewListahan'
import AddLista from './components/Listahan/AddLista'
import UpdateLista from './components/Listahan/UpdateLista'
import Nav from './components/Nav'
import Ecalculator from './components/Ecalculator'

function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/add-items" element={<AddItems />} />
                <Route path="/home-page" element={<HomePage />} />
                <Route path="/update/:id" element={<UpdateItems />} />
                <Route path="/credit-list" element={<CreditList />} />
                <Route path="/add-name" element={<AddName />} />
                <Route path="/updatecredit/:id" element={<UpdatedCredits />} />
                <Route path="/listahan" element={<ViewListahan />} />
                <Route path="/add-lista" element={<AddLista />} />
                <Route path="/update-lista/:id" element={<UpdateLista />} />
                <Route path="/e-calculator" element={<Ecalculator />} />
            </Routes>
            <Loading />
        </BrowserRouter>
    )
}

export default App
