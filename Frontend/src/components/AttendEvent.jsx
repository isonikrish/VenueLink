import React, { useEffect, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AttendEvent({ user, event }) {
    const [qrCodeValue, setQrCodeValue] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function fetchQrCode() {
            try {
                const response = await axios.get(
                    `http://localhost:9294/api/event/qr-code/${event._id}`,
                    { withCredentials: true }
                );
                if (response.data && response.data.qrCode) {
                    setQrCodeValue(response.data.qrCode);
                }
            } catch (error) {
                console.error('Error fetching QR code:', error);
            }
        }
        fetchQrCode();
    }, [event._id]);

    async function handleAttendEvent() {
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
            }
        } catch (error) {
            console.error(error);
            toast.error("Error joining the event. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    }

    return (
        <>
            {/* Event Button */}
            <button
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                onClick={handleAttendEvent}
                disabled={loading} // Disable button while loading
            >
                {loading ? (
                    <div className='flex items-center'>
                        <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 0 1 8-8v8H4z"
                            ></path>
                        </svg>
                        Loading...
                    </div>
                ) : (
                    <div className="flex items-center">
                        <FaLink className="inline-block mr-2" />
                        Attend Event
                    </div>
                )}
            </button>
            {qrCodeValue && (
                <div className="mt-4">
                    <QRCode value={qrCodeValue} />
                </div>
            )}
        </>
    );
}

export default AttendEvent;
