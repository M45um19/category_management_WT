import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import { CategoryRepository } from "./category.repository";


export class CategoryController {
    constructor(private service: CategoryService) { }
    createCategory = catchAsync(async (req: Request, res: Response) => {
        const category = await this.service.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    });

    getAllCategories = catchAsync(async (req: Request, res: Response) => {
        const categories = await this.service.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    });


    getCategory = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.query;

        const category = await this.service.getCategory({
            id: id as string,
            name: name as string,
        });

        res.status(200).json({ success: true, data: category });
    });;

    updateCategoryStatus = catchAsync(async (req: Request, res: Response) => {

        const { id } = req.params;
        const { isActive } = req.body;

        await this.service.updateCategoryStatus(id as string, isActive);

        res.status(200).json({
            success: true,
            message: "Category and all the descendants status updated",
        });
    });

    deleteCategory = catchAsync(async (req: Request, res: Response) => {
        const {id} = req.params;

        await this.service.deleteCategory(id as string);

        res.status(200).json({
            success: true,
            message: "Category and all the descendants status deleted"
        })
    });
}
const repository = new CategoryRepository();
const service = new CategoryService(repository);
export const categoryController = new CategoryController(service);