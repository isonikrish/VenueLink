import React, { useContext, useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUser,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa'; // Import icons from react-icons
import eventDemo from '../../assets/eventDemo.jpg';
import UserAvatar from '../../assets/user-avatar.png'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import AttendEvent from '../../components/AttendEvent';
import { MainContext } from '../../contexts/MainContext'
import Share from '../../components/Share';
import Loader from '../../components/Loader'
function EventDisplay() {
  const { id } = useParams();
  const [event, setEvent] = useState();
  const { user } = useContext(MainContext);
  const [sharePopup, setSharePopup] = useState(false)
  const {bookmarkEvent} = useContext(MainContext)

  async function fetchEvent() {
    const response = await axios.get(`http://localhost:9294/api/event/event/${id}`, {
      withCredentials: true,
    });
    const formattedEvent = {
      ...response.data,
      eventDate: new Date(response.data.eventDate).toLocaleDateString('en-CA'),
    };
    setEvent(formattedEvent);
  }
  function convertTo12HourFormat(time) {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);

    const ampm = hours >= 12 ? 'PM' : 'AM'; // Check if it's AM or PM
    hours = hours % 12 || 12; // Convert 0 (midnight) to 12 for 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  }
  useEffect(() => {
    fetchEvent();
  }, [id])
    const url = `https://localhost:5173/event/${id}`
  function toggleSharePopup(e) {
    e.stopPropagation();
    setSharePopup(prev => !prev);
}
  if (!event) {
    return <Loader />; // Show loading state while event data is being fetched
  }
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Event Thumbnail */}
          <div className="md:w-1/2 h-64 md:h-auto">
            <img
              src={event.eventThumbnail || eventDemo}
              alt="Event"
              className="w-full h-full object-cover rounded-t-lg md:rounded-none md:rounded-l-lg"
            />
          </div>

          {/* Event Details */}
          <div className="md:w-1/2 p-8 relative">
            {/* Share and Bookmark Icons */}
            <div className="absolute top-4 right-4 flex flex-col space-y-5">
              <button className="flex items-center text-blue-600 hover:text-blue-800"onClick={toggleSharePopup}>
                <FaShareAlt className="mr-2 text-2xl" />
              </button>
              {sharePopup && <Share url={url} onClose={() => setSharePopup(false)}/>}
              <button className="flex items-center text-blue-600 hover:text-blue-800" onClick={()=>bookmarkEvent(id)}>
                <FaRegBookmark className="mr-2 text-2xl" />
              </button>
            </div>
            {/* Event Name */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{event.eventName}</h2>
            {/* Event Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {event.eventDescription}
            </p>

            {/* Event Info - Date */}
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-blue-600 text-lg mr-2" />
              <p className="text-gray-700">{event.eventDate}</p>
            </div>

            {/* Event Info - Time */}
            <div className="flex items-center mb-4">
              <FaClock className="text-blue-600 text-lg mr-2" />
              <p className="text-gray-700">{convertTo12HourFormat(event.eventTimeFrom)} - {convertTo12HourFormat(event.eventTimeTo)}</p>
            </div>

            {/* Event Info - Location */}
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-blue-600 text-lg mr-2" />
              {event.eventLocation === "online" ? <p className="text-gray-700">Online</p> : <p className="text-gray-700">Offline</p>}
            </div>

            {/* Event Info - Price */}
            <div className="flex items-center mb-4">
              <FaRupeeSign className="text-blue-600 text-lg mr-2" />

              {event.eventPrice === "paid" ? <p className="text-gray-700">{event.eventPriceValue}</p> : "Free"}
            </div>

            {/* Event Info - Organizer */}
            <div className="flex items-center mb-6">
              <FaUser className="text-blue-600 text-lg mr-2" />
              <div>
                <p className="text-gray-700">
                  Organizer: <span className="font-medium">{event.organizer.fullname}</span>
                </p>

              </div>
            </div>


            {/* Hardcoded attendees data */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Attendees</h2>
              <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {event.attendees.map((attendee)=>(
                    
                  
                    <img
                      src={attendee.profilePicUrl || UserAvatar}
                      alt="Alice"
                      className="w-10 h-10 rounded-full object-cover border border-gray-300 -ml-2"
                    />
                  ))}
                    <span className="text-gray-500 text-sm font-medium ml-4">
                      {event.attendees.length === 0 ? "No Attendees for this event. Be the first one!": event.attendees.length}
                    </span>
                  </div>
             
                
              </div>
            </div>
            {event.status === "Ongoing" && <button
              className="inline-block bg-green-600 text-white py-3 px-6 rounded-full shadow-lg"
            >
              <div className="flex items-center">

                Ongoing
              </div>
            </button>}
            {event.status === "Ended" && <button
              className="inline-block bg-red-600 text-white py-3 px-6 rounded-full shadow-lg"
            >
              <div className="flex items-center">

                Ended
              </div> </button>}
            {event.status === "Upcoming" && <AttendEvent user={user} event={event} />}


          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDisplay;
