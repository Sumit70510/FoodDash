import Delivery from "../models/delivery.model.js";

export const createDelivery = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      deliveryFee,
      incentiveAmount,
      notes,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order Id is required",
      });
    }

    const existingDelivery =
      await Delivery.findOne({ orderId });

    if (existingDelivery) {
      return res.status(409).json({
        success: false,
        message:
          "Delivery already exists for this order",
      });
    }

    const delivery = await Delivery.create({
      orderId,
      deliveryFee,
      incentiveAmount,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      delivery,
    });
  } catch (error) {
    console.log(
      "Create Delivery Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const assignDeliveryPartner = async (
  req,
  res
) => {
  try {
    const { deliveryId } = req.params;

    const { deliveryPartnerId } = req.body;

    const delivery =
      await Delivery.findByIdAndUpdate(
        deliveryId,
        {
          deliveryPartnerId,
          status: "Assigned",
          assignedAt: new Date(),
        },
        { new: true }
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Delivery partner assigned successfully",
      delivery,
    });
  } catch (error) {
    console.log(
      "Assign Delivery Partner Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getPartnerDeliveries = async (
  req,
  res
) => {
  try {
    const { partnerId } = req.params;

    const deliveries = await Delivery.find({
      deliveryPartnerId: partnerId,
    })
      .populate("orderId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      deliveries,
    });
  } catch (error) {
    console.log(
      "Get Partner Deliveries Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleDelivery = async (
  req,
  res
) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await Delivery.findById(
      deliveryId
    )
      .populate("orderId")
      .populate("deliveryPartnerId");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      delivery,
    });
  } catch (error) {
    console.log(
      "Get Single Delivery Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateDeliveryStatus = async (
  req,
  res
) => {
  try {
    const { deliveryId } = req.params;

    const { status } = req.body;

    const updateData = {
      status,
    };

    if (status === "Picked Up") {
      updateData.pickedUpAt = new Date();
    }

    if (status === "Delivered") {
      updateData.deliveredAt = new Date();
    }

    if (status === "Cancelled") {
      updateData.cancelledAt = new Date();
    }

    const delivery =
      await Delivery.findByIdAndUpdate(
        deliveryId,
        updateData,
        { new: true }
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Delivery status updated successfully",
      delivery,
    });
  } catch (error) {
    console.log(
      "Update Delivery Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updatePayoutStatus = async (
  req,
  res
) => {
  try {
    const { deliveryId } = req.params;

    const { payoutStatus } = req.body;

    const delivery =
      await Delivery.findByIdAndUpdate(
        deliveryId,
        { payoutStatus },
        { new: true }
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Payout status updated successfully",
      delivery,
    });
  } catch (error) {
    console.log(
      "Update Payout Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteDelivery = async (
  req,
  res
) => {
  try {
    const { deliveryId } = req.params;

    const delivery =
      await Delivery.findByIdAndDelete(
        deliveryId
      );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Delivery deleted successfully",
    });
  } catch (error) {
    console.log(
      "Delete Delivery Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};