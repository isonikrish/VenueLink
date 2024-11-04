import React, { useContext, useEffect, useState } from "react";
import { IoIosSearch, IoMdArrowDropdown, IoIosNotificationsOutline, IoIosArrowDown } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";


import { LuVideo } from "react-icons/lu";
import { IoLogOutOutline, IoLogInOutline } from "react-icons/io5";
import { AiOutlineCalendar, AiOutlineCheckCircle } from "react-icons/ai";

import { Link, useNavigate } from "react-router-dom";
import { MainContext } from '../../contexts/MainContext'
import useravatar from "../../assets/user-avatar.png";
import axios from "axios";
import toast from 'react-hot-toast'
import Dropdown from "../Dropdown";

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [eventDropDown, seteventDropDown] = useState(false);
    const { user, notifications, bookmarkedEvents, logout } = useContext(MainContext);
    const navigate = useNavigate();
    const handleToggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };
    const handleeventtoggle = () => {
        seteventDropDown((prevState) => !prevState)
    }


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
    return (
        <nav className="flex justify-between items-center px-10 py-4 bg-white border-b shadow-md">
            <Link to="/home" className="text-2xl font-bold text-blue-500">
                <h3>Venue Link</h3>
            </Link>

            
            <div className="flex items-center space-x-4 border border-gray-300 rounded-lg bg-gray-50 px-2">
                <input
                    type="text"
                    placeholder="Search Events"
                    className="p-2 outline-none w-48 border-r border-gray-300"
                />
                <input
                    type="text"
                    placeholder="Neighborhood, city or zip"
                    className="p-2 outline-none w-100 focus:ring-"
                />
                <IoIosSearch className="text-2xl text-gray-500 cursor-pointer" />
            </div>



            {/* Actions */}
            <div className="flex items-center space-x-6">
                <div
                    className="flex items-center space-x-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={handleeventtoggle} >
                    <div className="flex items-center gap-4">
                        Create a event <IoIosArrowDown />
                    </div>
                    <Dropdown options={createEventOptions} isDropdownOpen={eventDropDown} />
                </div>

                {/* Bookmark */}
                <Link to="/bookmarks" className=" relative text-gray-500 hover:text-gray-800">
                    <CiBookmark className="text-2xl" />
                    {bookmarkedEvents.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {bookmarkedEvents.length}
                        </span>
                    )}
                </Link>
                {/* Notifications */}
                <Link to="/notifications" className="relative text-gray-500 hover:text-gray-800">
                    <IoIosNotificationsOutline className="text-2xl" />

                    {/* Display notification count */}
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative select-none">
                    <div
                        onClick={handleToggleDropdown}
                        className="flex items-center cursor-pointer space-x-1"
                    >
                        <img
                            src={useravatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <IoMdArrowDropdown className="text-gray-500" />
                    </div>

                    <Dropdown options={dropdownOptions} isDropdownOpen={isDropdownOpen} />


                </div>
            </div>
        </nav>
    );
}

export default Navbar;
