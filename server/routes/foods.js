const express = require("express");
const mongoose = require("mongoose");
const Food = require("../models/Food");

const router = express.Router();
const editableFields = [
    "foodId",
    "name",
    "category",
    "cuisine",
    "ingredients",
    "price",
    "quantity",
    "description",
    "imageUrl",
];

function getFoodFilter(id) {
    return mongoose.isValidObjectId(id) ? { _id: id } : { foodId: id };
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/foods?search=pho
router.get("/", async (req, res, next) => {
    try {
        const search = String(req.query.search || "").trim();
        let filter = {};

        if (search) {
            const keyword = new RegExp(escapeRegex(search), "i");
            filter = {
                $or: [
                    { name: keyword },
                    { category: keyword },
                    { cuisine: keyword },
                ],
            };
        }

        const foods = await Food.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: foods.length,
            foods,
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/foods/:id
router.get("/:id", async (req, res, next) => {
    try {
        const food = await Food.findOne(getFoodFilter(req.params.id));

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy món ăn",
            });
        }

        res.json({ success: true, food });
    } catch (error) {
        next(error);
    }
});

// POST /api/foods
router.post("/", async (req, res, next) => {
    try {
        const food = await Food.create(req.body);

        res.status(201).json({
            success: true,
            message: "Thêm món ăn thành công",
            food,
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/foods/:id
router.put("/:id", async (req, res, next) => {
    try {
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => editableFields.includes(key))
        );

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không có trường hợp lệ để cập nhật",
            });
        }

        const food = await Food.findOneAndUpdate(
            getFoodFilter(req.params.id),
            updates,
            { new: true, runValidators: true }
        );

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy món ăn",
            });
        }

        res.json({
            success: true,
            message: "Cập nhật món ăn thành công",
            food,
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/foods/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const food = await Food.findOneAndDelete(getFoodFilter(req.params.id));

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy món ăn",
            });
        }

        res.json({
            success: true,
            message: "Xóa món ăn thành công",
            food,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;