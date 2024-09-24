import React from 'react'

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default Loader