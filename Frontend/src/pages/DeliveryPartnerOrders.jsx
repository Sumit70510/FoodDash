import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function DeliveryPartnerOrders() {

    const { user ,type } = useSelector(state=>state.auth);

    const [orders,setOrders]=useState([]);

    useEffect(()=>{
        fetchOrders();
    },[]);

    const fetchOrders=async()=>{

        try{

            const res=await api.get(`/order/restaurant/${user.restaurantId}`);

            if(res.data.success){

                const filtered=res.data.orders.filter(order=>

                    order.orderStatus!=="Delivered" &&
                    order.orderStatus!=="Cancelled"

                );

                setOrders(filtered);

            }

        }catch(err){

            console.log(err);

        }

    }

    const updateStatus=async(id,status)=>{

        try{

            const res=await api.put(`/order/status/${id}`,{
                orderStatus:status
            });

            if(res.data.success){

                toast.success("Status Updated");

                fetchOrders();

            }

        }catch(err){

            toast.error("Unable to update");

        }

    }

    return(

        <div className="min-h-screen bg-[#111827] p-8">

            <h1 className="text-4xl text-white font-bold mb-8">
                Active Orders
            </h1>

            <div className="space-y-6">

                {orders.map(order=>(

                    <div
                    key={order._id}
                    className="bg-[#1F2937] rounded-2xl p-6">

                        <div className="flex justify-between">

                            <div>

                                <h2 className="text-xl text-white font-semibold">
                                    Order #{order._id.slice(-6)}
                                </h2>

                                <p className="text-gray-400">
                                    {order.items.length} Items
                                </p>

                            </div>

                            <span className="text-orange-400">

                                {order.orderStatus}

                            </span>

                        </div>

                        <div className="mt-4 text-gray-300">

                            ₹ {order.totalAmount}

                        </div>

                        <div className="flex gap-4 mt-6">

                            <button
                            onClick={()=>updateStatus(order._id,"Picked Up")}
                            className="bg-blue-600 px-5 py-2 rounded">

                                Picked Up

                            </button>

                            <button
                            onClick={()=>updateStatus(order._id,"Out For Delivery")}
                            className="bg-orange-600 px-5 py-2 rounded">

                                Out For Delivery

                            </button>

                            <button
                            onClick={()=>updateStatus(order._id,"Delivered")}
                            className="bg-green-600 px-5 py-2 rounded">

                                Delivered

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    )

}