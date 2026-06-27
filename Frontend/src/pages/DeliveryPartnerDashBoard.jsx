import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios.js";
import { useSelector } from "react-redux";

export default function DeliveryPartnerDashboard() {

    const { user , type } = useSelector(state=>state.auth);

    const [orders,setOrders] = useState([]);

    useEffect(()=>{
        fetchOrders();
    },[]);

    const fetchOrders = async()=>{

        try{

            // replace with delivery endpoint later
            const res = await api.get(`/order/restaurant/${user.restaurantId}`);

            if(res.data.success){
                setOrders(res.data.orders);
            }

        }catch(err){
            console.log(err);
        }

    }

    const activeOrders = orders.filter(
        order=>[
            "Confirmed",
            "Preparing",
            "Picked Up",
            "Out For Delivery"
        ].includes(order.orderStatus)
    );

    const completed = orders.filter(
        order=>order.orderStatus==="Delivered"
    );

    return (

        <div className="min-h-screen bg-[#111827] p-8">

            <h1 className="text-4xl font-bold text-white mb-8">
                Delivery Dashboard
            </h1>

            <div className="grid md:grid-cols-4 gap-6">

                <Card
                    title="Available Orders"
                    value={activeOrders.length}
                    color="bg-orange-500"
                />

                <Card
                    title="Completed"
                    value={completed.length}
                    color="bg-green-500"
                />

                <Card
                    title="Today's Earnings"
                    value="₹0"
                    color="bg-blue-500"
                />

                <Card
                    title="Rating"
                    value="5.0 ⭐"
                    color="bg-purple-500"
                />

            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-10">

                <Link
                    to="/delivery/orders"
                    className="bg-[#1F2937] rounded-2xl p-8 hover:bg-[#374151]"
                >

                    <h2 className="text-white text-2xl font-bold">
                        Active Orders
                    </h2>

                    <p className="text-gray-400 mt-3">
                        Pickup and deliver current orders.
                    </p>

                </Link>

                <Link
                    to="/delivery/history"
                    className="bg-[#1F2937] rounded-2xl p-8 hover:bg-[#374151]"
                >

                    <h2 className="text-white text-2xl font-bold">
                        Delivery History
                    </h2>

                    <p className="text-gray-400 mt-3">
                        View completed deliveries.
                    </p>

                </Link>

            </div>

        </div>

    );

}

function Card({title,value,color}){

    return(

        <div className="bg-[#1F2937] rounded-xl p-6">

            <div className={`${color} w-12 h-12 rounded-full mb-4`} />

            <h3 className="text-gray-400">
                {title}
            </h3>

            <h2 className="text-3xl font-bold text-white mt-2">
                {value}
            </h2>

        </div>

    )

}