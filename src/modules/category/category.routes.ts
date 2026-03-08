import { Router } from "express";
import { categoryController } from "./category.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import { createCategorySchema } from "./category.types";

const router = Router();

router.post(
  "/",
  validateBody(createCategorySchema),
  categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);
router.get("/search", categoryController.getCategory);
router.get("/:id", categoryController.getCategory);
export default router;