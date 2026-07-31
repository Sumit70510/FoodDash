import React, {
  useEffect,
  useState,
} from "react";
import {
  Check,
  Clock3,
  LoaderCircle,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  RefreshCw,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import api from "../utils/axios.js";

const deliverySteps = [
  "Assigned",
  "Arrived At Restaurant",
  "Picked Up",
  "Out For Delivery",
  "Delivered",
];

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
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get(
        "/delivery/active"
      );

      setDelivery(
        response.data?.delivery || null
      );
    } catch (error) {
      console.error(
        "Active delivery error:",
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

  const handleStatusUpdate = async (
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

      if (status === "Delivered") {
        setDelivery(null);
      } else {
        setDelivery(
          response.data?.delivery || {
            ...delivery,
            status,
          }
        );
      }

      toast.success(
        response.data?.message ||
          "Delivery status updated"
      );
    } catch (error) {
      console.error(
        "Delivery status error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update delivery status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoaderCircle className="animate-spin text-orange-500" />

        <p className="mt-4 text-slate-400">
          Loading active delivery...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              Current Assignment
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Active Delivery
            </h1>

            <p className="mt-2 text-slate-400">
              Update the delivery as you
              complete each stage.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              fetchActiveDelivery(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold hover:border-orange-500 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {!delivery ? (
          <EmptyActiveDelivery />
        ) : (
          <div className="space-y-6">
            <section className="rounded-3xl border border-orange-500/30 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-sm text-slate-400">
                    Delivery ID
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    #
                    {String(delivery._id)
                      .slice(-6)
                      .toUpperCase()}
                  </h2>
                </div>

                <span className="rounded-xl bg-orange-500/15 px-4 py-3 font-semibold text-orange-400">
                  {delivery.status ||
                    "Assigned"}
                </span>
              </div>
            </section>

            <DeliveryProgress
              status={delivery.status}
            />

            <section className="grid gap-6 lg:grid-cols-2">
              <LocationCard
                icon={Store}
                title="Restaurant Pickup"
                name={
                  delivery.restaurantId
                    ?.name ||
                  delivery.restaurant?.name ||
                  "Restaurant"
                }
                address={
                  delivery.restaurantId
                    ?.location?.address ||
                  delivery.pickupAddress ||
                  "Pickup address unavailable"
                }
                phone={
                  delivery.restaurantId
                    ?.restaurantContactNo ||
                  delivery.restaurantId
                    ?.contactNo
                }
              />

              <LocationCard
                icon={UserRound}
                title="Customer Delivery"
                name={
                  delivery.userId?.name ||
                  delivery.customerId?.name ||
                  "Customer"
                }
                address={formatAddress(
                  delivery.deliveryAddress ||
                    delivery.dropAddress
                )}
                phone={
                  delivery.userId?.contactNo ||
                  delivery.userId?.phone
                }
              />
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-bold">
                Order Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InformationBox
                  label="Order Amount"
                  value={formatCurrency(
                    delivery.orderId
                      ?.totalAmount ||
                      delivery.totalAmount
                  )}
                />

                <InformationBox
                  label="Payment"
                  value={
                    delivery.orderId
                      ?.paymentMethod ||
                    delivery.paymentMethod ||
                    "Not available"
                  }
                />

                <InformationBox
                  label="Distance"
                  value={
                    delivery.distance
                      ? `${delivery.distance} km`
                      : "Not available"
                  }
                />

                <InformationBox
                  label="Delivery Fee"
                  value={formatCurrency(
                    delivery.deliveryFee
                  )}
                />
              </div>
            </section>

            <StatusAction
              status={delivery.status}
              updating={updating}
              onUpdate={handleStatusUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DeliveryProgress({ status }) {
  const normalizedStatus =
    status === "Accepted"
      ? "Assigned"
      : status;

  const activeIndex =
    deliverySteps.indexOf(
      normalizedStatus
    );

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">
        Delivery Progress
      </h2>

      <div className="mt-6 space-y-5">
        {deliverySteps.map(
          (step, index) => {
            const completed =
              index <= activeIndex;

            return (
              <div
                key={step}
                className="flex items-center gap-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                    completed
                      ? "bg-orange-500"
                      : "bg-slate-950 text-slate-500"
                  }`}
                >
                  {completed ? (
                    <Check size={18} />
                  ) : (
                    index + 1
                  )}
                </div>

                <div>
                  <p
                    className={
                      completed
                        ? "font-semibold"
                        : "font-semibold text-slate-500"
                    }
                  >
                    {step}
                  </p>

                  {index === activeIndex && (
                    <p className="mt-1 text-xs text-orange-400">
                      Current stage
                    </p>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}

function StatusAction({
  status,
  updating,
  onUpdate,
}) {
  const actionMap = {
    Assigned: {
      next: "Arrived At Restaurant",
      label: "Arrived At Restaurant",
    },
    Accepted: {
      next: "Arrived At Restaurant",
      label: "Arrived At Restaurant",
    },
    "Arrived At Restaurant": {
      next: "Picked Up",
      label: "Confirm Order Pickup",
    },
    "Picked Up": {
      next: "Out For Delivery",
      label: "Start Delivery",
    },
    "Out For Delivery": {
      next: "Delivered",
      label: "Mark As Delivered",
    },
  };

  const action = actionMap[status];

  if (!action) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() =>
          onUpdate(action.next)
        }
        disabled={updating}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
      >
        {updating ? (
          <LoaderCircle
            size={19}
            className="animate-spin"
          />
        ) : (
          <PackageCheck size={19} />
        )}

        {updating
          ? "Updating..."
          : action.label}
      </button>
    </div>
  );
}

function LocationCard({
  icon: Icon,
  title,
  name,
  address,
  phone,
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
          <Icon size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="mt-1 text-lg font-bold">
            {name}
          </h3>
        </div>
      </div>

      <div className="mt-5 space-y-4 text-sm text-slate-300">
        <div className="flex items-start gap-3">
          <MapPin
            size={18}
            className="mt-0.5 shrink-0 text-orange-400"
          />

          <span>{address}</span>
        </div>

        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-3 hover:text-green-400"
          >
            <Phone
              size={18}
              className="text-green-400"
            />

            {phone}
          </a>
        )}
      </div>
    </div>
  );
}

function InformationBox({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-950 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-bold">
        {value}
      </p>
    </div>
  );
}

function EmptyActiveDelivery() {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
      <Navigation
        size={48}
        className="text-slate-600"
      />

      <h2 className="mt-5 text-2xl font-bold">
        No Active Delivery
      </h2>

      <p className="mt-3 max-w-md text-slate-400">
        Accept an available order to begin a
        new delivery.
      </p>
    </div>
  );
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
    address.addressLine1,
    address.addressLine2,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}