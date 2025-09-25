import React from "react";

function CategoryCard({ data, isHovered,onClick }) {
  return (
    <div
      className={`flex flex-col items-center bg-white rounded-xl shadow-md p-3 transition-transform transform cursor-pointer
      ${isHovered ? "-translate-y-2 scale-105 shadow-xl" : "hover:scale-105 hover:shadow-lg"}
      flex-shrink-0 w-36 md:w-36`}
      onClick={onClick}
    >
      <img
        src={data.image}
        alt={data.category}
        className="w-24 h-24 object-cover rounded-full mb-2"
      />
      <p className="text-center font-semibold text-sm md:text-base text-gray-800">
        {data.category}
      </p>
    </div>
  );
}

export default CategoryCard;
