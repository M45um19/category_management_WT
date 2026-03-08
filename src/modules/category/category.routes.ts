import { Router } from "express";
import { categoryController, CategoryController } from "./category.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import { createCategorySchema } from "./category.types";

const router = Router();
const controller = categoryController

router.post(
  "/",
  validateBody(createCategorySchema),
  controller.createCategory
);

export default router;