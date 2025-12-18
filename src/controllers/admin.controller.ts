import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";

export async function getAllProduct(req: Request, res: Response) {
    try {
        const products = await Product.find().sort({createdAt: -1})
        return res.status(200).json({
            message: "Get all products successfully.",
            products
        })
    } catch (error) {
        console.error("Failed fetching products:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { name, description, stock, price, category } = req.body;

        if(!name || !description || !stock || !price || !category) {
            return res.status(400).json({ message: "All fields are required." })
        }

        if(!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: "At least One image required." })
        }

        // Explicit type check for req.files as Array
        if (Array.isArray(req.files) && req.files.length > 3) {
            return res.status(400).json({ message: "Maximum 3 images allowed." })
        }

        const uploadPromises = req.files.map((file: any) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products"
            });
        });

        const uploadResult = await Promise.all(uploadPromises);

        const imageUrls = uploadResult.map((result) => result.secure_url)

        const product = await Product.create({
            name, 
            description, 
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls
        })
        return res.status(200).json({
            message: "Created product successfully.",
            product
        })
    } catch (error) {
        console.error("Failed creating product:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function updateProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, description, stock, price, category } = req.body;

        const product = await Product.findById(id);

        if(!product) {
            return res.status(404).json({message: "Product not found."})
        }

        if(name) product.name = name;
        if(description) product.description = description;
        if(stock !== undefined) product.stock = parseInt(stock);
        if(price) product.price = parseFloat(price);
        if(category) product.category = category

        if(Array.isArray(req.files) && req.files.length > 3) {
            return res.status(400).json({message: "Maximum 3 images allowed."})
        }

        const uploadPromises = req.files && Array.isArray(req.files) && req.files?.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products"
            });
        })

        if(uploadPromises) {
            const uploadResult = await Promise.all(uploadPromises);
            product.images = uploadResult.map((result) => result.secure_url);
        }

        await product.save();
        return res.status(200).json({
            message: "Updated product successfully.",
            product
        })
    } catch (error) {
        console.error("Failed updating product:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await Order.find()
                        .populate("user", "name email")
                        .populate("orderItems.product")
                        

    return res.status(200).json({
        message: "Get orders successfully.",
        orders
    })
    } catch (error) {
        console.error("Failed fetching orders:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function updateOrderStatus(req: Request, res: Response) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if(!["pending", "shipped", "delivered"].includes(status)){
            return res.status(400).json({message: "Invalid status."})
        }

        const order = await Order.findById(orderId);
        if(!order) {
            return res.status(404).json({message: "Order not found."})
        }

        order.status = status;
        if(status === 'shipped' && !order.shippedAt) {
            order.shippedAt = new Date();
        }

        if(status === 'delivered' && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        await order.save();

        return res.status(200).json({
            message: "Updated order status successfully.",
            order
        })
    } catch (error) {
        console.error("Failed updating order status:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function getAllCustomers(req: Request, res: Response) {
    try {
        const customers = await User.find().sort({createdAt: -1});
        return res.status(200).json({
            message: "Get customers successfully.",
            customers
        })
    } catch (error) {
        console.error("Failed getting customers:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function getDashboardStats(req: Request, res: Response) {
    try {
        const totalOrders = await Order.countDocuments();
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        return res.status(200).json({
            message: "Get dashboard stats successfully.",
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts
        })
    } catch (error) {
        console.error("Failed getting dashboard stats:", error)
        res.status(500).json({ message: "Internal server error." })
    }
}