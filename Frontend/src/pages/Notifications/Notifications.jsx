import React, { useContext, useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MainContext } from '../../contexts/MainContext';

function Notifications() {
  const { notifications } = useContext(MainContext);

  

  return (
    <div className="text-white p-4 shadow-lg w-full h-screen">
      <div className="space-y-3">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="flex items-center p-3 bg-gray-800 rounded-md">
              <div className="flex-shrink-0 mr-3">
                {notification.type === 'co-organizer added' ? (
                  <MdAdd className="text-2xl text-blue-500" />
                ) : notification.type === 'attended' ? (
                  <FiUsers className="text-2xl text-green-500" />
                ) : null}
              </div>
              <div className="flex-1">
                {notification.type === 'co-organizer added' ? (
                  <p className="font-medium">
                    You were added to an event as a Co-organizer:
                    <Link to={`/event/${notification.event._id}`} className="text-blue-400 underline">
                      {notification.event.eventName}
                    </Link>
                  </p>
                ) : notification.type === 'attended' ? (
                  <p className="font-medium">
                    You attended an event:
                    <Link to={`/event/${notification.event._id}`} className="text-blue-400 underline">
                      {notification.event.eventName}
                    </Link>
                  </p>
                ) : (
                  <p className="font-medium">Unknown notification type</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;
