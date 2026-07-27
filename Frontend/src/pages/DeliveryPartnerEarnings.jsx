import React, { useMemo } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaGift,
  FaMoneyBillWave,
  FaRupeeSign,
  FaWallet,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function DeliveryPartnerEarnings() {
  const { user } = useSelector(
    (state) => state.auth
  );

  const deliveryPartner = user || {};

  const earnings = useMemo(() => {
    const totalEarnings = Number(
      deliveryPartner.totalEarnings || 0
    );

    const incentives = Number(
      deliveryPartner.totalIncentives || 0
    );

    const deductions = Number(
      deliveryPartner.totalDeductions || 0
    );

    return {
      totalEarnings,
      incentives,
      deductions,
      netEarnings:
        totalEarnings +
        incentives -
        deductions,
    };
  }, [deliveryPartner]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Income Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Earnings
          </h1>

          <p className="mt-2 text-gray-400">
            Track your delivery earnings,
            incentives and deductions.
          </p>
        </div>

        {/* Balance */}

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500 to-orange-700 p-6 md:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <FaWallet className="text-2xl text-white/80" />

              <p className="font-medium text-white/80">
                Net Earnings
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              {formatCurrency(
                earnings.netEarnings
              )}
            </h2>

            <p className="mt-3 text-sm text-white/70">
              Total amount after incentives and
              deductions
            </p>
          </div>
        </section>

        {/* Stats */}

        <section className="grid gap-4 md:grid-cols-3">
          <EarningCard
            title="Delivery Earnings"
            value={earnings.totalEarnings}
            icon={<FaMoneyBillWave />}
            iconClass="bg-green-500/20 text-green-400"
            valueClass="text-green-400"
          />

          <EarningCard
            title="Incentives"
            value={earnings.incentives}
            icon={<FaGift />}
            iconClass="bg-blue-500/20 text-blue-400"
            valueClass="text-blue-400"
            prefix="+"
          />

          <EarningCard
            title="Deductions"
            value={earnings.deductions}
            icon={<FaArrowDown />}
            iconClass="bg-red-500/20 text-red-400"
            valueClass="text-red-400"
            prefix="-"
          />
        </section>

        {/* Breakdown */}

        <section className="mt-8 rounded-3xl border border-gray-800 bg-[#1F2937] p-6">
          <h2 className="text-2xl font-bold text-white">
            Earnings Breakdown
          </h2>

          <div className="mt-6 space-y-4">
            <BreakdownRow
              label="Base delivery earnings"
              value={earnings.totalEarnings}
              icon={
                <FaRupeeSign className="text-green-400" />
              }
            />

            <BreakdownRow
              label="Performance incentives"
              value={earnings.incentives}
              icon={
                <FaArrowUp className="text-blue-400" />
              }
              prefix="+"
            />

            <BreakdownRow
              label="Penalties and deductions"
              value={earnings.deductions}
              icon={
                <FaArrowDown className="text-red-400" />
              }
              prefix="-"
            />

            <div className="border-t border-gray-700 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  Total Net Earnings
                </span>

                <span className="text-2xl font-bold text-orange-500">
                  {formatCurrency(
                    earnings.netEarnings
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Notice */}

        <section className="mt-8 rounded-3xl border border-gray-800 bg-[#1F2937] p-6">
          <h2 className="text-xl font-bold text-white">
            Payout Information
          </h2>

          <p className="mt-3 leading-7 text-gray-400">
            Your eligible earnings will be
            transferred according to the
            configured payout schedule. Bank
            account and payout management can be
            added when payment integration is
            available.
          </p>
        </section>
      </div>
    </div>
  );
}

function EarningCard({
  title,
  value,
  icon,
  iconClass,
  valueClass,
  prefix = "",
}) {
  return (
    <div className="rounded-3xl border border-gray-800 bg-[#1F2937] p-5">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconClass}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-gray-400">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${valueClass}`}
      >
        {Number(value) > 0 ? prefix : ""}
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  icon,
  prefix = "",
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#111827] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800">
          {icon}
        </div>

        <span className="text-sm text-gray-300">
          {label}
        </span>
      </div>

      <span className="font-bold text-white">
        {Number(value) > 0 ? prefix : ""}
        {formatCurrency(value)}
      </span>
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