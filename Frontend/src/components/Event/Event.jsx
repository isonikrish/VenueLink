import React from 'react';
import EventImg from '../../assets/eventDemo.jpg';
import { CiBookmark } from 'react-icons/ci';
import { IoShareOutline } from 'react-icons/io5';

function Event() {
  return (
    <div className="relative max-w-lg bg-white rounded-lg shadow-sm overflow-hidden flex items-center border p-2 mb-4">
      {/* Event Image */}
      <div className="flex-shrink-0">
        <img
          src={EventImg}
          alt="Event"
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>

      {/* Event Details */}
      <div className="flex-1 ml-3">
        {/* Online/Offline Badge */}
        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          Online Event
        </div>

        {/* Event Details */}
        <div className="ml-1 mt-2">
          <p className="text-xs text-gray-600 mb-0.5">Oct 21, 2024</p>
          <h2 className="text-lg font-bold mb-1">Tech Meetup</h2>
          <p className="text-xs text-gray-600 mb-0.5">Hosted by John Doe</p>
          <p className="text-xs text-gray-600 mb-1">Price: $20</p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-600">5 attendees</p>
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <CiBookmark className="text-xl" />
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
                <IoShareOutline className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Event);
