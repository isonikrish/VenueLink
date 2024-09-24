import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useravatar from '../../assets/user-avatar.png';
import { toast } from 'react-hot-toast'
function ManageEvent() {
    const [event, setEvent] = useState(null);
    const [scannedData, setScannedData] = useState('');
    const { id } = useParams();

    async function fetchEvent() {
        try {
            const response = await axios.get(`http://localhost:9294/api/event/event/${id}`, {
                withCredentials: true,
            });
            const formattedEvent = {
                ...response.data,
                eventDate: new Date(response.data.eventDate).toLocaleDateString('en-CA'),
            };
            setEvent(formattedEvent);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [id]);



    const handleCheckIn = async (attendeeId, eventId) => {
        try {
            const response = await axios.post('http://localhost:9294/api/event/checkin', {
                userId: attendeeId,
                eventId: eventId
            }, { withCredentials: true });

            if (response.status === 200) {
                toast.success("Successfully checked in!");
                // Optionally refetch the event to update the attendee list
                fetchEvent();
            }
        } catch (error) {
            console.error("Error checking in:", error);
            toast.error("Error checking in. Please try again.");
        }

    };

    if (!event) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-lg">
            {/* Event Details */}
            <div className="mb-8 border-b pb-4 flex justify-between">
                <div className="md:items-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.eventName}</h1>
                    <p className="text-lg text-gray-700 mb-2">{event.eventDescription}</p>
                </div>
                <img src={event.eventThumbnail} alt={event.eventName} className="mt-4 md:mt-0 w-32 h-32 object-cover rounded-lg shadow-md" />
            </div>



            {/* Attendee List */}
            <h2 className="mt-6 text-2xl font-semibold text-gray-800">Attendees</h2>
            <ul className="space-y-4">
                {event.attendees.length === 0 ? <div className='text-zinc-800'>No attendees found</div> :

                    event.attendees.map((attendee) => (
                        <li key={attendee.userId._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow transition">
                            <div className='flex items-center'>
                                <img
                                    src={attendee.userId.profilePicUrl || useravatar}
                                    alt={attendee.userId.fullname}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <span className="block font-medium text-gray-800">{attendee.userId.fullname}</span>
                                    <span className="block text-sm text-gray-500">{attendee.userId.email}</span>
                                </div>

                            </div>
                            <span className="block text-2xl text-blue-500">{attendee.code}</span>
                            {attendee.checkedIn ? <button className='border bg-green-500 p-3 rounded-2xl text-white' onClick={() => toast.error("Already Checked In")}>Checked In</button>
                                : <button className='border bg-blue-500 p-3 rounded-2xl text-white ' onClick={() => handleCheckIn(attendee.userId._id, event._id)}>Check In</button>}

                        </li>
                    ))

                }
            </ul>
        </div>
    );
}

export default ManageEvent;
