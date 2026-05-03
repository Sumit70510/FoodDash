import mongoose from 'mongoose';

const mongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    await mongoose.connect(mongoURI);
    console.log("Connected Successfully");

    const fetchedData = mongoose.connection.db.collection('food_items');
    const data = await fetchedData.find({}).toArray();

    const foodCategory = mongoose.connection.db.collection('foodCategory');
    const catData = await foodCategory.find({}).toArray();

    global.food_items = data;
    global.foodCategory = catData;
  } catch (error) {
    console.error("MongoDB connection or fetch error:", error);
    process.exit(1);
  }
};

export default mongoDB;