// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../utils/axios.js";
// import { useSelector } from "react-redux";

// export default function DeliveryPartnerDashboard() {

//     const { user , type } = useSelector(state=>state.auth);

//     const [orders,setOrders] = useState([]);

//     useEffect(()=>{
//         fetchOrders();
//     },[]);

//     const fetchOrders = async()=>{

//         try{

//             // replace with delivery endpoint later
//             const res = await api.get(`/order/restaurant/${user.restaurantId}`);

//             if(res.data.success){
//                 setOrders(res.data.orders);
//             }

//         }catch(err){
//             console.log(err);
//         }

//     }

//     const activeOrders = orders.filter(
//         order=>[
//             "Confirmed",
//             "Preparing",
//             "Picked Up",
//             "Out For Delivery"
//         ].includes(order.orderStatus)
//     );

//     const completed = orders.filter(
//         order=>order.orderStatus==="Delivered"
//     );

//     return (

//         <div className="min-h-screen bg-[#111827] p-8">

//             <h1 className="text-4xl font-bold text-white mb-8">
//                 Delivery Dashboard
//             </h1>

//             <div className="grid md:grid-cols-4 gap-6">

//                 <Card
//                     title="Available Orders"
//                     value={activeOrders.length}
//                     color="bg-orange-500"
//                 />

//                 <Card
//                     title="Completed"
//                     value={completed.length}
//                     color="bg-green-500"
//                 />

//                 <Card
//                     title="Today's Earnings"
//                     value="₹0"
//                     color="bg-blue-500"
//                 />

//                 <Card
//                     title="Rating"
//                     value="5.0 ⭐"
//                     color="bg-purple-500"
//                 />

//             </div>

//             <div className="grid md:grid-cols-2 gap-8 mt-10">

//                 <Link
//                     to="/delivery/orders"
//                     className="bg-[#1F2937] rounded-2xl p-8 hover:bg-[#374151]"
//                 >

//                     <h2 className="text-white text-2xl font-bold">
//                         Active Orders
//                     </h2>

//                     <p className="text-gray-400 mt-3">
//                         Pickup and deliver current orders.
//                     </p>

//                 </Link>

//                 <Link
//                     to="/delivery/history"
//                     className="bg-[#1F2937] rounded-2xl p-8 hover:bg-[#374151]"
//                 >

//                     <h2 className="text-white text-2xl font-bold">
//                         Delivery History
//                     </h2>

//                     <p className="text-gray-400 mt-3">
//                         View completed deliveries.
//                     </p>

//                 </Link>

//             </div>

//         </div>

//     );

// }

// function Card({title,value,color}){

//     return(

//         <div className="bg-[#1F2937] rounded-xl p-6">

//             <div className={`${color} w-12 h-12 rounded-full mb-4`} />

//             <h3 className="text-gray-400">
//                 {title}
//             </h3>

//             <h2 className="text-3xl font-bold text-white mt-2">
//                 {value}
//             </h2>

//         </div>

//     )

// }
import React, { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaCompass,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaPhoneAlt,
  FaRegStar,
  FaRupeeSign,
  FaShieldAlt,
  FaSignOutAlt,
  FaStar,
  FaTruck,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../utils/axios.js";
// Update the path according to your Redux file.
// import { setAuthUser } from "../redux/auth.Slice.js";

export default function DeliveryPartnerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, type } = useSelector((state) => state.auth);

  const deliveryPartner = user || {};

  const [availabilityStatus, setAvailabilityStatus] = useState(
    deliveryPartner?.availabilityStatus || "Offline"
  );

  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);

  /*
   * This will later come from your delivery/order API.
   * Keep it null when the delivery partner has no active delivery.
   */
  const [activeDelivery] = useState(
    deliveryPartner?.activeDelivery || null
  );

  const stats = useMemo(() => {
    const totalEarnings = Number(
      deliveryPartner?.totalEarnings || 0
    );

    const totalIncentives = Number(
      deliveryPartner?.totalIncentives || 0
    );

    const totalDeductions = Number(
      deliveryPartner?.totalDeductions || 0
    );

    return {
      totalDeliveries: Number(
        deliveryPartner?.totalDeliveries || 0
      ),
      totalEarnings,
      totalIncentives,
      totalDeductions,
      netEarnings:
        totalEarnings + totalIncentives - totalDeductions,
      rating: Number(deliveryPartner?.rating || 0),
    };
  }, [deliveryPartner]);

  const verificationStatus =
    deliveryPartner?.verificationStatus || "Pending";

  const isVerified = verificationStatus === "Verified";

  const isOnline = availabilityStatus === "Online";
  const isBusy = availabilityStatus === "Busy";

  const updateAvailability = async (newStatus) => {
    if (availabilityLoading) {
      return;
    }

    if (!isVerified && newStatus === "Online") {
      toast.error(
        "Your account must be verified before going online"
      );
      return;
    }

    try {
      setAvailabilityLoading(true);

      /*
       * Use this API call after adding an availability update route:
       *
       * PATCH /deliveryPartner/availability
       *
       * Request body:
       * {
       *   availabilityStatus: "Online"
       * }
       */

      // const response = await api.patch(
      //   "/deliveryPartner/availability",
      //   {
      //     availabilityStatus: newStatus,
      //   }
      // );
      //
      // if (!response.data?.success) {
      //   throw new Error(
      //     response.data?.message ||
      //       "Unable to update availability"
      //   );
      // }

      setAvailabilityStatus(newStatus);

      toast.success(
        newStatus === "Online"
          ? "You are now online and available for deliveries"
          : "You are now offline"
      );
    } catch (error) {
      console.error(
        "Update delivery availability error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update availability"
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    try {
      setLogoutLoading(true);

      const response = await api.post(
        "/deliveryPartner/logout"
      );

      if (response.data?.success) {
        /*
         * Clear your authenticated Redux user here.
         * Use the action from your auth slice.
         */

        // dispatch(setAuthUser(null));

        localStorage.removeItem("token");

        toast.success(
          response.data?.message || "Logged out successfully"
        );

        navigate("/delivery/login", {
          replace: true,
        });
      } else {
        toast.error(
          response.data?.message || "Unable to logout"
        );
      }
    } catch (error) {
      console.error(
        "Delivery partner logout error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to logout"
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}

        <section className="overflow-hidden rounded-3xl border border-gray-800 bg-[#1F2937]">
          <div className="relative p-6 md:p-8">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-500">
                  Delivery Partner Dashboard
                </p>

                <h1 className="text-3xl font-bold text-white md:text-4xl">
                  Welcome back,
                  <span className="ml-2 text-orange-500">
                    {deliveryPartner?.name ||
                      "Delivery Partner"}
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
                  Manage your availability, deliveries,
                  performance and earnings from one place.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <VerificationBadge
                  status={verificationStatus}
                />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/40
                    bg-red-500/10
                    px-5
                    py-3
                    font-semibold
                    text-red-400
                    transition
                    hover:bg-red-500
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <FaSignOutAlt />

                  {logoutLoading
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Warning */}

        {!isVerified && (
          <section
            className={`
              rounded-2xl
              border
              p-5
              ${
                verificationStatus === "Rejected"
                  ? "border-red-500/40 bg-red-500/10"
                  : "border-yellow-500/40 bg-yellow-500/10"
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  ${
                    verificationStatus === "Rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }
                `}
              >
                <FaShieldAlt />
              </div>

              <div>
                <h2
                  className={`
                    font-bold
                    ${
                      verificationStatus === "Rejected"
                        ? "text-red-300"
                        : "text-yellow-300"
                    }
                  `}
                >
                  {verificationStatus === "Rejected"
                    ? "Verification rejected"
                    : "Verification pending"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-300">
                  {verificationStatus === "Rejected"
                    ? "Your submitted information could not be verified. Contact support or update the required documents."
                    : "Your account is being reviewed. You will be able to accept deliveries after verification."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Availability Status */}

        <section className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  text-xl
                  ${
                    isOnline
                      ? "bg-green-500/20 text-green-400"
                      : isBusy
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-gray-700 text-gray-400"
                  }
                `}
              >
                <FaMotorcycle />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Delivery Availability
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`
                      h-3
                      w-3
                      rounded-full
                      ${
                        isOnline
                          ? "bg-green-500"
                          : isBusy
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }
                    `}
                  />

                  <span className="font-semibold text-gray-200">
                    {availabilityStatus}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {isOnline
                    ? "You are visible and available for new delivery requests."
                    : isBusy
                    ? "You currently have an active delivery."
                    : "Go online to start receiving delivery requests."}
                </p>
              </div>
            </div>

            {!isBusy && (
              <div className="flex w-full rounded-2xl bg-[#111827] p-1.5 sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    updateAvailability("Offline")
                  }
                  disabled={
                    availabilityLoading ||
                    availabilityStatus === "Offline"
                  }
                  className={`
                    flex-1
                    rounded-xl
                    px-6
                    py-3
                    font-semibold
                    transition
                    sm:flex-none
                    ${
                      availabilityStatus === "Offline"
                        ? "bg-red-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }
                    disabled:cursor-not-allowed
                  `}
                >
                  Offline
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateAvailability("Online")
                  }
                  disabled={
                    availabilityLoading ||
                    availabilityStatus === "Online" ||
                    !isVerified
                  }
                  className={`
                    flex-1
                    rounded-xl
                    px-6
                    py-3
                    font-semibold
                    transition
                    sm:flex-none
                    ${
                      availabilityStatus === "Online"
                        ? "bg-green-500 text-white"
                        : "text-gray-400 hover:text-white"
                    }
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  `}
                >
                  {availabilityLoading
                    ? "Updating..."
                    : "Online"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Stats */}

        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <DashboardStat
            title="Total Deliveries"
            value={stats.totalDeliveries}
            icon={<FaTruck />}
            iconClass="bg-blue-500/20 text-blue-400"
          />

          <DashboardStat
            title="Total Earnings"
            value={formatCurrency(stats.totalEarnings)}
            icon={<FaRupeeSign />}
            iconClass="bg-green-500/20 text-green-400"
          />

          <DashboardStat
            title="Net Earnings"
            value={formatCurrency(stats.netEarnings)}
            icon={<FaWallet />}
            iconClass="bg-purple-500/20 text-purple-400"
          />

          <DashboardStat
            title="Rating"
            value={
              stats.rating > 0
                ? stats.rating.toFixed(1)
                : "New"
            }
            icon={<FaStar />}
            iconClass="bg-yellow-500/20 text-yellow-400"
            helper={
              stats.rating > 0
                ? "Customer rating"
                : "Complete deliveries to earn ratings"
            }
          />
        </section>

        {/* Main Dashboard Content */}

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/* Active Delivery */}

          <section className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Current Delivery
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Your active order and delivery progress
                </p>
              </div>

              {activeDelivery && (
                <span className="rounded-full bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-400">
                  {activeDelivery.status || "Active"}
                </span>
              )}
            </div>

            {activeDelivery ? (
              <ActiveDeliveryCard
                delivery={activeDelivery}
              />
            ) : (
              <EmptyActiveDelivery
                availabilityStatus={availabilityStatus}
                isVerified={isVerified}
              />
            )}
          </section>

          {/* Earnings Breakdown */}

          <section className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Earnings Summary
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Your earnings and adjustments
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <EarningRow
                label="Delivery Earnings"
                value={stats.totalEarnings}
                icon={
                  <FaRupeeSign className="text-green-400" />
                }
                valueClass="text-green-400"
              />

              <EarningRow
                label="Incentives"
                value={stats.totalIncentives}
                icon={
                  <FaCheckCircle className="text-blue-400" />
                }
                valueClass="text-blue-400"
                showPlus
              />

              <EarningRow
                label="Deductions"
                value={stats.totalDeductions}
                icon={
                  <FaClock className="text-red-400" />
                }
                valueClass="text-red-400"
                showMinus
              />

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-gray-300">
                    Net Earnings
                  </span>

                  <span className="text-xl font-bold text-white">
                    {formatCurrency(stats.netEarnings)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Partner Information */}

        <section className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Delivery Partner Information
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Personal, vehicle and account details
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InformationItem
              icon={<FaUser />}
              label="Partner Name"
              value={deliveryPartner?.name}
            />

            <InformationItem
              icon={<FaPhoneAlt />}
              label="Contact Number"
              value={deliveryPartner?.contactNo}
            />

            <InformationItem
              icon={<FaMotorcycle />}
              label="Vehicle Type"
              value={deliveryPartner?.vehicleType}
            />

            <InformationItem
              icon={<FaTruck />}
              label="Vehicle Number"
              value={deliveryPartner?.vehicleNo}
            />

            <InformationItem
              icon={<FaShieldAlt />}
              label="License Number"
              value={deliveryPartner?.licenseNo}
            />

            <InformationItem
              icon={<FaMapMarkerAlt />}
              label="Current Location"
              value={formatCurrentLocation(
                deliveryPartner?.currentLocation
              )}
            />
          </div>
        </section>

        {/* Performance */}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
            <h2 className="text-xl font-bold text-white">
              Performance
            </h2>

            <div className="mt-6 flex flex-col items-center text-center">
              <RatingCircle rating={stats.rating} />

              <h3 className="mt-5 font-bold text-white">
                {getRatingTitle(stats.rating)}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                Complete deliveries safely and on time to
                improve your customer rating.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
            <h2 className="text-xl font-bold text-white">
              Delivery Guidelines
            </h2>

            <div className="mt-5 space-y-4">
              <GuidelineItem
                number="1"
                title="Go online"
                description="Set your availability to Online to receive delivery requests."
              />

              <GuidelineItem
                number="2"
                title="Accept delivery"
                description="Review pickup and drop locations before accepting."
              />

              <GuidelineItem
                number="3"
                title="Pick up order"
                description="Confirm the order with the restaurant before leaving."
              />

              <GuidelineItem
                number="4"
                title="Complete delivery"
                description="Deliver safely and confirm completion in the app."
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardStat({
  title,
  value,
  icon,
  iconClass,
  helper,
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#1F2937] p-5">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconClass}`}
        >
          {icon}
        </div>

        <p className="text-right text-2xl font-bold text-white md:text-3xl">
          {value}
        </p>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-400">
        {title}
      </p>

      {helper && (
        <p className="mt-1 text-xs text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
}

function VerificationBadge({ status }) {
  const styles = {
    Verified:
      "border-green-500/30 bg-green-500/10 text-green-400",
    Pending:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    Rejected:
      "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        px-4
        py-3
        text-sm
        font-semibold
        ${
          styles[status] ||
          "border-gray-700 bg-gray-800 text-gray-400"
        }
      `}
    >
      <FaShieldAlt />
      {status}
    </div>
  );
}

function EmptyActiveDelivery({
  availabilityStatus,
  isVerified,
}) {
  let message =
    "Go online to start receiving delivery requests.";

  if (!isVerified) {
    message =
      "Your account must be verified before receiving delivery requests.";
  } else if (availabilityStatus === "Online") {
    message =
      "You are online. New delivery requests will appear here.";
  }

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-700 bg-[#111827] p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-2xl text-gray-500">
        <FaMotorcycle />
      </div>

      <h3 className="mt-5 text-xl font-bold text-white">
        No Active Delivery
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
        {message}
      </p>
    </div>
  );
}

function ActiveDeliveryCard({ delivery }) {
  const restaurantName =
    delivery?.restaurantId?.name ||
    delivery?.restaurant?.name ||
    "Restaurant";

  const customerName =
    delivery?.userId?.name ||
    delivery?.customerId?.name ||
    delivery?.customer?.name ||
    "Customer";

  const pickupAddress =
    delivery?.restaurantId?.location?.address ||
    delivery?.pickupAddress ||
    "Pickup address unavailable";

  const deliveryAddress =
    delivery?.deliveryAddress ||
    delivery?.dropAddress ||
    "Delivery address unavailable";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#111827] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Order
        </p>

        <p className="mt-1 text-lg font-bold text-white">
          #
          {delivery?._id
            ?.slice(-6)
            .toUpperCase() || "------"}
        </p>
      </div>

      <LocationRow
        icon={<FaTruck />}
        title={restaurantName}
        label="Pickup from"
        address={pickupAddress}
        iconClass="bg-orange-500/20 text-orange-400"
      />

      <div className="ml-5 h-6 border-l-2 border-dashed border-gray-700" />

      <LocationRow
        icon={<FaMapMarkerAlt />}
        title={customerName}
        label="Deliver to"
        address={deliveryAddress}
        iconClass="bg-green-500/20 text-green-400"
      />

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        <FaCompass />
        View Delivery Details
      </button>
    </div>
  );
}

function LocationRow({
  icon,
  title,
  label,
  address,
  iconClass,
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-[#111827] p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-400">
          {address}
        </p>
      </div>
    </div>
  );
}

function EarningRow({
  label,
  value,
  icon,
  valueClass,
  showPlus,
  showMinus,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#111827] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800">
          {icon}
        </div>

        <span className="text-sm font-medium text-gray-300">
          {label}
        </span>
      </div>

      <span className={`font-bold ${valueClass}`}>
        {showPlus && value > 0 ? "+" : ""}
        {showMinus && value > 0 ? "-" : ""}
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function InformationItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-[#111827] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-white">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function RatingCircle({ rating }) {
  const safeRating = Math.min(
    Math.max(Number(rating) || 0, 0),
    5
  );

  return (
    <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-yellow-500/20 bg-[#111827]">
      {safeRating > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <FaStar className="text-2xl text-yellow-400" />

            <span className="text-3xl font-bold text-white">
              {safeRating.toFixed(1)}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            out of 5
          </p>
        </>
      ) : (
        <>
          <FaRegStar className="text-3xl text-gray-500" />

          <p className="mt-2 text-sm font-semibold text-gray-400">
            No rating
          </p>
        </>
      )}
    </div>
  );
}

function GuidelineItem({
  number,
  title,
  description,
}) {
  return (
    <div className="flex gap-4 rounded-2xl bg-[#111827] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-bold text-white">
        {number}
      </div>

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function getRatingTitle(rating) {
  const value = Number(rating) || 0;

  if (value === 0) {
    return "Start delivering";
  }

  if (value >= 4.5) {
    return "Excellent performance";
  }

  if (value >= 4) {
    return "Great performance";
  }

  if (value >= 3) {
    return "Good performance";
  }

  return "Needs improvement";
}

function formatCurrency(value) {
  const numberValue = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

function formatCurrentLocation(location) {
  if (!location) {
    return "Location unavailable";
  }

  if (typeof location === "string") {
    return location;
  }

  if (location.address) {
    return location.address;
  }

  if (
    Array.isArray(location.coordinates) &&
    location.coordinates.length >= 2
  ) {
    const [longitude, latitude] =
      location.coordinates;

    return `${latitude}, ${longitude}`;
  }

  if (location.latitude && location.longitude) {
    return `${location.latitude}, ${location.longitude}`;
  }

  return "Location unavailable";
}