import Cart from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  try {
    const {
      menuItemId,
      quantity,
      selectedVariant,
      restaurantId,
    } = req.body;

    if (
      !menuItemId ||
      !selectedVariant ||
      !restaurantId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (
      cart &&
      cart.restaurantId.toString() !==
        restaurantId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You can only order from one restaurant at a time",
      });
    }

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        restaurantId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.menuItemId.toString() ===
          menuItemId &&
        item.selectedVariant.sizeType ===
          selectedVariant.sizeType
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        menuItemId,
        quantity: quantity || 1,
        selectedVariant,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.log("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user._id,
    }).populate("items.menuItemId");

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCartItemQuantity = async (
  req,
  res
) => {
  try {
    const { cartItemId } = req.params;

    const { quantity } = req.body;

    const cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.id(cartItemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.log(
      "Update Cart Quantity Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeCartItem = async (
  req,
  res
) => {
  try {
    const { cartItemId } = req.params;

    const cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item._id.toString() !== cartItemId
    );

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);

      return res.status(200).json({
        success: true,
        message: "Cart is now empty",
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      cart,
    });
  } catch (error) {
    console.log(
      "Remove Cart Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.log("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};