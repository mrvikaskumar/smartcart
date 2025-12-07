import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6 px-4 mt-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm md:text-base mb-2 md:mb-0">
                    &copy; {new Date().getFullYear()} SmartCart. All rights reserved.
                </p>
                <div className="flex space-x-4 text-sm">
                    <a href="#!" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#!" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#!" className="hover:text-white transition-colors">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
