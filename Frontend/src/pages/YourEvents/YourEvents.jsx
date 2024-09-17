import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../contexts/MainContext';
import Event from '../../components/Event/Event';

function YourEvents() {
    const { user } = useContext(MainContext);
    const [yourEvents, setYourEvents] = useState([]);

    useEffect(() => {
        if (user && user.createdEvents) {
            setYourEvents(user.createdEvents);
        }
    }, [user]);

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>; // Show loading state if user is not yet available
    }

    const formatDate = (dateString) => {
        return dateString.slice(0, 10); // Slice the first 10 characters of the date string (YYYY-MM-DD)
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Your Events</h1>
                <p className="text-gray-600">Manage and view your upcoming events below</p>
            </header>

            {yourEvents.length === 0 ? (
                <div className="text-center text-gray-600 mt-12">
                    <h2 className="text-2xl font-semibold mb-2">No Events Found</h2>
                    <p className="text-lg">You haven't created any events yet. Start organizing now!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {yourEvents.map((yourevent) => (
                        <Event
                            key={yourevent._id}
                            image={yourevent.eventThumbnail}
                            date={formatDate(yourevent.eventDate)}
                            name={yourevent.eventName}
                            host={yourevent.organizer.fullname}
                            priceType={yourevent.eventPrice}
                            priceValue={yourevent.eventPriceValue}
                            attendees={'0'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default YourEvents;
