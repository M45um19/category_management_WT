import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import { CategoryRepository } from "./category.repository";

export class CategoryController {
constructor(private service: CategoryService) {}  
createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await this.service.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  });
}
const repository = new CategoryRepository();
const service = new CategoryService(repository);
export const categoryController = new CategoryController(service);