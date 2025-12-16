import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
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
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: ""
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    address: [AddressSchema],
    wishlist: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        }
    ],
}, {
    timestamps: true
})

export const User = mongoose.model("User", UserSchema)