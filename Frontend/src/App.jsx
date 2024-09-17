import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import {Toaster} from 'react-hot-toast'
import CreateEvent from './pages/CreateEvent/CreateEvent'
import EventDisplay from './pages/EventDisplay/EventDisplay'
import YourEvents from './pages/YourEvents/YourEvents'
function App() {
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/create' element={<CreateEvent />}/>
        <Route path='/event/:id' element={<EventDisplay />}/>
        <Route path='/yourevents' element={<YourEvents />}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
