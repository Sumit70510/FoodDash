import MenuItem from "../models/menu.item.model.js";

export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      restaurantId,
      categoryId,
      foodType,
      variants,
    } = req.body;

    if (
      !name ||
      !description ||
      !restaurantId ||
      !categoryId ||
      !foodType ||
      !variants
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const parsedVariants =
      typeof variants === "string"
        ? JSON.parse(variants)
        : variants;

    const images = req.files?.map((file) => file.path) || [];

    const menuItem = await MenuItem.create({
      name,
      description,
      restaurantId,
      categoryId,
      foodType,
      variants: parsedVariants,
      image: images,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.log("Create Menu Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMenuItemsByRestraunt = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = await MenuItem.find({ restaurantId })
      .populate("categoryId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.log("Get Menu Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const menuItem = await MenuItem.findById(menuItemId)
      .populate("categoryId")
      .populate("restaurantId");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.log("Get Single Menu Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const updateData = {
      ...req.body,
    };

    if (req.body.variants) {
      updateData.variants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    if (req.files?.length > 0) {
      updateData.image = req.files.map((file) => file.path);
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      menuItemId,
      updateData,
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      updatedMenuItem,
    });
  } catch (error) {
    console.log("Update Menu Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);

    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.log("Delete Menu Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};