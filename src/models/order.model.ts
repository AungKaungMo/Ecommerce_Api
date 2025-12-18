import mongoose from "mongoose";

const ShippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    }
})

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    }
})

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
        type: ShippingAddressSchema,
        required: true
    },
    paymentResult: {
        id: String,
        status: String
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending"
    },
    deliveredAt: {
        type: Date,
    },
    shippedAt: {
        type: Date,
    },
}, {
    timestamps: true
})

export const Order = mongoose.model("Order", OrderSchema)