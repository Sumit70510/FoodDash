import express from 'express';

const router = express.Router();

router.post('/FoodData', (req, res) => {
  try {
    res.send([global.food_items, global.foodCategory]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;