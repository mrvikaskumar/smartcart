import React from "react";

const categories = [
    "All",
    "Mobiles",
    "Laptops",
    "Headphones",
    "Cameras",
    "Fashion",
    "Home Appliances",
];

const CategorySidebar = ({ selectedCategory, setSelectedCategory, fullWidth, closeSidebar }) => {
    return (
        <div
            className={`p-4 bg-white h-full transition-transform duration-300 ${fullWidth ? "w-full" : "w-64"
                }`}
        >
            {/* Close button */}
            <div className="flex justify-end mb-4 md:hidden">
                <button
                    onClick={closeSidebar}
                    className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
                >
                    &times;
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
            <ul>
                {categories.map((cat) => (
                    <li
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            closeSidebar();
                        }}
                        className={`cursor-pointer mb-3 p-3 rounded transition-colors duration-200 ${selectedCategory === cat
                            ? "bg-blue-600 text-white font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                            }`}
                    >
                        {cat}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;
