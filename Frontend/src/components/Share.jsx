import React, { useState } from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
    EmailIcon
} from 'react-share';
import { toast } from 'react-hot-toast';

function Share({ url, onClose }) {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success('URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
            });
    };

    if (!isOpen) return null; // Prevent rendering when closed

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">

                <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Share this event</h2>

                    <button
                        className="text-black-600 hover:text-gray- text-3xl"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="mt-2 w-full bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition"
                        onClick={handleCopyUrl}
                    >
                        Copy URL
                    </button>
                </div>

                <div className="flex justify-around mt-4">
                    <FacebookShareButton url={url} quote="Check out this post!">
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={url} title="Check out this post!">
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={url} title="Check out this post!">
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={url} title="Check out this post!">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={url} subject="Check out this post!" body="Here's a great post I found:">
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </div>
            </div>
        </div>
    );
}

export default Share;
