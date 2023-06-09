import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Main/Home'
import AddItems from './components/Main/AddItems'
import HomePage from './components/Main/HomePage'
import UpdateItems from './components/Main/UpdatedItems'
import Loading from './components/Loading'
import CreditList from './components/Credits/CreditList'
import AddName from './components/Credits/AddName'
import UpdatedCredits from './components/Credits/UpdatedCredits'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/add-items" element={<AddItems />} />
                <Route path="/home-page" element={<HomePage />} />
                <Route path="/update/:id" element={<UpdateItems />} />
                <Route path="/credit-list" element={<CreditList />} />
                <Route path="/add-name" element={<AddName />} />
                <Route path="/updatecredit/:id" element={<UpdatedCredits />} />
            </Routes>
            <Loading />
        </BrowserRouter>
    )
}

export default App
