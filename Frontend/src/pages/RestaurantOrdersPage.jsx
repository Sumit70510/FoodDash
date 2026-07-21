import React, { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaClock,
  FaList,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaPhoneAlt,
  FaReceipt,
  FaRedoAlt,
  FaTimes,
  FaUser,
  FaUtensils,
} from "react-icons/fa";
import api from "../utils/axios.js";
import { toast } from "sonner";

const ORDER_FILTERS = [
  {
    label: "Active Orders",
    value: "active",
  },
  {
    label: "New Orders",
    value: "Placed",
  },
  {
    label: "Accepted",
    value: "Accepted",
  },
  {
    label: "Preparing",
    value: "Preparing",
  },
  {
    label: "Ready",
    value: "Ready For Pickup",
  },
  {
    label: "Picked Up",
    value: "Picked Up",
  },
  {
    label: "Out For Delivery",
    value: "Out For Delivery",
  },
  {
    label: "Delivered",
    value: "Delivered",
  },
  {
    label: "Rejected",
    value: "Cancelled",
  },
  {
    label: "All Orders",
    value: "all",
  },
];

const ACTIVE_ORDER_STATUSES = [
  "Placed",
  "Accepted",
  "Preparing",
  "Ready For Pickup",
  "Picked Up",
  "Out For Delivery",
];

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("active");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      /*
       * Fetch all restaurant orders.
       *
       * Filtering is performed on the frontend so that the statistics
       * always show totals for every order, regardless of the selected tab.
       */
      const response = await api.get("/order");

      if (response.data?.success) {
        const receivedOrders = response.data.orders || [];

        const sortedOrders = [...receivedOrders].sort((a, b) => {
          /*
           * Always show newly placed orders before other orders.
           */
          if (a.status === "Placed" && b.status !== "Placed") {
            return -1;
          }

          if (a.status !== "Placed" && b.status === "Placed") {
            return 1;
          }

          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        });

        setOrders(sortedOrders);
      } else {
        setOrders([]);
        toast.error(
          response.data?.message || "Unable to load orders"
        );
      }
    } catch (error) {
      console.error("Fetch restaurant orders error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load restaurant orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!orderId || !status || updatingOrderId) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);

      const response = await api.put(`/order/${orderId}`, {
        status,
      });

      if (response.data?.success) {
        /*
         * Update the changed order locally instead of fetching
         * every order again.
         */
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status:
                    response.data?.order?.status || status,
                  ...(response.data?.order || {}),
                }
              : order
          )
        );

        const successMessages = {
          Accepted: "Order accepted successfully",
          Preparing: "Order preparation started",
          "Ready For Pickup": "Order marked ready for pickup",
          Cancelled: "Order rejected successfully",
        };

        toast.success(
          successMessages[status] || "Order status updated"
        );
      } else {
        toast.error(
          response.data?.message || "Unable to update order"
        );
      }
    } catch (error) {
      console.error("Update restaurant order error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update order"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const acceptOrder = (orderId) => {
    updateOrderStatus(orderId, "Accepted");
  };

  const rejectOrder = (orderId) => {
    updateOrderStatus(orderId, "Cancelled");
  };

  const startPreparingOrder = (orderId) => {
    updateOrderStatus(orderId, "Preparing");
  };

  const markOrderReady = (orderId) => {
    updateOrderStatus(orderId, "Ready For Pickup");
  };

  const filteredOrders = useMemo(() => {
    if (filter === "all") {
      return orders;
    }

    if (filter === "active") {
      return orders.filter((order) =>
        ACTIVE_ORDER_STATUSES.includes(order.status)
      );
    }

    return orders.filter(
      (order) => order.status === filter
    );
  }, [orders, filter]);

  const orderCounts = useMemo(() => {
    return {
      total: orders.length,

      active: orders.filter((order) =>
        ACTIVE_ORDER_STATUSES.includes(order.status)
      ).length,

      placed: orders.filter(
        (order) => order.status === "Placed"
      ).length,

      accepted: orders.filter(
        (order) => order.status === "Accepted"
      ).length,

      preparing: orders.filter(
        (order) => order.status === "Preparing"
      ).length,

      ready: orders.filter(
        (order) => order.status === "Ready For Pickup"
      ).length,

      delivered: orders.filter(
        (order) => order.status === "Delivered"
      ).length,

      cancelled: orders.filter(
        (order) => order.status === "Cancelled"
      ).length,
    };
  }, [orders]);

  const getFilterCount = (filterValue) => {
    switch (filterValue) {
      case "all":
        return orderCounts.total;

      case "active":
        return orderCounts.active;

      case "Placed":
        return orderCounts.placed;

      case "Accepted":
        return orderCounts.accepted;

      case "Preparing":
        return orderCounts.preparing;

      case "Ready For Pickup":
        return orderCounts.ready;

      case "Delivered":
        return orderCounts.delivered;

      case "Cancelled":
        return orderCounts.cancelled;

      default:
        return orders.filter(
          (order) => order.status === filterValue
        ).length;
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-500">
              Restaurant Management
            </p>

            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Active Orders
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
              Accept incoming customer orders, reject unavailable
              orders and update preparation progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-700
              bg-[#1F2937]
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:border-orange-500
              hover:text-orange-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <FaRedoAlt
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>

        {/* Stats */}

        <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            title="Active Orders"
            value={orderCounts.active}
            icon={<FaList />}
            iconClass="text-blue-400"
            valueClass="text-white"
          />

          <StatCard
            title="New Orders"
            value={orderCounts.placed}
            icon={<FaClock />}
            iconClass="text-yellow-400"
            valueClass="text-yellow-400"
            highlight={orderCounts.placed > 0}
          />

          <StatCard
            title="Preparing"
            value={orderCounts.preparing}
            icon={<FaUtensils />}
            iconClass="text-purple-400"
            valueClass="text-purple-400"
          />

          <StatCard
            title="Ready For Pickup"
            value={orderCounts.ready}
            icon={<FaMotorcycle />}
            iconClass="text-green-400"
            valueClass="text-green-400"
          />
        </div>

        {/* New Order Alert */}

        {orderCounts.placed > 0 && (
          <div
            className="
              mb-6
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-yellow-500/40
              bg-yellow-500/10
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-400">
                <FaClock />
              </div>

              <div>
                <h2 className="font-bold text-yellow-300">
                  {orderCounts.placed} new{" "}
                  {orderCounts.placed === 1
                    ? "order is"
                    : "orders are"}{" "}
                  waiting
                </h2>

                <p className="mt-1 text-sm text-yellow-100/70">
                  Review the order details and accept or reject
                  each order.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFilter("Placed")}
              className="rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-gray-950 transition hover:bg-yellow-400"
            >
              Review New Orders
            </button>
          </div>
        )}

        {/* Filters */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-800 bg-[#1F2937] p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {ORDER_FILTERS.map((filterItem) => {
              const count = getFilterCount(filterItem.value);
              const isSelected =
                filter === filterItem.value;

              return (
                <button
                  type="button"
                  key={filterItem.value}
                  onClick={() =>
                    setFilter(filterItem.value)
                  }
                  className={`
                    flex
                    shrink-0
                    items-center
                    gap-2
                    whitespace-nowrap
                    rounded-xl
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition
                    ${
                      isSelected
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "bg-[#111827] text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  {filterItem.label}

                  <span
                    className={`
                      rounded-full
                      px-2
                      py-0.5
                      text-xs
                      ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-700 text-gray-300"
                      }
                    `}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders */}

        {loading ? (
          <OrdersLoading />
        ) : filteredOrders.length === 0 ? (
          <EmptyOrders filter={filter} />
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                expanded={
                  expandedOrderId === order._id
                }
                updating={
                  updatingOrderId === order._id
                }
                onToggle={() =>
                  setExpandedOrderId((currentId) =>
                    currentId === order._id
                      ? null
                      : order._id
                  )
                }
                onAccept={() =>
                  acceptOrder(order._id)
                }
                onReject={() =>
                  rejectOrder(order._id)
                }
                onStartPreparing={() =>
                  startPreparingOrder(order._id)
                }
                onMarkReady={() =>
                  markOrderReady(order._id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  updating,
  onToggle,
  onAccept,
  onReject,
  onStartPreparing,
  onMarkReady,
}) {
  const isNewOrder = order.status === "Placed";

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const customerName =
    order.userId?.name ||
    order.customerId?.name ||
    order.customer?.name ||
    order.user?.name ||
    "Customer";

  const customerPhone =
    order.userId?.phone ||
    order.userId?.phoneNumber ||
    order.customerId?.phone ||
    order.customer?.phone ||
    order.phone ||
    "";

  const deliveryAddress = formatDeliveryAddress(
    order.deliveryAddress ||
      order.address ||
      order.shippingAddress
  );

  const totalAmount =
    order.totalAmount ??
    order.totalPrice ??
    calculateItemsTotal(items);

  return (
    <article
      className={`
        overflow-hidden
        rounded-3xl
        border
        bg-[#1F2937]
        transition
        ${
          isNewOrder
            ? "border-yellow-500/60 shadow-lg shadow-yellow-500/5"
            : "border-gray-800"
        }
      `}
    >
      {/* New Order Header */}

      {isNewOrder && (
        <div className="flex items-center gap-2 border-b border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-semibold text-yellow-300 md:px-6">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />

            <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-400" />
          </span>

          New customer order awaiting your response
        </div>
      )}

      <div className="p-5 md:p-6">
        {/* Main Order Summary */}

        <div className="flex flex-col justify-between gap-5 md:flex-row">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                Order #
                {order._id
                  ?.slice(-6)
                  .toUpperCase() || "------"}
              </h2>

              <span
                className={`
                  rounded-full
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  ${getStatusColor(order.status)}
                `}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaUser className="text-orange-500" />
                <span>{customerName}</span>
              </div>

              {customerPhone && (
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="text-green-500" />
                  <span>{customerPhone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <FaClock className="text-blue-400" />

                <span>
                  {formatOrderDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-5 md:block md:text-right">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Order Total
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-500 md:text-3xl">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="mt-0 rounded-xl border border-gray-700 bg-[#111827] px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-orange-500 hover:text-orange-400 md:mt-3"
            >
              {expanded ? "Hide Details" : "View Details"}
            </button>
          </div>
        </div>

        {/* Item Preview */}

        <div className="mt-5 rounded-2xl bg-[#111827] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <FaReceipt className="text-orange-500" />
              Ordered Items
            </h3>

            <span className="text-sm text-gray-400">
              {getTotalItemQuantity(items)}{" "}
              {getTotalItemQuantity(items) === 1
                ? "item"
                : "items"}
            </span>
          </div>

          <div className="space-y-2.5">
            {items.length > 0 ? (
              items.map((item, index) => {
                const itemName = getItemName(item);
                const itemPrice = getItemPrice(item);
                const quantity =
                  Number(item.quantity) || 1;

                return (
                  <div
                    key={
                      item._id ||
                      item.menuItemId?._id ||
                      item.menuItem?._id ||
                      index
                    }
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-orange-500/15 font-bold text-orange-400">
                        {quantity}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-200">
                          {itemName}
                        </p>

                        {item.instructions && (
                          <p className="mt-1 text-xs text-yellow-400">
                            Note: {item.instructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="shrink-0 font-medium text-gray-300">
                      {formatCurrency(
                        itemPrice * quantity
                      )}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                Item information is unavailable.
              </p>
            )}
          </div>
        </div>

        {/* Expanded Information */}

        {expanded && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InformationCard
              title="Delivery Address"
              icon={
                <FaMapMarkerAlt className="text-red-400" />
              }
            >
              <p className="leading-6 text-gray-300">
                {deliveryAddress ||
                  "Delivery address is unavailable"}
              </p>
            </InformationCard>

            <InformationCard
              title="Payment Information"
              icon={
                <FaReceipt className="text-green-400" />
              }
            >
              <div className="space-y-3">
                <InformationRow
                  label="Method"
                  value={
                    order.paymentMethod ||
                    order.paymentType ||
                    "COD"
                  }
                />

                <InformationRow
                  label="Status"
                  value={
                    order.paymentStatus ||
                    "Pending"
                  }
                  valueClass={getPaymentStatusColor(
                    order.paymentStatus
                  )}
                />
              </div>
            </InformationCard>

            {order.orderInstructions ||
            order.instructions ||
            order.note ? (
              <div className="rounded-2xl bg-[#111827] p-4 md:col-span-2">
                <h3 className="mb-2 font-semibold text-white">
                  Customer Instructions
                </h3>

                <p className="text-sm leading-6 text-yellow-300">
                  {order.orderInstructions ||
                    order.instructions ||
                    order.note}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Restaurant Actions */}

        <div className="mt-6 border-t border-gray-800 pt-5">
          <OrderActions
            status={order.status}
            updating={updating}
            onAccept={onAccept}
            onReject={onReject}
            onStartPreparing={onStartPreparing}
            onMarkReady={onMarkReady}
          />
        </div>
      </div>
    </article>
  );
}

function OrderActions({
  status,
  updating,
  onAccept,
  onReject,
  onStartPreparing,
  onMarkReady,
}) {
  if (status === "Placed") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onReject}
          disabled={updating}
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-red-500/50
            bg-red-500/10
            px-5
            py-2.5
            font-semibold
            text-red-400
            transition
            hover:bg-red-500
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <FaTimes />

          {updating ? "Updating..." : "Reject Order"}
        </button>

        <button
          type="button"
          onClick={onAccept}
          disabled={updating}
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-500
            px-6
            py-2.5
            font-semibold
            text-white
            transition
            hover:bg-green-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <FaCheck />

          {updating ? "Updating..." : "Accept Order"}
        </button>
      </div>
    );
  }

  if (status === "Accepted") {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onStartPreparing}
          disabled={updating}
          className="
            inline-flex
            w-full
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-purple-500
            px-6
            py-2.5
            font-semibold
            text-white
            transition
            hover:bg-purple-600
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          <FaUtensils />

          {updating
            ? "Updating..."
            : "Start Preparing"}
        </button>
      </div>
    );
  }

  if (status === "Preparing") {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onMarkReady}
          disabled={updating}
          className="
            inline-flex
            w-full
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-500
            px-6
            py-2.5
            font-semibold
            text-white
            transition
            hover:bg-green-600
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto
          "
        >
          <FaCheck />

          {updating
            ? "Updating..."
            : "Mark Ready For Pickup"}
        </button>
      </div>
    );
  }

  if (status === "Ready For Pickup") {
    return (
      <StatusMessage
        icon={<FaCheck />}
        text="The order is ready and waiting for pickup."
        className="border-green-500/30 bg-green-500/10 text-green-400"
      />
    );
  }

  if (
    status === "Picked Up" ||
    status === "Out For Delivery"
  ) {
    return (
      <StatusMessage
        icon={<FaMotorcycle />}
        text="The delivery partner is handling this order."
        className="border-blue-500/30 bg-blue-500/10 text-blue-400"
      />
    );
  }

  if (status === "Delivered") {
    return (
      <StatusMessage
        icon={<FaCheck />}
        text="This order has been delivered successfully."
        className="border-green-500/30 bg-green-500/10 text-green-400"
      />
    );
  }

  if (status === "Cancelled") {
    return (
      <StatusMessage
        icon={<FaTimes />}
        text="This order was rejected or cancelled."
        className="border-red-500/30 bg-red-500/10 text-red-400"
      />
    );
  }

  return null;
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
  valueClass,
  highlight = false,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        bg-[#1F2937]
        p-5
        transition
        ${
          highlight
            ? "border-yellow-500/50 shadow-lg shadow-yellow-500/5"
            : "border-gray-800"
        }
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className={`text-2xl ${iconClass}`}
        >
          {icon}
        </div>

        <span
          className={`text-3xl font-bold md:text-4xl ${valueClass}`}
        >
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-400">
        {title}
      </p>
    </div>
  );
}

function InformationCard({
  title,
  icon,
  children,
}) {
  return (
    <div className="rounded-2xl bg-[#111827] p-4">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
        {icon}
        {title}
      </h3>

      {children}
    </div>
  );
}

function InformationRow({
  label,
  value,
  valueClass = "text-white",
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-gray-500">
        {label}
      </span>

      <span
        className={`text-right font-semibold ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusMessage({
  icon,
  text,
  className,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        border
        px-4
        py-3
        text-sm
        font-semibold
        ${className}
      `}
    >
      {icon}
      {text}
    </div>
  );
}

function OrdersLoading() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-gray-800 bg-[#1F2937] p-6"
        >
          <div className="flex justify-between gap-4">
            <div className="space-y-3">
              <div className="h-6 w-48 rounded bg-gray-700" />
              <div className="h-4 w-36 rounded bg-gray-700" />
            </div>

            <div className="h-8 w-24 rounded bg-gray-700" />
          </div>

          <div className="mt-6 h-28 rounded-2xl bg-[#111827]" />
        </div>
      ))}
    </div>
  );
}

function EmptyOrders({ filter }) {
  const message =
    filter === "active"
      ? "There are currently no active orders."
      : filter === "Placed"
      ? "No new customer orders are waiting."
      : "No orders were found for this status.";

  return (
    <div className="rounded-3xl border border-gray-800 bg-[#1F2937] px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111827] text-2xl text-gray-500">
        <FaReceipt />
      </div>

      <h3 className="mt-5 text-2xl font-bold text-white">
        No Orders Found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-gray-400">
        {message}
      </p>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "Placed":
      return "bg-yellow-500/20 text-yellow-400";

    case "Accepted":
      return "bg-blue-500/20 text-blue-400";

    case "Preparing":
      return "bg-purple-500/20 text-purple-400";

    case "Ready For Pickup":
      return "bg-green-500/20 text-green-400";

    case "Picked Up":
      return "bg-indigo-500/20 text-indigo-400";

    case "Out For Delivery":
      return "bg-orange-500/20 text-orange-400";

    case "Delivered":
      return "bg-green-600/20 text-green-500";

    case "Cancelled":
      return "bg-red-500/20 text-red-400";

    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

function getStatusLabel(status) {
  if (status === "Placed") {
    return "New Order";
  }

  if (status === "Cancelled") {
    return "Rejected";
  }

  return status || "Unknown";
}

function getPaymentStatusColor(status) {
  const normalizedStatus = String(
    status || ""
  ).toLowerCase();

  if (
    normalizedStatus === "paid" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "success"
  ) {
    return "text-green-400";
  }

  if (
    normalizedStatus === "failed" ||
    normalizedStatus === "cancelled"
  ) {
    return "text-red-400";
  }

  return "text-yellow-400";
}

function getItemName(item) {
  return (
    item.name ||
    item.itemName ||
    item.menuItemId?.name ||
    item.menuItemId?.itemName ||
    item.menuItem?.name ||
    item.productId?.name ||
    "Menu item"
  );
}

function getItemPrice(item) {
  return Number(
    item.price ??
      item.itemPrice ??
      item.menuItemId?.price ??
      item.menuItem?.price ??
      item.productId?.price ??
      0
  );
}

function calculateItemsTotal(items) {
  return items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 1;
    const price = getItemPrice(item);

    return total + price * quantity;
  }, 0);
}

function getTotalItemQuantity(items) {
  return items.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 1),
    0
  );
}

function formatCurrency(value) {
  const numberValue = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

function formatOrderDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDeliveryAddress(address) {
  if (!address) {
    return "";
  }

  if (typeof address === "string") {
    return address;
  }

  if (typeof address !== "object") {
    return String(address);
  }

  return [
    address.fullName,
    address.houseNo,
    address.houseNumber,
    address.street,
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}