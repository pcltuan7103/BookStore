import express from "express";
import cloudinary from "../lib/cloudinary.js";
import protectRoutes from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";

const router = express.Router();

router.post("/", protectRoutes, async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;

        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        //Upload image
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        //Save book
        const newBook = await Book.create({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/user", protectRoutes, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protectRoutes, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        //Check if user is the owner of the book
        if (deletedBook.user.toString() !== req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        //Delete image from cloudinary
        if(deletedBook.image && deletedBook.image.includes("cloudinary")) {
            try {
                const publicId = deletedBook.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error(error);
            }
        }

        await deletedBook.remove();

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default router;