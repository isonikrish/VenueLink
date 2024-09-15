import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { CiBookmark } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuVideo } from "react-icons/lu";
import { Link } from "react-router-dom";
import useravatar from "../../assets/user-avatar.png";

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    return (
        <nav className="flex justify-between items-center px-10 py-4 bg-white border-b shadow-md">
            <Link to="/" className="text-2xl font-bold text-blue-500">
                <h3>Venue Link</h3>
            </Link>

            {/* Search bar */}
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
                    className="flex items-center space-x-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    <LuVideo className="text-xl" />
                    <button className="font-medium">Create an Event</button>
                </div>

                {/* Bookmark */}
                <Link to="/bookmarks" className="text-gray-500 hover:text-gray-800">
                    <CiBookmark className="text-2xl" />
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

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                            <Link to="/events">
                                <button className="block w-full text-left px-4 py-2 text-black rounded-md">
                                    Your Events
                                </button>
                            </Link>
                            <hr className="my-2 border-gray-200" />
                            <Link to="/profile">
                                <button className="block w-full text-left px-4 py-2 text-black rounded-md">
                                    View Profile
                                </button>
                            </Link>
                            <Link to="/">
                                <button className="block w-full text-left px-4 py-2 text-black rounded-md">
                                    Login
                                </button>
                            </Link>

                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
