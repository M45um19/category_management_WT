import mongoose from "mongoose";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDTO } from "./category.types";
import { redis } from "../../config/redis";

export class CategoryService {

    constructor(private readonly repository: CategoryRepository) { }
    async createCategory(data: CreateCategoryDTO) {

        const { name, parentId } = data;

        const existing = await this.repository.findByName(name);

        if (existing) {
            throw new Error("Category name must be unique");
        }

        let level = 1;
        let parentObjectId: mongoose.Types.ObjectId | null = null;

        if (parentId) {

            parentObjectId = new mongoose.Types.ObjectId(parentId);

            const parent = await this.repository.findById(parentObjectId);

            if (!parent) {
                throw new Error("Parent category not found");
            }

            if (!parent.isActive) {
                throw new Error("Parent category is inactive");
            }


            level = parent.level + 1;
        }

        const category = await this.repository.create({
            name,
            parentId: parentObjectId,
            level,
        });

        await redis.del("categories:all");

        return category;
    }
}