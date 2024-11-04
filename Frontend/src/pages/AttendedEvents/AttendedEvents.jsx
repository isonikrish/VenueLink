import React, { useContext } from 'react';
import { MainContext } from '../../contexts/MainContext';
import Event from '../../components/Event/Event';
import Loader from '../../components/Loader';

function AttendedEvents() {
    const { user } = useContext(MainContext);

    const formatDate = (dateString) => {
        return dateString.slice(0, 10);
    };

    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);

        const ampm = hours >= 12 ? 'PM' : 'AM'; // Check if it's AM or PM
        hours = hours % 12 || 12; // Convert 0 (midnight) to 12 for 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    };


    if (!user || !user.joinedEvents) {
        return <Loader />;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Attended Events</h1>
            </header>

            {user.joinedEvents.length === 0 ? (
                <div className="text-center text-gray-500 mt-12 h-[60vh] flex justify-center flex-col">
                    <h2 className="text-xl font-medium mb-2">No Events Found</h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.joinedEvents.map((yourevent) => (
                        <Event
                            key={yourevent._id}
                            eventId={yourevent._id}
                            image={yourevent.eventThumbnail}
                            date={formatDate(yourevent.eventDate)}
                            name={yourevent.eventName}
                            host={yourevent.organizer.fullname}
                            priceType={yourevent.eventPrice}
                            priceValue={yourevent.eventPriceValue}
                            attendees={yourevent.attendees}
                            eventTimeFrom={convertTo12HourFormat(yourevent.eventTimeFrom)}
                            eventTimeTo={convertTo12HourFormat(yourevent.eventTimeTo)}
                            status={yourevent.status}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AttendedEvents;
