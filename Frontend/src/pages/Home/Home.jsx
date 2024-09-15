import React, { useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Event from '../../components/Event/Event';
function Home() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <div className='py-20 flex items-center justify-evenly'>
      <div className="p-6 w-1/2 max-w-md">
        <h1 className="text-4xl font-bold mb-4">Welcome, Krish 👋</h1>
        <p className="text-lg text-gray-600 mb-6">Upcoming Events</p>
        <div className="calendar-container">
          <Calendar
            className="rounded-md border border-gray-300"
            view="month"
            onChange={handleDateChange}
            value={date}
          />
        </div>
      </div>
      <div className='w-1/2'>
        <div>
          <select className="block w-32 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 cursor-pointer">
            <option>Any Type</option>
            <option>Online</option>
            <option>Offline</option>
          </select>
        </div>


        <div className="overflow-y-scroll h-96">
          <Event />
          <Event />
          <Event />
          <Event />
        </div>

      </div>
    </div>
  )
}

export default Home