import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware";
import { createCategorySchema } from "./category.types";
import { CategoryModule } from "./category.module";

const router = Router();
const controller = CategoryModule.controller;
router.post(
  "/",
  validateBody(createCategorySchema),
  controller.createCategory
);

router.get("/", controller.getAllCategories);
router.get("/search", controller.getCategory);
router.get("/:id", controller.getCategory);
router.patch("/:id/status", controller.updateCategoryStatus);
router.delete("/:id", controller.deleteCategory);
router.put("/:id", validateBody(createCategorySchema), controller.updateCategory)
export default router;