require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const foodRoutes = require("./routes/foods");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("bufferCommands", false);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
    const connected = mongoose.connection.readyState === 1;

    res.status(connected ? 200 : 503).json({
        status: connected ? "ok" : "database_unavailable",
        database: connected ? "connected" : "disconnected",
        uptimeSeconds: Math.floor(process.uptime()),
    });
});

app.use("/api/foods", (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Cơ sở dữ liệu chưa kết nối",
        });
    }

    next();
});

app.use("/api/foods", foodRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint không tồn tại",
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Mã món ăn foodId đã tồn tại",
        });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: Object.values(error.errors).map((item) => item.message),
        });
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "ID món ăn không hợp lệ",
        });
    }

    if (error instanceof SyntaxError && "body" in error) {
        return res.status(400).json({
            success: false,
            message: "JSON gửi lên không hợp lệ",
        });
    }

    res.status(500).json({
        success: false,
        message: "Lỗi máy chủ hoặc kết nối cơ sở dữ liệu",
    });
});

if (!MONGODB_URI) {
    console.error("Thiếu biến môi trường MONGODB_URI trong server/.env");
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Backend đang chạy tại http://localhost:${PORT}`);
});

mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log("Đã kết nối MongoDB Atlas"))
    .catch((error) => console.error("Không kết nối được MongoDB:", error.message));

mongoose.connection.on("disconnected", () => {
    console.error("MongoDB Atlas đã ngắt kết nối");
});