import React, { useContext, useState, useEffect } from "react";
import { IoIosSearch, IoMdArrowDropdown, IoIosNotificationsOutline, IoIosArrowDown } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { LuVideo } from "react-icons/lu";
import { IoLogOutOutline, IoLogInOutline } from "react-icons/io5";
import { AiOutlineCalendar, AiOutlineCheckCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from '../../contexts/MainContext';
import useravatar from "../../assets/user-avatar.png";
import axios from "axios";
import Dropdown from "../Dropdown";

// Custom hook for debouncing
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [eventDropDown, setEventDropDown] = useState(false);
    const { user, notifications, bookmarkedEvents, logout } = useContext(MainContext);
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Use the custom debounced value
    const debouncedInput = useDebounce(input, 300); // 300ms delay

    const handleToggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const handleEventToggle = () => {
        setEventDropDown(prev => !prev);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const dropdownOptions = [
        { label: 'Your Events', action: () => navigate('/yourevents'), icon: <AiOutlineCalendar className="text-xl" /> },
        { divider: true },
        { label: 'Attended Events', action: () => navigate('/attended'), icon: <AiOutlineCheckCircle className="text-xl" /> },
        user
            ? { label: 'Logout', action: logout, icon: <IoLogOutOutline className="text-xl" /> }
            : { label: 'Login', action: () => navigate('/'), icon: <IoLogInOutline className="text-xl" /> }
    ];

    const createEventOptions = [
        { label: 'Create a new event', action: () => navigate('/create'), icon: <LuVideo className="text-xl" /> },
    ];

    // Fetch search results when debounced input changes
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!debouncedInput) return;

            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:9294/api/event/search`, {
                    params: { address: debouncedInput },
                    withCredentials: true,
                });
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [debouncedInput]);

    function clearInput() {
        setInput('');
        setResults([]);
    };

    return (
        <nav className="flex justify-between items-center px-10 py-4 bg-white border-b shadow-md">
            <Link to="/home" className="text-2xl font-bold text-blue-500">
                <h3>Venue Link</h3>
            </Link>

            <div className="flex items-center space-x-4 border border-gray-300 rounded-lg bg-gray-50 px-2">
                <input
                    type="text"
                    placeholder="Neighborhood, city or zip"
                    value={input}
                    onChange={handleInputChange}
                    className="p-2 outline-none w-100"
                />
                {input ? (
                    <button onClick={clearInput} className="text-gray-500 ml-2 text-2xl">
                        &times; {/* This is the cross icon to clear the input */}
                    </button>
                ) : (
                    <IoIosSearch className="text-2xl text-gray-500 cursor-pointer" />
                )}
                {/* Dropdown for search results */}
                {(loading || results.length > 0 || input) && (
                    <div className="absolute bg-white shadow-md z-10 top-20  border border-blue-500 rounded-lg p-3">
                        {loading && <p>Loading...</p>}
                        {results.length > 0 ? (
                            results.map((event, index) => (
                                <Link
                                    key={event._id}
                                    className={`event-item p-2 ${index < results.length - 1 ? 'border-b' : ''}`} 
                                    to={`/event/${event._id}`}
                                >
                                    <h2 className="font-bold hover:underline">{event.eventName}</h2>
                                    {/* <p>{event.eventDescription}</p> */}
                                    <p>{event.eventAddress}</p>
                                </Link>
                            ))
                        ) : (
                            input && (
                                <div className="flex justify-center items-center h-16">
                                    <p className="p-2 text-center">No results found</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <button
                        className="flex items-center space-x-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={handleEventToggle}
                    >
                        <span>Create an event</span>
                        <IoIosArrowDown />
                    </button>
                    <Dropdown options={createEventOptions} isDropdownOpen={eventDropDown} />
                </div>

                <Link to="/bookmarks" className="relative text-gray-500 hover:text-gray-800">
                    <CiBookmark className="text-2xl" />
                    {bookmarkedEvents.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {bookmarkedEvents.length}
                        </span>
                    )}
                </Link>

                <Link to="/notifications" className="relative text-gray-500 hover:text-gray-800">
                    <IoIosNotificationsOutline className="text-2xl" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                </Link>

                <div className="relative select-none">
                    <div
                        onClick={handleToggleDropdown}
                        className="flex items-center cursor-pointer space-x-1"
                    >
                        <img src={useravatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                        <IoMdArrowDropdown className="text-gray-500" />
                    </div>
                    <Dropdown options={dropdownOptions} isDropdownOpen={isDropdownOpen} />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
