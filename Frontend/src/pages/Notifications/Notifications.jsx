import React, { useContext, useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { MdAdd } from 'react-icons/md';
import axios from 'axios';
import { AiTwotoneDelete } from "react-icons/ai";

import { Link } from 'react-router-dom';
import { MainContext } from '../../contexts/MainContext';
import toast from 'react-hot-toast';

function Notifications() {
  const { notifications , fetchNotifications} = useContext(MainContext);

  async function clearAllNotifications() {
    const response = await axios.delete("http://localhost:9294/api/notifications/deleteNotifications", {
      withCredentials: true,
    });
    if(response.status === 200){
      toast.success("Notifications Cleared")
      fetchNotifications();
    }
    
  }


  return (
    <div className="text-gray-800 p-4 shadow-lg w-full h-screen bg-white">



      <div className="space-y-4">

        {notifications && notifications.length > 0 ? (
          <>
            <div className='w-full flex justify-end items-end my-4'>
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none flex items-center gap-2"
              >
                <AiTwotoneDelete />
                Clear All
              </button>
            </div>

            {notifications.map((notification) => (
              <div key={notification._id} className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300">
                <div className="flex-shrink-0 mr-4">
                  {notification.type === 'co-organizer added' ? (
                    <MdAdd className="text-2xl text-blue-500" />
                  ) : notification.type === 'attended' ? (
                    <FiUsers className="text-2xl text-green-500" />
                  ) : null}
                </div>
                <div className="flex-1">
                  {notification.type === 'co-organizer added' ? (
                    <p className="font-medium text-gray-700">
                      You were added to an event as a Co-organizer:
                      <Link to={`/event/${notification.event._id}`} className="text-blue-500 underline hover:text-blue-600">
                        {notification.event.eventName}
                      </Link>
                    </p>
                  ) : notification.type === 'attended' ? (
                    <p className="font-medium text-gray-700">
                      You attended an event:
                      <Link to={`/event/${notification.event._id}`} className="text-blue-500 underline hover:text-blue-600">
                        {notification.event.eventName}
                      </Link>
                    </p>
                  ) : (
                    <p className="font-medium text-gray-700">Unknown notification type</p>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-gray-500 mt-12 h-[60vh] flex justify-center flex-col">
            <h2 className="text-xl font-medium mb-2">No Notifications Available</h2>
          </div>
        )}

      </div>
    </div>

  );
}

export default Notifications;
