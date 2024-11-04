import React, { useContext, useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Event from '../../components/Event/Event';
import axios from 'axios'
import {MainContext} from '../../contexts/MainContext'
function Home() {
  
  const [location, setLocation] = useState("online");
  const [price, setPrice] = useState("free");
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const {user,date,setDate} = useContext(MainContext);
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const fetchEvents = async () => {
    try {
      const formattedDate = date.toLocaleDateString('en-CA');

      const response = await axios.post('http://localhost:9294/api/event/publicEvents', {
        date: formattedDate,
        location,
        price,
      }, { withCredentials: true });
      const formattedEvents = response.data.map(event => ({
        ...event,
        eventDate: new Date(event.eventDate).toLocaleDateString('en-CA'),
      }));
      setFetchedEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };
  function convertTo12HourFormat(time) {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);

    const ampm = hours >= 12 ? 'PM' : 'AM'; // Check if it's AM or PM
    hours = hours % 12 || 12; // Convert 0 (midnight) to 12 for 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  }
  useEffect(() => {
    fetchEvents(); // Fetch events when component mounts or filters change
  }, [date, location, price]);
  return (
    <div className='py-20 flex items-center justify-evenly'>
      <div className="p-6 w-1/2 max-w-md">
        <h1 className="text-4xl font-bold mb-4">Welcome, <br />{user?user.fullname: ""} 👋</h1>
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
        <div className='flex gap-3'>
          <select
            className="block w-32 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 cursor-pointer"
            value={location}
            onChange={handleLocationChange}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
          <select
            className="block w-32 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4 cursor-pointer"
            value={price}
            onChange={handlePriceChange}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>


        <div className="overflow-y-scroll h-96">
          {fetchedEvents.length > 0 ? (
            fetchedEvents.map((event) => {
              return (
                <Event
                  key={event._id}
                  image={event.eventThumbnail}
                  date={event.eventDate}
                  name={event.eventName}
                  host={event.organizer.fullname}
                  priceType={event.eventPrice}
                  priceValue={event.eventPriceValue}
                  attendees={event.attendees}
                  eventId={event._id}
                  status={event.status}
                  eventTimeFrom={convertTo12HourFormat(event.eventTimeFrom)}
                  eventTimeTo={convertTo12HourFormat(event.eventTimeTo)}
                />
              );
            })
          ) : (
            <div className="text-gray-500 mt-12 h-[20vh] flex">
               <h2 className="text-xl font-medium mb-2">No Events Found</h2>
             </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Home