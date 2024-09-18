import React from 'react';
import { CiBookmark } from 'react-icons/ci';
import { IoShareOutline } from 'react-icons/io5';

function Event({ image, date, name, host, priceType, priceValue, attendees, role }) {
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

        <div className="absolute top-3 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
          Online Event
        </div>

        {/* Event Details */}
        <div className="ml-1 mt-2">
          <p className="text-xs text-gray-600 mb-0.5">{date}</p>
          <h2 className="text-lg font-bold mb-1">{name}</h2>
          <p className="text-xs text-gray-600 mb-0.5">Organized by {host}</p>
          {/* Event Role Badge */}
          {role &&
            <div className="absolute top-3 right-2">
              <span
                className={`px-2 py-1 text-xs font-bold rounded-md ${role === 'Organizer' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-800'
                  }`}
              >
                {role}
              </span>
            </div>
          }
          {priceType === "free" ?
            <p className="text-xs text-gray-600 mb-1">Free</p> :
            <p className="text-xs text-gray-600 mb-1">Price: {priceValue}</p>}

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-600">{attendees ? attendees : 0} attendees</p>
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
