import express from 'express';
import dotenv from 'dotenv';
import mongoDB from './db.js';
import createUser from './Routes/CreateUser.js';
import displayData from './Routes/DisplayData.js';
import orderData from './Routes/OrderData.js';

const app = express();
const port = 4000;

dotenv.config();
mongoDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use('/api', createUser);
app.use('/api', displayData);
app.use('/api', orderData);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});