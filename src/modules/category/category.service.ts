import mongoose from "mongoose";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDTO } from "./category.types";
import { redis } from "../../config/redis";
import { AbstractCategoryRepository, AbstractCategoryService } from "./category.abstract";

export class CategoryService extends AbstractCategoryService {

    constructor(private readonly repository: AbstractCategoryRepository) {
        super();
    }
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

    async getAllCategories() {
        const cache = await redis.get("categories:all");
        if (cache) {
            return JSON.parse(cache);

        }

        const categories = await this.repository.findAll();
        await redis.set("categories:all", JSON.stringify(categories), "EX", 3600);
        return categories;
    }


    async getCategory(query: { id?: string; name?: string }) {
        let categoryData: any;
        let cacheKey: string | null = null;

        if (query.id) {
            cacheKey = `category:${query.id}`;
            const cache = await redis.get(cacheKey);
            if (cache) return JSON.parse(cache);

            categoryData = await this.repository.findById(
                new mongoose.Types.ObjectId(query.id)
            );
        } else if (query.name) {

            categoryData = await this.repository.searchByName(query.name);
        }

        if (!categoryData || (Array.isArray(categoryData) && categoryData.length === 0)) {
            throw new Error("Category not found");
        }
        const buildParentChain = async (cat: any): Promise<any> => {
            const catObj = cat.toObject ? cat.toObject() : cat;

            if (!catObj.parentId) return catObj;

            const parent = await this.repository.findById(catObj.parentId);
            if (!parent) return catObj;

            return {
                ...catObj,
                parent: await buildParentChain(parent),
            };
        };

        let result;
        if (Array.isArray(categoryData)) {
            result = await Promise.all(
                categoryData.map((cat) => buildParentChain(cat))
            );
        } else {
            result = await buildParentChain(categoryData);
        }
        if (cacheKey && result) {
            await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
        }

        return result;
    }


    async updateCategoryStatus(id: string, isActive: boolean) {

        const parentId = new mongoose.Types.ObjectId(id);

        const category = await this.repository.findById(parentId);

        if (!category) {
            throw new Error("Category not found");
        }

        const result = await this.repository.findAllDescendants(parentId);

        const descendants = result[0]?.descendants || [];

        const ids = [
            parentId,
            ...descendants.map((d: any) => d._id)
        ];

        await this.repository.updateMany(ids, isActive);

        await redis.del("categories:all");

        const cacheKeys = ids.map(id => `category:${id}`);
        await redis.del(...cacheKeys);

    }

    async deleteCategory(id: string) {

        const parentId = new mongoose.Types.ObjectId(id);

        const category = await this.repository.findById(parentId);

        if (!category) {
            throw new Error("Category not found");
        }
        const result = await this.repository.findAllDescendants(parentId);

        const descendants = result[0]?.descendants || [];

        const ids = [
            parentId,
            ...descendants.map((d: any) => d._id)
        ];

        await this.repository.deleteMany(ids);

        await redis.del("categories:all");

        const cacheKeys = ids.map(id => `category:${id}`);
        await redis.del(...cacheKeys);

    }
}