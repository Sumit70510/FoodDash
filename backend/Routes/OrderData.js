import express from 'express';
import order from '../models/Orders.js';

const router = express.Router();

router.post('/OrderData', async (req, res) => {
  let data = req.body.order_data;
  data.splice(0, 0, { order_date: req.body.order_date });

  let eID = await order.findOne({ email: req.body.email });
  console.log(eID);

  if (eID === null) {
    try {
      await order.create({
        email: req.body.email,
        order_data: [data]
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  } else {
    try {
      await order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
});

router.post('/myOrderData', async (req, res) => {
  try {
    let myData = await order.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

export default router;