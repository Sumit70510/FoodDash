import Category from "../Models/food.category.model.js";

export const createCategory = async (req,res) => {
  try {
    const {name,restaurantId,menuId} = req.body;

    if (
      !name ||
      !restaurantId ||
      !menuId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    const existingCategory =
      await Category.findOne({
        name,
        restaurantId,
      });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Category already exists",
      });
    }

    const category = await Category.create(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category,
    });
    
   }catch (error) {
    console.log(
      "Create Category Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

export const getCategoriesByRestaurant = async (req, res) => {
    try {
      const { restaurantId } =
        req.params;

      const categories =
        await Category.find({
          restaurantId,
        })
          .populate("menuId")
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.log(
        "Get Categories Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  }; 
  
export const getCategoriesByMenuId = async (req, res) => {
    try {
      const { menuId } =
        req.params;

      const categories = await Category.find({
          menuId,}).sort({createdAt: -1});
    
      if(!categories)
       {
        return res.status(401).json({
          success: false,
          message: "No Categories Available for this Menu",
        });
       }    
      return res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.log("Get Categories Error:",error);
      return res.status(500).json({
        success: false,
        message:"Internal Server Error",
      });
    }
  };

export const getSingleCategory = async (req, res) => {
    try {
      const { categoryId } =
        req.params;

      const category =
        await Category.findById(
          categoryId
        )
          .populate("menuId")
          .populate(
            "restaurantId"
          );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.log(
        "Get Category Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Internal Server Error", });
    }
  };

export const updateCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const {name , menuId ,description } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body , { new: true } );

      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message:"Category not found/Updated",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Category updated successfully",
        category : updateCategory,
      });
     } 
    catch (error) {
      console.log("Update Category Error:",error);
      return res.status(500).json({
        success: false,
        message:"Internal Server Error"});
     }
  };

export const deleteCategory =
  async (req, res) => {
    try {
      const { categoryId } =
        req.params;

      const category =
        await Category.findByIdAndDelete(
          categoryId
        );

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      console.log(
        "Delete Category Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };