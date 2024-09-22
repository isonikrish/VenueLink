import React, { useEffect, useState } from 'react';
import { CiBookmark } from 'react-icons/ci';
import { Link } from 'react-router-dom'
import { IoShareOutline } from 'react-icons/io5';
import Share from '../Share';
function Event({ image, date, name, host, coorganizer, priceType, priceValue, attendees, role, eventId, status, eventTimeFrom, eventTimeTo }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [sharePopup, setSharePopup] = useState(false);
  useEffect(() => {
    if (status === "Upcoming") {
      const eventStartTime = new Date(`${date} ${eventTimeFrom}`).getTime();
      const eventEndTime = new Date(`${date} ${eventTimeTo}`).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();

        if (now >= eventStartTime && now < eventEndTime) {
          setIsOngoing(true);
          clearInterval(interval);
          return;
        }

        if (now >= eventEndTime) {
          clearInterval(interval);
          return;
        }

        const distance = eventStartTime - now;
        if (distance < 0) {
          clearInterval(interval);
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(interval);
    }

  }, [date, status])
  const url = `http://localhost:5173/event/${eventId}`;
  function toggleSharePopup(e) {
    e.stopPropagation();
    setSharePopup(prev => !prev);
}
  return (
    <div className="relative max-w-lg bg-white rounded-lg shadow-sm overflow-hidden flex items-center border p-2 mb-4">
      {/* Event Image */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt="Event"
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>

      {/* Event Details */}
      <div className="flex-1 ml-3 ">
        {/* Online/Offline Badge */}
        {status === "Ongoing" && <div className="absolute top-3 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          Ongoing
        </div>}
        {status === "Upcoming" && <div className="absolute top-3 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          Upcoming
        </div>}
        {status === "Ended" && <div className="absolute top-3 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          Ended
        </div>}


        {/* Event Details */}
        <div className="ml-1 mt-2">
          <p className="text-xs text-gray-600 mb-0.5">{date}</p>
          <Link to={`/event/${eventId}`} className='underline'><h2 className="text-lg font-bold mb-1">{name}</h2></Link>
          <p className="text-xs text-gray-600 mb-0.5">Organized by {host}</p>
          {/* Event Role Badge */}
          {role &&
            <div className="absolute top-3 right-2">
              <Link to={`/manage/${eventId}`}>
                <button
                  className={'px-2 py-1 text-xs font-bold rounded-md bg-green-500 text-white '
                  }
                >
                  Manage
                </button>
              </Link>
            </div>
          }
          {priceType === "free" ?
            <p className="text-xs text-gray-600 mb-1">Free</p> :
            <p className="text-xs text-gray-600 mb-1">Price: {priceValue}</p>}
          {status === "Upcoming" && (
            <>
              <div className="mt-2 p-2 flex items-center bg-gray-100 rounded-lg">

                <span className="flex items-center mr-4">
                  <span className="font-bold text-gray-800">{countdown.days}</span>
                  <span className="text-xs text-gray-500 ml-1">d</span>
                </span>
                <span className="flex items-center mr-4">
                  <span className="font-bold text-gray-800">{countdown.hours}</span>
                  <span className="text-xs text-gray-500 ml-1">h</span>
                </span>
                <span className="flex items-center mr-4">
                  <span className="font-bold text-gray-800">{countdown.minutes}</span>
                  <span className="text-xs text-gray-500 ml-1">m</span>
                </span>
                <span className="flex items-center">
                  <span className="font-bold text-gray-800">{countdown.seconds}</span>
                  <span className="text-xs text-gray-500 ml-1">s</span>
                </span>
              </div>
            </>
          )}


          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-600">{attendees ? attendees.length : 0} attendees</p>
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <CiBookmark className="text-xl" />
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-800 transition-colors" onClick={toggleSharePopup}>
                <IoShareOutline className="text-xl" />
              </button>
              {sharePopup && <Share url={url} Close={() => setSharePopup(false)}/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Event);
