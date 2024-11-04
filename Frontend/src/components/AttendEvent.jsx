import React, { useEffect, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Ticket from './Ticket';

function AttendEvent({ user, event , fetchEvent}) {
    const [attended, setAttended] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [codeValue, setCodeValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAttendedOrNot();
    }, [user, event]);

    const checkAttendedOrNot = () => {
        if (user) {
            const attendedEvents = user.joinedEvents.some(
                (attendedEvent) => attendedEvent._id === event._id
            );
            setAttended(attendedEvents);

            // Check if userId matches any attendee's userId
            const matchingAttendee = event.attendees.find(
                (attendee) => attendee.userId._id === user._id // Accessing the $oid
            );

            if (matchingAttendee) {
                console.log("Code Value:", matchingAttendee.code);
                setCodeValue(matchingAttendee.code);
                
            }
        }
    };

    const handleAttendEvent = async () => {
        if (!user) {
            navigate('/');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:9294/api/event/attend',
                { eventId: event._id },
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success("Successfully joined the event!");
                fetchEvent();
                checkAttendedOrNot(); // Re-check attendance status after joining
            }
        } catch (error) {
            console.error(error);
            toast.error("Error joining the event. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const openModal = () => setIsOpen(true);
    
    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 (midnight) to 12 for 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    };

    return (
        <>
            {/* Event Button */}
            {attended ? (
                <button
                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={openModal}>
                    <div className="flex items-center">
                        <FaLink className="inline-block mr-2" />
                        View Ticket
                    </div>
                </button>
            ) : (
                <button
                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={handleAttendEvent}
                    disabled={loading}>
                    {loading ? (
                        <div className='flex items-center'>Loading...</div>
                    ) : (
                        <div className="flex items-center">
                            <FaLink className="inline-block mr-2" />
                            Attend Event
                        </div>
                    )}
                </button>
            )}

            <Ticket 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
                eventName={event.eventName} 
                eventDate={event.eventDate} 
                eventLocation={event.eventLocation} 
                eventTimeFrom={convertTo12HourFormat(event.eventTimeFrom)} 
                eventTimeTo={convertTo12HourFormat(event.eventTimeTo)} 
                eventLink={event.eventLink} 
                eventAddress={event.eventAddress} 
                code={codeValue} // Pass the code to the Ticket component
            />
        </>
    );
}

export default AttendEvent;
