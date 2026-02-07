// const express = require("express");
// const authRouter = require("./routes/authRoutes");
// const dotenv = require("dotenv");
// const Mongoose = require("mongoose");
// dotenv.config();

// const app = express();
// app.use(express.json());

// // Routes
// app.use("/api", authRouter.router);

// async function main() {
//   try {
//     await Mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB practical-test");
//   } catch (error) {
//     console.log(error);
//   }
// }
// main().catch((err) => console.log(err)) ;

// // Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express=require("express")
const authRouter=require('./routes/authRoutes')
const mongoose  = require("mongoose")
require("dotenv").config()

const app=express()
app.use(express.json())

app.use('/api',authRouter.router)

async function main(){
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
}main().catch((err)=>{console.log(err);})

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
  console.log(`server running on ${PORT}`);
})