import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import {Toaster} from 'react-hot-toast'
function App() {
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
