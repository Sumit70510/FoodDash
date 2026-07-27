import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaHistory,
  FaMapMarkerAlt,
  FaSearch,
  FaStore,
} from "react-icons/fa";
import { toast } from "sonner";
import api from "../utils/axios.js";

export default function DeliveryPartnerHistory() {
  const [deliveries, setDeliveries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const fetchDeliveryHistory = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/delivery/history"
      );

      if (response.data?.success) {
        setDeliveries(
          response.data.deliveries || []
        );
      }
    } catch (error) {
      console.error(
        "Delivery history error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load delivery history"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const orderNumber =
        delivery.orderId?._id ||
        delivery._id ||
        "";

      const restaurantName =
        delivery.restaurantId?.name ||
        delivery.restaurant?.name ||
        "";

      const matchesSearch =
        orderNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        restaurantName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        delivery.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    deliveries,
    search,
    statusFilter,
  ]);

  const completedCount =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Delivered"
    ).length;

  const cancelledCount =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Cancelled"
    ).length;

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Previous Deliveries
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Delivery History
          </h1>

          <p className="mt-2 text-gray-400">
            Review your completed and cancelled
            delivery assignments.
          </p>
        </div>

        {/* Stats */}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <HistoryStat
            title="Total Assignments"
            value={deliveries.length}
            valueClass="text-white"
          />

          <HistoryStat
            title="Completed"
            value={completedCount}
            valueClass="text-green-400"
          />

          <HistoryStat
            title="Cancelled"
            value={cancelledCount}
            valueClass="text-red-400"
            extraClass="col-span-2 lg:col-span-1"
          />
        </div>

        {/* Filters */}

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#1F2937] p-4 md:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order or restaurant"
              className="w-full rounded-xl border border-gray-700 bg-[#111827] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-700 bg-[#111827] px-4 py-3 text-white outline-none focus:border-orange-500"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">
            Loading delivery history...
          </div>
        ) : filteredDeliveries.length ===
          0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map(
              (delivery) => (
                <HistoryCard
                  key={delivery._id}
                  delivery={delivery}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ delivery }) {
  const orderId =
    delivery.orderId?._id ||
    delivery._id;

  const restaurantName =
    delivery.restaurantId?.name ||
    delivery.restaurant?.name ||
    "Restaurant";

  const pickupAddress =
    delivery.restaurantId?.location
      ?.address ||
    delivery.pickupAddress ||
    "Pickup address unavailable";

  const status =
    delivery.status || "Unknown";

  return (
    <article className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5 md:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white">
              Order #
              {orderId
                ?.slice(-6)
                .toUpperCase()}
            </h2>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                status === "Delivered"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <FaStore className="text-orange-500" />
              {restaurantName}
            </div>

            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-red-400" />
              {pickupAddress}
            </div>

            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-blue-400" />

              {formatDate(
                delivery.deliveredAt ||
                  delivery.updatedAt ||
                  delivery.createdAt
              )}
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-sm text-gray-500">
            Delivery Earning
          </p>

          <p className="mt-1 text-2xl font-bold text-green-400">
            {formatCurrency(
              delivery.deliveryFee ||
                delivery.earning
            )}
          </p>
        </div>
      </div>
    </article>
  );
}

function HistoryStat({
  title,
  value,
  valueClass,
  extraClass = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-800 bg-[#1F2937] p-5 ${extraClass}`}
    >
      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-700 bg-[#1F2937] py-20 text-center">
      <FaHistory className="mx-auto text-4xl text-gray-600" />

      <h2 className="mt-5 text-xl font-bold text-white">
        No Delivery History
      </h2>

      <p className="mt-2 text-gray-400">
        Your completed deliveries will appear
        here.
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

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  return new Date(value).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}