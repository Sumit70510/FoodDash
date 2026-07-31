import React from "react";
import {
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  Gift,
  Wallet,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function DeliveryPartnerEarnings() {
  const { user } = useSelector(
    (state) => state.auth
  );

  const totalEarnings = Number(
    user?.totalEarnings || 0
  );

  const totalIncentives = Number(
    user?.totalIncentives || 0
  );

  const totalDeductions = Number(
    user?.totalDeductions || 0
  );

  const netEarnings =
    totalEarnings +
    totalIncentives -
    totalDeductions;

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-500">
            Income Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Earnings
          </h1>

          <p className="mt-2 text-slate-400">
            Track delivery earnings,
            incentives and deductions.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-500 to-orange-700 p-6 md:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">
            <div className="flex items-center gap-3 text-white/80">
              <Wallet size={24} />

              <p className="font-medium">
                Net Earnings
              </p>
            </div>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              {formatCurrency(netEarnings)}
            </h2>

            <p className="mt-3 text-sm text-white/75">
              Earnings after incentives and
              deductions
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <EarningCard
            label="Delivery Earnings"
            value={totalEarnings}
            icon={CircleDollarSign}
            iconClass="bg-green-500/20 text-green-400"
            valueClass="text-green-400"
          />

          <EarningCard
            label="Incentives"
            value={totalIncentives}
            icon={Gift}
            iconClass="bg-blue-500/20 text-blue-400"
            valueClass="text-blue-400"
            prefix="+"
          />

          <EarningCard
            label="Deductions"
            value={totalDeductions}
            icon={ArrowDown}
            iconClass="bg-red-500/20 text-red-400"
            valueClass="text-red-400"
            prefix="-"
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            Earnings Breakdown
          </h2>

          <div className="mt-6 space-y-4">
            <BreakdownRow
              label="Delivery earnings"
              value={totalEarnings}
              icon={CircleDollarSign}
            />

            <BreakdownRow
              label="Performance incentives"
              value={totalIncentives}
              icon={ArrowUp}
              prefix="+"
              valueClass="text-green-400"
            />

            <BreakdownRow
              label="Deductions"
              value={totalDeductions}
              icon={ArrowDown}
              prefix="-"
              valueClass="text-red-400"
            />

            <div className="border-t border-slate-700 pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">
                  Net Earnings
                </span>

                <span className="text-2xl font-bold text-orange-400">
                  {formatCurrency(
                    netEarnings
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function EarningCard({
  label,
  value,
  icon: Icon,
  iconClass,
  valueClass,
  prefix = "",
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
      >
        <Icon size={22} />
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${valueClass}`}
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
  icon: Icon,
  prefix = "",
  valueClass = "text-white",
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-orange-400">
          <Icon size={18} />
        </div>

        <span className="text-sm text-slate-300">
          {label}
        </span>
      </div>

      <span
        className={`font-bold ${valueClass}`}
      >
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