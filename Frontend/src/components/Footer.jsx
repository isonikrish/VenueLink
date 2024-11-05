import React from "react";
import { FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Import social media icons

function Footer() {
    return (
        <footer className="bg-blue-800 text-white py-10 px-5">
            <div className="container mx-auto flex flex-col md:flex-row justify-between gap-8">

                {/* About Section */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold mb-2">Jems Technologies</h2>
      
                    <div className="border-t border-gray-300 pt-3 mt-4">
                        <p className="text-sm mb-1">Designed and Developed By</p>
                        <h2 className="text-lg font-semibold">Krish Soni</h2>
                        <p className="text-sm text-gray-400">Founder & CEO</p>
                    </div>
                </div>


                {/* Social Media Section */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-xl font-semibold mb-3">Follow Us</h2>
                    <div className="flex space-x-6">
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-125">
                            <FaYoutube size={32} className="hover:text-gray-400 transition duration-200" />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-125">
                            <FaXTwitter size={32} className="hover:text-gray-400 transition duration-200" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-transform transform hover:scale-125">
                            <FaLinkedin size={32} className="hover:text-gray-400 transition duration-200" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-8 border-t border-gray-700 pt-5 text-center text-gray-300">
                <p className="text-sm">&copy; {new Date().getFullYear()} Jems Technologies. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
