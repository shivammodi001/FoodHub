import axios from "axios";
import React from "react";
import { FaPen } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function OwnerItemCard({ data }) {


  const navigate = useNavigate();
  const dispatch = useDispatch();
    const handleDeleteItem = async ()=>{
      try{
        const result = await axios.delete(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true});
        dispatch(setMyShopData(result.data));

      }catch(err){
        console.log(err);
      }
    }

    return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
      {/* Image */}
      <div className="md:w-1/3 w-full h-48 md:h-auto">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col justify-between md:w-2/3 relative">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{data.name}</h3>
          <p className="text-gray-600 mt-1">{data.category}</p>
          <p className="text-gray-600 mt-1">Price: ₹{data.price}</p>
          <p className="text-gray-600 mt-1">
            Type: {data.foodType === "veg" ? "Veg" : "Non-Veg"}
          </p>
        </div>

        {/* Buttons at bottom-right of details area */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {/* edit */}
          <button className="p-2 bg-[#ff4d2d] text-white rounded-full shadow hover:bg-[#e63b1d] transition" onClick={()=>navigate(`/edit-item/${data._id}`)}>
            <FaPen />
          </button>
          {/* delete */}
          <button className="p-2 bg-[#ff4d2d] text-white rounded-full shadow hover:bg-[#e63b1d] transition" onClick={handleDeleteItem}>
            <RiDeleteBin6Line />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
