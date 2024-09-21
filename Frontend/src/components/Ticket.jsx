import React, { useState } from 'react';

function TicketPopup({ isOpen, setIsOpen, code, eventName, eventDate, eventLocation, eventTimeFrom, eventTimeTo, eventLink, eventAddress }) {

  const closeModal = () => setIsOpen(false);

  return (
    <div className="relative">



      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative max-w-6xl bg-white rounded-xl shadow-lg">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-3xl"
            >
              &times;
            </button>

            {/* Ticket Header */}
            <div className="bg-blue-500 text-white text-center py-2 rounded-t-xl">
              <h2 className="text-2xl font-bold">{eventName}</h2>
            </div>

            {/* Ticket Body */}
            <div className="p-4 border-dashed border-gray-300 border-t-8 border-b-8">
              <div className="flex justify-between items-center">
                {eventLocation === "offline" ?
                  <div className="w-1/3 flex justify-center">
                    <div className="bg-blue-500 text-white rounded-lg shadow-md px-4 py-2 font-bold text-lg">
                      {code}
                    </div>
                  </div>

                  : ''}


                {/* Event Details Section */}
                <div className="w-2/3 pl-4">
                  <p className="text-gray-600 mb-2">
                    <strong>Date:</strong> {eventDate}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Time:</strong> {eventTimeFrom} - {eventTimeTo}
                  </p>
                  {eventLocation === "online" ?
                    <>
                      <p className="text-gray-600 mb-2">
                        <strong>Location:</strong> Online
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Link:</strong>
                        <a className='underline text-sm mx-2 text-blue-500 cursor-pointer'
                          href={eventLink} target='_blank' rel="noopener noreferrer">{eventLink}</a>
                      </p>
                    </>
                    : <>
                      <p className="text-gray-600 mb-2">
                        <strong>Location:</strong> Offline
                      </p>
                      <p className="text-gray-600 mb-2">
                        <strong>Address:</strong>
                        <p>{eventAddress}</p>
                      </p>
                    </>}

                </div>
              </div>
            </div>

            {/* Footer */}
            {eventLocation === "offline" ?
              <div className="py-4 px-6 text-center bg-gray-100 rounded-b-xl">
                <p className="text-sm text-gray-500">
                  Use the code above for check-in at the event entrance.
                </p>
              </div>
              : ''}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketPopup;
