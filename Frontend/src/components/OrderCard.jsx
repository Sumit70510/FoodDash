import React from "react";

export default function OrderCard({ order }) {
  return (
    <div className="w-full rounded-xl bg-white shadow-md border border-gray-100 p-4">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Order #{order.orderId}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {order.restaurantName}
          </p>
        </div>

        <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">
          {order.status}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm text-gray-700">
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-3 flex justify-between font-semibold text-gray-800">
        <span>Total</span>
        <span>₹{order.totalAmount}</span>
      </div>
    </div>
  );
}