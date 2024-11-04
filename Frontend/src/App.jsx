import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login/Login'
import {Toaster} from 'react-hot-toast'
import CreateEvent from './pages/CreateEvent/CreateEvent'
import EventDisplay from './pages/EventDisplay/EventDisplay'
import YourEvents from './pages/YourEvents/YourEvents'
import ManageEvent from './pages/ManageEvent/ManageEvent'
import Notifications from './pages/Notifications/Notifications'
import Bookmarks from './pages/Bookmarks/Bookmarks'
import AttendedEvents from './pages/AttendedEvents/AttendedEvents'

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
        <Route path='/manage/:id' element={<ManageEvent />} />
        <Route path='/notifications' element={<Notifications />}/>
        <Route path='/bookmarks' element={<Bookmarks />}/>
        <Route path='/attended' element={<AttendedEvents />}/>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
