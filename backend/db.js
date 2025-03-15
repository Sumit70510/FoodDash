const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://sv3013645:esdU4lmsDXz4cfif@cluster0.phh7e.mongodb.net/FoodDashMERN?retryWrites=true&w=majority&appName=Cluster0';

// const mongoDB=async()=>{
//     await mongoose.connect(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true}).then(
//         ()=>{
//         console.log('Connected to MongoDB Succesfully');
//         }
//   );
// }

const mongoDB = ()=> {
    mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(
        //     async () => {
        //     console.log("Connected to MongoDB Succesfully");
        //     try {
        //      const fetched_data = mongoose.connection.db.collection('food_items');
        //      const data= await fetched_data.find({}).toArray();
        //      console.log("Fetched data",data);
        //     }
        //     catch(error)
        //      {
        //         console.error("error fetching data",error);
        //      }
        //   }
           ()=>
            {
              console.log("Connected Succesfully");
              const fetched_data=mongoose.connection.db.collection('food_items');
              fetched_data.find({}).toArray().then(
                (data)=>
                {
                  const foodCategory=mongoose.connection.db.collection('foodCategory');
                  foodCategory.find({}).toArray().then(
                     (CatData)=>{
                      global.food_items=data;
                      global.foodCategory=CatData;
                     }
                  )
                  .catch((error)=>{
                    console.error("Error fetching Category Data : ",error);
                  })
                }
              ).catch(
                (error)=>{
                 console.error("Error fetching data : ",error);     
                }
              ) 
            }
        )
        .catch((error) => {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        });
};
module.exports = mongoDB;
