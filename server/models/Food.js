const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        foodId: {
            type: String,
            required: [true, "Mã món ăn là bắt buộc"],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Tên món ăn là bắt buộc"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Loại món ăn là bắt buộc"],
            trim: true,
        },
        cuisine: {
            type: String,
            required: [true, "Ẩm thực hoặc vùng miền là bắt buộc"],
            trim: true,
        },
        ingredients: {
            type: [String],
            required: [true, "Danh sách nguyên liệu là bắt buộc"],
            validate: {
                validator: (items) =>
                    Array.isArray(items) &&
                    items.length > 0 &&
                    items.every((item) => item.trim().length > 0),
                message: "Phải có ít nhất một nguyên liệu",
            },
        },
        price: {
            type: Number,
            required: [true, "Giá bán là bắt buộc"],
            min: [0, "Giá bán không được âm"],
        },
        quantity: {
            type: Number,
            required: [true, "Số lượng là bắt buộc"],
            min: [0, "Số lượng không được âm"],
            validate: {
                validator: Number.isInteger,
                message: "Số lượng phải là số nguyên",
            },
        },
        description: {
            type: String,
            required: [true, "Mô tả là bắt buộc"],
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);