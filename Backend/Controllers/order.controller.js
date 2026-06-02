import Order from "../Models/order.model.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      restaurantId,
      deliveryAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !items ||
      items.length === 0 ||
      !restaurantId ||
      !deliveryAddress ||
      !paymentMethod ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const order = await Order.create({
      userId: req.user?._id || req.restraunt?._id,

      restaurantId,

      items,

      deliveryAddress,

      paymentMethod,

      totalAmount,

      orderStatus: "Placed",

      paymentStatus: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Place Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    })
      .populate("restaurantId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get User Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRestaurantOrders = async (
  req,
  res
) => {
  try {
    const { restaurantId } = req.params;

    const orders = await Order.find({
      restaurantId,
    })
      .populate("userId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log("Get Restaurant Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleOrder = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("restaurantId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Get Single Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderId } = req.params;

    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus: "Cancelled",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};