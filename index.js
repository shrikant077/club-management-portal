const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoutes");

const app = express();
const port = process.env.PORT || 5050;

const MONGO_URI = "mongodb+srv://shrikant:shrikant@cluster0.ueg1rdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI).then(() => {
    console.log("MongoDB connected Successfully");
}).catch((err) => {
    console.error(err);
})

const corsOptions = {
  origin: 'https://tmslevents.netlify.app',
  credentials: true, // This is required to allow cookies or HTTP authentication
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/", authRoute);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
