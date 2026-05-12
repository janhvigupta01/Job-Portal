import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Left Section */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Job Hunt</h2>
            <p className="text-sm text-gray-500">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>

          {/* Right Section - Social Icons */}
          <div className="flex space-x-5 mt-4 md:mt-0">
            
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook className="w-6 h-6 cursor-pointer hover:text-blue-600 transition duration-200" />
            </a>

            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="w-6 h-6 cursor-pointer hover:text-sky-500 transition duration-200" />
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin className="w-6 h-6 cursor-pointer hover:text-blue-700 transition duration-200" />
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;