import React from "react";

export default function OrderCard({ order }) {
  return (
    <div className="w-full rounded-xl surface border border-gray-700 p-4">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Order #{order.orderId}</h2>

          <p className="text-sm text-muted mt-1">{order.restaurantName}</p>
        </div>

        <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">{order.status}</span>
      </div>

      <div className="mt-4 space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm text-muted">
            <span>
              {item.name} × {item.quantity}
            </span>

            <span className="text-white">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-3 flex justify-between font-semibold text-white">
        <span>Total</span>
        <span>₹{order.totalAmount}</span>
      </div>
    </div>
  );
}