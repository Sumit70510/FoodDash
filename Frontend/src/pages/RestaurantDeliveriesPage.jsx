import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RestaurantDeliveriesPage() {
  
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const restaurant = user||{};
  // console.log(restaurant);
    
  const [deliveries, setDeliveries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/delivery/restaurant/${restaurant._id}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setDeliveries(
          data.deliveries || []
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";

      case "Cancelled":
        return "bg-red-500";

      case "Out For Delivery":
        return "bg-orange-500";

      case "Picked Up":
        return "bg-blue-500";

      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] px-4 md:px-6 lg:px-8 py-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Deliveries
      </h1>

      {loading ? (
        <p className="text-white">
          Loading...
        </p>
      ) : (
        <div className="grid gap-4">
          {deliveries.map(
            (delivery) => (
              <div
                key={delivery?._id}
                className="
                  bg-[#1F2937]
                  border
                  border-gray-800
                  rounded-2xl
                  p-5
                "
              >
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-white font-bold">
                      Delivery #
                      {delivery?._id.slice(
                        -6
                      )}
                    </h3>

                    <p className="text-gray-400">
                      Partner:
                      {" "}
                      {delivery
                        ?.deliveryPartnerId
                        ?.name ||
                        "Not Assigned"}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`
                        px-3 py-1
                        rounded-full
                        text-white
                        text-sm
                        ${getStatusColor(
                          delivery?.status
                        )}
                      `}
                    >
                      {delivery?.status}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-5">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Delivery Fee
                    </p>

                    <p className="text-white font-semibold">
                      ₹
                      {
                        delivery?.deliveryFee
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Incentive
                    </p>

                    <p className="text-green-500 font-semibold">
                      ₹
                      {
                        delivery?.incentiveAmount
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Payout Status
                    </p>

                    <p className="text-orange-500 font-semibold">
                      {
                        delivery?.payoutStatus
                      }
                    </p>
                  </div>
                </div>

                {delivery?.notes && (
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm">
                      Notes
                    </p>

                    <p className="text-white">
                      {delivery?.notes}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}