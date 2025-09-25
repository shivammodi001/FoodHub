import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealTimeOrderStatus } from "../redux/userSlice";

function MyOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, myOrders, socket } = useSelector((state) => state.user);

  useEffect(()=>{
    socket?.on('newOrder',(data)=>{
      if(data.shopOrders?.owner._id == userData._id){
        dispatch(setMyOrders([data,...myOrders]));
      }
    })

    socket?.on('update-status',({orderId,shopId,status,userId})=>{
      if(userId==userData._id){
        dispatch(updateRealTimeOrderStatus({orderId,shopId,status}));
      }
    })

    return ()=>{
      socket?.off('newOrder');
      socket?.off('update-status');
    }
  },[socket])

  return (
    <div className="w-full min-h-screen bg-orange-50 flex flex-col items-center px-4 relative">
      {/* back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-[#ff4d2d] hover:text-[#e63b1d] transition"
      >
        <IoIosArrowRoundBack className="text-3xl" />
      </button>

      <h1 className="text-3xl font-bold text-gray-800 text-center py-6">
        My Orders
      </h1>

      <div className="w-full max-w-[800px] space-y-6 mb-6">
        {myOrders && myOrders.length > 0 ? (
          myOrders.map((order, index) =>
            userData.role === "user" ? (
              <UserOrderCard data={order} key={index} />
            ) : userData.role === "owner" ? (
              <OwnerOrderCard data={order} key={index} />
            ) : null
          )
        ) : (
          <p className="text-gray-500 text-center mt-10">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default MyOrder;
