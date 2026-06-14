import Menu from "../Models/menu.model.js";

/**
 * Create Menu
 */
export const createMenu = async (req, res) => {
  try {
    const { name, restaurantId } = req.body;

    const menu = await Menu.create({
      name,
      restaurantId: restaurantId,
    });
    
    return res.status(201).json({
      success: true,
      message: "Menu created successfully",
      menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Menus of Restaurant
 */
export const getMenusByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menus = await Menu.find({
      restaurantId: restaurantId,
    }).sort({ createdAt: -1 });
    
     if(!menus) {
      return res.status(404).json({
        success: false,
        message: "Menus not found!",
      });
    }
    
    return res.status(200).json({
      success: true,
      menus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * Get A Targated Menus of Restaurant
 */
export const getTargatedMenuByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.find({
      _id: id,
    });

    if(!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Menu
 */
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      menu,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Menu
 */
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findByIdAndDelete(id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};