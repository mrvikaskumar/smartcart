import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    return (
        <div className="border rounded-lg shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col bg-white  ">
            {/* Product Image */}
            <div className="h-52 w-full overflow-hidden">
                <img
                    src={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                />
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1 justify-between h-14 bg-linear-65 from-purple-500 to-pink-500">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                </div>

                {/* Price + View Button */}
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-blue-600 font-bold text-lg">₹{product.price}</span>
                    <Link
                        to={`/product/${product._id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm transition-colors"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
