import Cart from "../Models/cart.model.js";
import MenuItem from "../Models/menu.item.model.js";

const calculateCartTotal = (cart) => {
  return cart.items.reduce((total, item) => {
    const itemPrice =
      item.discountPrice > 0
        ? item.discountPrice
        : item.price;

    return total + itemPrice * item.quantity;
  }, 0);
};

export const addToCart = async (req, res) => {
  try {
    const {
      menuItemId,
      quantity = 1,
      selectedVariant,
    } = req.body;

    if (
      !menuItemId ||
      !selectedVariant?.sizeType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "menuItemId and sizeType are required",
      });
    }

    // console.log("success");
    const menuItem =await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ 
        success: false,
        message: "Menu item not found",
      });
    }
    // console.log("success");
    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message:
          "This item is currently unavailable",
      });
    }

    const restaurantId = menuItem.restaurantId.toString();
    
    const variant = menuItem.variants.find((v) =>
          v.sizeType === selectedVariant.sizeType);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message:
          "Selected variant not found",
      });
    }

    const sizeType =
      variant.sizeType;

    const price =
      variant.price;

    const discountPrice =
      variant.discountPrice || 0;

    let cart = await Cart.findOne({
      userId: req._id,
    });

    if (
      cart &&
      cart.restaurantId.toString() !==
        restaurantId
    ) {
      return res.status(409).json({
        success: false,
        message:
          "You can only order from one restaurant at a time. Please clear your cart first.",
      });
    }

    if (!cart) {
      cart = new Cart({
        userId: req._id,
        restaurantId,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.menuItemId.toString() ===
            menuItemId &&
          item.sizeType === sizeType
      );

    if (existingItem) {
      existingItem.quantity +=
        Number(quantity);
    } else {
      cart.items.push({
        menuItemId,
        quantity: Number(quantity),
        sizeType,
        price,
        discountPrice,
      });
    }

    cart.totalPrice =
      calculateCartTotal(cart);

    await cart.save();

    const populatedCart =
      await Cart.findById(cart._id)
        .populate("restaurantId")
        .populate({
          path: "items.menuItemId",
          populate: [
            {
              path: "categoryId",
            },
            {
              path: "restaurantId",
            },
          ],
        });

    return res.status(200).json({
      success: true,
      message:
        "Item added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(
      "Add To Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to add item to cart",
    });
  }
};

export const getCart = async (req,res) => {
  try 
   {
    const cart = await Cart.findOne({userId: req._id,})
      .populate("restaurantId")
      .populate("items.menuItemId");

    if(!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart Not Found..."
      });
    }

    return res.status(200).json({
      success: true,
      message : "Fetching Cart Items...",
      cart});
   }
  catch(error)
    {
     console.log("Get Cart Error:",error);
     return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",});
    }
 };

export const updateCartItemQuantity =
  async (req, res) => {
    try {
      const { cartItemId } =
        req.params;

      const { quantity } = req.body;

      if (
        !quantity ||
        Number(quantity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity must be greater than 0",
        });
      }

      const cart =
        await Cart.findOne({
          userId: req._id,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      const item =
        cart.items.id(cartItemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message:
            "Cart item not found",
        });
      }

      item.quantity =
        Number(quantity);

      cart.totalPrice =
        calculateCartTotal(cart);

      await cart.save();

      const populatedCart =
        await Cart.findById(cart._id)
          .populate("restaurantId")
          .populate(
            "items.menuItemId"
          );

      return res.status(200).json({
        success: true,
        message:
          "Cart updated successfully",
        cart: populatedCart,
      });
    } catch (error) {
      console.log(
        "Update Cart Quantity Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update quantity",
      });
    }
  };

export const removeCartItem =
  async (req, res) => {
    try {
      const { cartItemId } =
        req.params;

      const cart =
        await Cart.findOne({
          userId: req._id,
        });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      const itemExists =
        cart.items.some(
          (item) =>
            item._id.toString() ===
            cartItemId
        );

      if (!itemExists) {
        return res.status(404).json({
          success: false,
          message:
            "Cart item not found",
        });
      }

      cart.items = cart.items.filter(
        (item) =>
          item._id.toString() !==
          cartItemId
      );

      if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(
          cart._id
        );

        return res.status(200).json({
          success: true,
          message:
            "Cart is now empty",
        });
      }

      cart.totalPrice =
        calculateCartTotal(cart);

      await cart.save();

      const populatedCart =
        await Cart.findById(cart._id)
          .populate("restaurantId")
          .populate(
            "items.menuItemId"
          );

      return res.status(200).json({
        success: true,
        message:
          "Item removed successfully",
        cart: populatedCart,
      });
    } catch (error) {
      console.log(
        "Remove Cart Item Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to remove item",
      });
    }
  };

export const clearCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findOneAndDelete({
        userId: req._id,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "No cart found to clear",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Cart cleared successfully",
    });
  } catch (error) {
    console.log(
      "Clear Cart Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to clear cart",
    });
  }
};