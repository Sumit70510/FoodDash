import Menu from "../Models/menu.model.js";

export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      restaurant,
      sizes,
      isVeg,
    } = req.body;

    if (
      !name ||
      !category ||
      !restaurant ||
      !sizes ||
      sizes.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const menuItem = await Menu.create({
      name,
      description,
      category,
      restaurant,
      sizes,
      isVeg,
      image: req.file?.path || "",
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created",
      menuItem,
    });
  } catch (error) {
    console.log("Create Menu Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menu = await Menu.find({
      restaurant: restaurantId,
    })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      menu,
    });
  } catch (error) {
    console.log("Get Menu Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menuItem = await Menu.findById(menuId).populate("category");

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
    console.log("Get Single Menu Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        ...req.body,
        ...(req.file && { image: req.file.path }),
      },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      updatedMenu,
    });
  } catch (error) {
    console.log("Update Menu Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;

    const deletedMenu = await Menu.findByIdAndDelete(menuId);

    if (!deletedMenu) {
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
    console.log("Delete Menu Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};