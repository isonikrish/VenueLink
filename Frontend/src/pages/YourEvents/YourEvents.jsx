import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../contexts/MainContext';
import Event from '../../components/Event/Event';
import Loader from '../../components/Loader'; // Import Loader
import axios from 'axios';

function YourEvents() {
    const { user } = useContext(MainContext);
    const [yourEvents, setYourEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:9294/api/event/getEvents`, { withCredentials: true });
                    setYourEvents(response.data);
                } catch (error) {
                    console.error('Error fetching events:', error);
                } finally {
                    setLoading(false); // Set loading to false once the fetch is complete
                }
            } else {
                setLoading(false); // If user is not available, stop loading
            }
        };
        fetchEvents();
    }, [user]);

    // Show loader while data is still being fetched
    if (loading) {
        return <Loader />; // Return Loader component while loading is true
    }

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
                            eventId={yourevent._id}
                            image={yourevent.eventThumbnail}
                            date={formatDate(yourevent.eventDate)}
                            name={yourevent.eventName}
                            host={yourevent.organizer.fullname}
                            priceType={yourevent.eventPrice}
                            priceValue={yourevent.eventPriceValue}
                            role={yourevent.role}
                            attendees={yourevent.attendees}
                            coorganizer={yourevent.coorganizerEmail.map((coorganizer) => coorganizer)}
                            status={yourevent.status}
                            eventTimeFrom={convertTo12HourFormat(yourevent.eventTimeFrom)}
                            eventTimeTo={convertTo12HourFormat(yourevent.eventTimeTo)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default YourEvents;
