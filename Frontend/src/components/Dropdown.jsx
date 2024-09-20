import React, { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

const Dropdown = ({ options, isDropdownOpen }) => {


    return (
        <div className="relative select-none">

            {isDropdownOpen && (
                <div className="absolute right-0 mt-10 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                    {options.map((option, index) => (
                        <React.Fragment key={index}>
                            <button className="w-full text-left px-4 py-2 text-black rounded-md flex items-center gap-3" onClick={option.action}>
                                {option.icon ? option.icon : ''}
                                {option.label}
                            </button>
                            {option.divider && <hr className="border-gray-200" />}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
