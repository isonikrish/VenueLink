import React, { useContext } from 'react';
import { MainContext } from '../../contexts/MainContext';
import Event from '../../components/Event/Event'; // Make sure to import your Event component

function Bookmarks() {
    const { bookmarkedEvents } = useContext(MainContext);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Your Bookmarked Events</h1>
                <p className="text-gray-600">Here are the events you've bookmarked:</p>
            </header>

            {bookmarkedEvents.length === 0 ? (
                <div className="text-center text-gray-600 mt-12">
                    <h2 className="text-2xl font-semibold mb-2">No Bookmarks Found</h2>
                    <p className="text-lg">You haven't bookmarked any events yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedEvents.map((event) => (
                        <Event
                            key={event._id}
                            eventId={event._id}
                            image={event.eventThumbnail} // Assuming the event object has this field
                            date={event.eventDate.slice(0, 10)} // Format as needed
                            name={event.eventName}
                            host={event.organizer.fullname} // Adjust based on your data structure
                            priceType={event.eventPrice}
                            priceValue={event.eventPriceValue}
                            role={event.role}
                            attendees={event.attendees}
                            coorganizer={event.coorganizerEmail} // Assuming it's an array
                            status={event.status}
                            eventTimeFrom={event.eventTimeFrom}
                            eventTimeTo={event.eventTimeTo}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Bookmarks;
