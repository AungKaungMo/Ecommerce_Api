import { getAuth, requireAuth } from "@clerk/express";
import { ENV } from "../config/env";
import { User } from "../models/user.model";
import { NextFunction, Request, Response } from "express";


export const protectRoute = [
    requireAuth(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth = getAuth(req);
            const clerkId = auth.userId;
            if(!clerkId) return res.status(401).json({ message: "Unauthorized." });

            const user = await User.findOne({ clerkId })
            if(!user) return res.status(404).json({ message: "User not found." });

            req.user = user;
            next()
        } catch (error) {
            console.error("Error found in middleware.",error);
            res.status(500).json({message: "Internal server error."})
        }
    }
]

export const adminOnly = async(req: Request, res: Response, next: NextFunction) => {

    if(!req.user) {
        return res.status(401).json({ message: "User not found" })
    }

    if(req.user.email !== ENV.ADMIN_EMAIL) {
        return res.status(403).json({message: "Forbidden (admin only access)"})
    }
}