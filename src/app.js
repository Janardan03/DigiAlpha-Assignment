const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/roles", require("./routes/roleRoutes"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
});

module.exports = app;