const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/AuthRoutes");
require('dotenv').config(); // To use environment variables from a .env file

const app = express();
const port = process.env.PORT || 5050;

const MONGO_URI = "mongodb+srv://shrikant:shrikant@cluster0.ueg1rdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected Successfully");
})
.catch((err) => {
    console.error(err);
});

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://tmslevents.netlify.app"], // Allow specific origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(cookieParser());

app.use("/", authRoute);

// General error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
