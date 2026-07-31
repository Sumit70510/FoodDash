import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CalendarDays,
  History,
  LoaderCircle,
  MapPin,
  Search,
  Store,
} from "lucide-react";
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
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/delivery/history"
      );

      setDeliveries(
        response.data?.deliveries || []
      );
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

  const filteredDeliveries = useMemo(
    () =>
      deliveries.filter((delivery) => {
        const id = String(
          delivery.orderId?._id ||
            delivery.orderId ||
            delivery._id ||
            ""
        ).toLowerCase();

        const restaurantName = String(
          delivery.restaurantId?.name ||
            delivery.restaurant?.name ||
            ""
        ).toLowerCase();

        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          id.includes(searchValue) ||
          restaurantName.includes(
            searchValue
          );

        const matchesStatus =
          statusFilter === "all" ||
          delivery.status === statusFilter;

        return (
          matchesSearch && matchesStatus
        );
      }),
    [
      deliveries,
      search,
      statusFilter,
    ]
  );

  const completedDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Delivered"
    ).length;

  const cancelledDeliveries =
    deliveries.filter(
      (delivery) =>
        delivery.status === "Cancelled"
    ).length;

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Previous Assignments
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Delivery History
          </h1>

          <p className="mt-2 text-slate-400">
            Review completed and cancelled
            deliveries.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <HistoryStat
            label="Total"
            value={deliveries.length}
          />

          <HistoryStat
            label="Completed"
            value={completedDeliveries}
            valueClass="text-green-400"
          />

          <HistoryStat
            label="Cancelled"
            value={cancelledDeliveries}
            valueClass="text-red-400"
            className="col-span-2 lg:col-span-1"
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order or restaurant"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none placeholder:text-slate-500 focus:border-orange-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-500"
          >
            <option value="all">
              All statuses
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
          <div className="flex min-h-80 flex-col items-center justify-center">
            <LoaderCircle className="animate-spin text-orange-500" />

            <p className="mt-4 text-slate-400">
              Loading history...
            </p>
          </div>
        ) : filteredDeliveries.length ===
          0 ? (
          <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
            <History
              size={46}
              className="text-slate-600"
            />

            <h2 className="mt-5 text-xl font-bold">
              No Deliveries Found
            </h2>

            <p className="mt-2 text-slate-400">
              Your delivery records will
              appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
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
    delivery.orderId ||
    delivery._id;

  const restaurant =
    delivery.restaurantId ||
    delivery.restaurant ||
    {};

  const completed =
    delivery.status === "Delivered";

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold">
              Order #
              {String(orderId)
                .slice(-6)
                .toUpperCase()}
            </h2>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                completed
                  ? "bg-green-500/15 text-green-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {delivery.status ||
                "Unknown"}
            </span>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <Store
                size={18}
                className="text-orange-400"
              />

              {restaurant.name ||
                "Restaurant"}
            </div>

            <div className="flex items-start gap-3">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-red-400"
              />

              {restaurant.location
                ?.address ||
                delivery.pickupAddress ||
                "Address unavailable"}
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays
                size={18}
                className="text-blue-400"
              />

              {formatDate(
                delivery.deliveredAt ||
                  delivery.updatedAt ||
                  delivery.createdAt
              )}
            </div>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-sm text-slate-500">
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
  label,
  value,
  valueClass = "text-white",
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900 p-5 ${className}`}
    >
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClass}`}
      >
        {value}
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