import React, { useState, useEffect, useRef } from "react";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.jpg";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HeroCarousel = () => {
    const banners = [banner1, banner2, banner3];
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    // Start auto-slide
    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, []);

    const startAutoSlide = () => {
        stopAutoSlide();
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 4000);
    };

    const stopAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <div
            className="relative mx-auto mt-4 md:mt-6 rounded-lg overflow-hidden group"
            style={{ maxWidth: "1430px", width: "100%", height: "220px" }}
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
        >
            {/* Slides */}
            {banners.map((banner, index) => (
                <img
                    key={index}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
                        }`}
                />
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-opacity opacity-0 group-hover:opacity-100 z-30"
            >
                <FiChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-opacity opacity-0 group-hover:opacity-100 z-30"
            >
                <FiChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? "bg-white" : "bg-gray-400"
                            }`}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
