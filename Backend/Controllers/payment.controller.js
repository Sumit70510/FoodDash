import crypto from "crypto";
import razorpay from "../Utils/razorpay.js";

import Payment from "../Models/payment.model.js";
import Order from "../Models/order.model.js";

/* =====================================================
   CREATE RAZORPAY ORDER
===================================================== */

export const createRazorpayOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      receipt,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt:
        receipt ||
        `receipt_${Date.now()}`,
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("Create Order Error :", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay Order",
    });
  }
};

/* =====================================================
   VERIFY PAYMENT
===================================================== */

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            "|" +
            razorpay_payment_id
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    const order = await Order.create({
      ...orderData,

      userId: req.user._id,

      paymentStatus: "Paid",

      orderStatus: "Placed",
    });

    const payment =
      await Payment.create({
        orderId: order._id,

        payerId: req.user._id,

        restaurantId:
          order.restaurantId,

        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,

        amount: order.totalAmount,

        currency: "INR",

        method:
          order.paymentMethod,

        paymentStatus: "Paid",
      });

    return res.status(200).json({
      success: true,
      message:
        "Payment Verified Successfully",
      payment,
      order,
    });
  } catch (error) {
    console.log(
      "Verify Payment Error :",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};

/* =====================================================
   PAYMENT HISTORY
===================================================== */

export const paymentHistory = async (
  req,
  res
) => {
  try {
    const payments =
      await Payment.find({
        payerId: req.user._id,
      })
        .populate("restaurantId")
        .populate("orderId")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch payment history",
    });
  }
};

/* =====================================================
   SINGLE PAYMENT
===================================================== */

export const getPayment = async (
  req,
  res
) => {
  try {
    const payment =
      await Payment.findById(
        req.params.paymentId
      )
        .populate("restaurantId")
        .populate("orderId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch payment",
    });
  }
};

/* =====================================================
   REFUND PAYMENT
===================================================== */

export const refundPayment =
  async (req, res) => {
    try {
      const payment =
        await Payment.findById(
          req.params.paymentId
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment Not Found",
        });
      }

      if (
        payment.paymentStatus !==
        "Paid"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment is not eligible for refund",
        });
      }

      const refund =
        await razorpay.payments.refund(
          payment.razorpayPaymentId,
          {
            amount:
              payment.amount * 100,
          }
        );

      payment.paymentStatus =
        "Refunded";

      await payment.save();

      if (payment.orderId) {
        await Order.findByIdAndUpdate(
          payment.orderId,
          {
            paymentStatus:
              "Refunded",
          }
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Refund Successful",
        refund,
      });
    } catch (error) {
      console.log(
        "Refund Error :",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Refund Failed",
      });
    }
  };

/* =====================================================
   RESTAURANT PAYMENT HISTORY
===================================================== */

export const restaurantPayments =
  async (req, res) => {
    try {
      const {
        restaurantId,
      } = req.params;

      const payments =
        await Payment.find({
          restaurantId,
        })
          .populate("orderId")
          .populate("payerId")
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        payments,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch payments",
      });
    }
  };

/* =====================================================
   PAYMENT STATS
===================================================== */

export const paymentStats =
  async (req, res) => {
    try {
      const totalPayments =
        await Payment.countDocuments();

      const totalRevenue =
        await Payment.aggregate([
          {
            $match: {
              paymentStatus:
                "Paid",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const totalRefund =
        await Payment.aggregate([
          {
            $match: {
              paymentStatus:
                "Refunded",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

      return res.status(200).json({
        success: true,

        totalPayments,

        totalRevenue:
          totalRevenue.length > 0
            ? totalRevenue[0].total
            : 0,

        totalRefund:
          totalRefund.length > 0
            ? totalRefund[0].total
            : 0,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch statistics",
      });
    }
  };