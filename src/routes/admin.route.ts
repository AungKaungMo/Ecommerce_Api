import { Router } from "express";
import { adminOnly, protectRoute } from "../middlewares/auth.middleware";
import { createProduct, getAllCustomers, getAllOrders, getAllProduct, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.use(protectRoute, adminOnly);

router.get("/products", upload.array("images", 3), getAllProduct);
router.post("/products", createProduct);
router.put("/products/:id",upload.array("images", 3), updateProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:userId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);
export default router;