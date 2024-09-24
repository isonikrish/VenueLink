import React, { useContext } from 'react';
import { MainContext } from '../../contexts/MainContext';
import Event from '../../components/Event/Event';
import Loader from '../../components/Loader'; // Import Loader

function AttendedEvents() {
    const { user } = useContext(MainContext); // Get user from context

    const formatDate = (dateString) => {
        return dateString.slice(0, 10); // Slice the first 10 characters of the date string (YYYY-MM-DD)
    };

    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);

        const ampm = hours >= 12 ? 'PM' : 'AM'; // Check if it's AM or PM
        hours = hours % 12 || 12; // Convert 0 (midnight) to 12 for 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    };

    // Safety check for user and joinedEvents
    if (!user || !user.joinedEvents) {
        return <Loader />; // Show loader while fetching user data
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Attended Events</h1>
            </header>

            {user.joinedEvents.length === 0 ? (
                <div className="text-center text-gray-600 mt-12">
                    <h2 className="text-2xl font-semibold mb-2">No attended events Found</h2>
                    <p className="text-lg">You haven't attended any events yet. Start organizing now!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.joinedEvents.map((yourevent) => (
                        <Event
                            key={yourevent._id} // Use the event's _id directly
                            eventId={yourevent._id} // Pass the eventId for further actions
                            image={yourevent.eventThumbnail} // Access the event details
                            date={formatDate(yourevent.eventDate)} // Format the event date
                            name={yourevent.eventName} // Access the event name
                            host={yourevent.organizer.fullname} // Access the host details
                            priceType={yourevent.eventPrice} // Access price type
                            priceValue={yourevent.eventPriceValue} // Access price value
                            attendees={yourevent.attendees} // Access attendees
                            eventTimeFrom={convertTo12HourFormat(yourevent.eventTimeFrom)} // Format event start time
                            eventTimeTo={convertTo12HourFormat(yourevent.eventTimeTo)} // Format event end time
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AttendedEvents;
