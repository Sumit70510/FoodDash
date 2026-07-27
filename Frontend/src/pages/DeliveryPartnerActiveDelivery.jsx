import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaPhoneAlt,
  FaRedoAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function DeliveryPartnerActiveDelivery() {
  const [delivery, setDelivery] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  useEffect(() => {
    fetchActiveDelivery();
  }, []);

  const fetchActiveDelivery = async (
    refresh = false
  ) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(
        "/delivery/active"
      );

      if (response.data?.success) {
        setDelivery(
          response.data.delivery || null
        );
      } else {
        setDelivery(null);
      }
    } catch (error) {
      console.error(
        "Fetch active delivery error:",
        error
      );

      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load active delivery"
        );
      }

      setDelivery(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateDeliveryStatus = async (
    status
  ) => {
    if (!delivery?._id || updating) {
      return;
    }

    try {
      setUpdating(true);

      const response = await api.patch(
        `/delivery/${delivery._id}/status`,
        { status }
      );

      if (response.data?.success) {
        const updatedDelivery =
          response.data.delivery || {
            ...delivery,
            status,
          };

        if (status === "Delivered") {
          setDelivery(null);
        } else {
          setDelivery(updatedDelivery);
        }

        toast.success(
          getSuccessMessage(status)
        );
      } else {
        toast.error(
          response.data?.message ||
            "Unable to update delivery"
        );
      }
    } catch (error) {
      console.error(
        "Update delivery status error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update delivery"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Current Assignment
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              Active Delivery
            </h1>

            <p className="mt-2 text-gray-400">
              Track the pickup and delivery
              progress of your current order.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchActiveDelivery(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#1F2937] px-5 py-3 font-semibold text-white transition hover:border-orange-500"
          >
            <FaRedoAlt
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {!delivery ? (
          <EmptyDelivery />
        ) : (
          <div className="space-y-6">
            {/* Delivery Status */}

            <section className="rounded-3xl border border-orange-500/30 bg-[#1F2937] p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-sm text-gray-400">
                    Delivery ID
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-white">
                    #
                    {delivery._id
                      ?.slice(-6)
                      .toUpperCase()}
                  </h2>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-orange-500/15 px-4 py-3 text-orange-400">
                  <FaMotorcycle />

                  <span className="font-semibold">
                    {formatStatus(
                      delivery.status
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* Delivery Progress */}

            <DeliveryProgress
              status={delivery.status}
            />

            {/* Locations */}

            <section className="grid gap-6 lg:grid-cols-2">
              <LocationCard
                title="Restaurant Pickup"
                name={
                  delivery.restaurantId?.name ||
                  delivery.restaurant?.name ||
                  "Restaurant"
                }
                address={
                  delivery.restaurantId?.location
                    ?.address ||
                  delivery.pickupAddress ||
                  "Pickup address unavailable"
                }
                phone={
                  delivery.restaurantId
                    ?.restaurantContactNo ||
                  delivery.restaurant?.contactNo
                }
                icon={<FaStore />}
                iconClass="bg-orange-500/20 text-orange-400"
              />

              <LocationCard
                title="Customer Delivery"
                name={
                  delivery.userId?.name ||
                  delivery.customerId?.name ||
                  delivery.customer?.name ||
                  "Customer"
                }
                address={formatAddress(
                  delivery.deliveryAddress ||
                    delivery.dropAddress
                )}
                phone={
                  delivery.userId?.contactNo ||
                  delivery.userId?.phone ||
                  delivery.customer?.phone
                }
                icon={<FaUser />}
                iconClass="bg-green-500/20 text-green-400"
              />
            </section>

            {/* Order Information */}

            <section className="rounded-3xl border border-gray-800 bg-[#1F2937] p-6">
              <h2 className="text-xl font-bold text-white">
                Delivery Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoBox
                  label="Order Amount"
                  value={formatCurrency(
                    delivery.orderId
                      ?.totalAmount ||
                      delivery.totalAmount
                  )}
                />

                <InfoBox
                  label="Payment"
                  value={
                    delivery.orderId
                      ?.paymentMethod ||
                    delivery.paymentMethod ||
                    "COD"
                  }
                />

                <InfoBox
                  label="Distance"
                  value={
                    delivery.distance
                      ? `${delivery.distance} km`
                      : "Not available"
                  }
                />

                <InfoBox
                  label="Delivery Fee"
                  value={formatCurrency(
                    delivery.deliveryFee
                  )}
                />
              </div>
            </section>

            {/* Actions */}

            <DeliveryActions
              status={delivery.status}
              updating={updating}
              onUpdate={updateDeliveryStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DeliveryActions({
  status,
  updating,
  onUpdate,
}) {
  if (
    status === "Assigned" ||
    status === "Accepted"
  ) {
    return (
      <ActionButton
        text="Arrived At Restaurant"
        loading={updating}
        onClick={() =>
          onUpdate("Arrived At Restaurant")
        }
      />
    );
  }

  if (status === "Arrived At Restaurant") {
    return (
      <ActionButton
        text="Order Picked Up"
        loading={updating}
        onClick={() => onUpdate("Picked Up")}
      />
    );
  }

  if (status === "Picked Up") {
    return (
      <ActionButton
        text="Start Delivery"
        loading={updating}
        onClick={() =>
          onUpdate("Out For Delivery")
        }
      />
    );
  }

  if (status === "Out For Delivery") {
    return (
      <ActionButton
        text="Mark As Delivered"
        loading={updating}
        onClick={() => onUpdate("Delivered")}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#1F2937] p-5 text-center text-gray-400">
      No action is available for this
      delivery status.
    </div>
  );
}

function ActionButton({
  text,
  loading,
  onClick,
}) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <FaCheck />

        {loading ? "Updating..." : text}
      </button>
    </div>
  );
}

function DeliveryProgress({ status }) {
  const steps = [
    "Assigned",
    "Arrived At Restaurant",
    "Picked Up",
    "Out For Delivery",
    "Delivered",
  ];

  const normalizedStatus =
    status === "Accepted"
      ? "Assigned"
      : status;

  const activeIndex = steps.indexOf(
    normalizedStatus
  );

  return (
    <section className="rounded-3xl border border-gray-800 bg-[#1F2937] p-6">
      <h2 className="text-xl font-bold text-white">
        Delivery Progress
      </h2>

      <div className="mt-6 space-y-5">
        {steps.map((step, index) => {
          const completed =
            index <= activeIndex;

          return (
            <div
              key={step}
              className="flex items-center gap-4"
            >
              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  font-bold
                  ${
                    completed
                      ? "bg-orange-500 text-white"
                      : "bg-[#111827] text-gray-500"
                  }
                `}
              >
                {completed ? (
                  <FaCheck />
                ) : (
                  index + 1
                )}
              </div>

              <div>
                <p
                  className={
                    completed
                      ? "font-semibold text-white"
                      : "font-semibold text-gray-500"
                  }
                >
                  {formatStatus(step)}
                </p>

                {index === activeIndex && (
                  <p className="mt-1 text-xs text-orange-400">
                    Current status
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LocationCard({
  title,
  name,
  address,
  phone,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-3xl border border-gray-800 bg-[#1F2937] p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h3 className="mt-1 text-lg font-bold text-white">
            {name}
          </h3>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-start gap-3 text-gray-300">
          <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-500" />

          <p className="text-sm leading-6">
            {address}
          </p>
        </div>

        {phone && (
          <div className="flex items-center gap-3 text-gray-300">
            <FaPhoneAlt className="text-green-500" />

            <a
              href={`tel:${phone}`}
              className="text-sm hover:text-green-400"
            >
              {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#111827] p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function EmptyDelivery() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-700 bg-[#1F2937] p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#111827] text-3xl text-gray-500">
        <FaMotorcycle />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-white">
        No Active Delivery
      </h2>

      <p className="mt-3 max-w-md leading-6 text-gray-400">
        Accept an available delivery request to
        start a new delivery.
      </p>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <FaMotorcycle className="mx-auto animate-pulse text-4xl text-orange-500" />

        <p className="mt-4 text-gray-400">
          Loading active delivery...
        </p>
      </div>
    </div>
  );
}

function getSuccessMessage(status) {
  const messages = {
    "Arrived At Restaurant":
      "Arrival confirmed",
    "Picked Up":
      "Order pickup confirmed",
    "Out For Delivery":
      "Delivery started",
    Delivered:
      "Order delivered successfully",
  };

  return (
    messages[status] ||
    "Delivery status updated"
  );
}

function formatStatus(status) {
  return String(status || "Unknown")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatAddress(address) {
  if (!address) {
    return "Address unavailable";
  }

  if (typeof address === "string") {
    return address;
  }

  return [
    address.houseNo,
    address.houseNumber,
    address.street,
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}