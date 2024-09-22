import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import axios from 'axios';
import {Link} from 'react-router-dom'
function Notifications() {
  const [notifications, setNotifications] = useState(null); // Initialize as null

  async function fetchNotifications() {
    try {
      const response = await axios.get('http://localhost:9294/api/notifications/mynotifications', {
        withCredentials: true,
      });
      setNotifications(response.data); // Set notifications directly
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="text-white p-4 shadow-lg w-full h-screen">
      <div className="space-y-3">
        {notifications ? (
          <>
            {notifications.type === 'co-organizer added' && (
              <div className="flex items-center p-3 bg-gray-800 rounded-md">
                <div className="flex-shrink-0 mr-3">
                  <MdAdd className="text-2xl text-blue-500" />
                </div>
                <div className="flex-1">

                  <p className="font-medium">
                    You added to an event as Co-organizer:
                    <Link to={`/event/${notifications.event._id}`} className="text-blue-400 underline">
                      {notifications.event.eventName}
                    </Link>
                  </p>
                </div>
              </div>
            )}
            {notifications.type === 'attended' && (
              <div className="flex items-center p-3 bg-gray-800 rounded-md">
                <div className="flex-shrink-0 mr-3">
                  <FiUsers className="text-2xl text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    You attended an event: 
                    <Link to={`/event/${notifications.event._id}`} className="text-blue-400 underline">
                      {notifications.event.eventName}
                    </Link>
                  </p>
                </div>
              </div>
            )}
            {/* Add more conditions here based on notification types */}
          </>
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;
