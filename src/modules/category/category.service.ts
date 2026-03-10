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
        let baseCategory: any;
        let cacheKey: string | null = null;

        if (query.id) {
            cacheKey = `category:${query.id}`;
            const cache = await redis.get(cacheKey);
            if (cache) return JSON.parse(cache);

            baseCategory = await this.repository.findById(new mongoose.Types.ObjectId(query.id));
        } else if (query.name) {
            baseCategory = await this.repository.findByName(query.name);
        }

        if (!baseCategory) {
            throw new Error("Category not found");
        }

        if (!baseCategory.parentId) {
            if (cacheKey) await redis.set(cacheKey, JSON.stringify(baseCategory), "EX", 3600);
            return baseCategory;
        }

        const results = await this.repository.findAllAncestors(baseCategory._id);
        const ancestors = results[0]?.ancestors || [];

        const buildNestedChain = (current: any): any => {
            const doc = current.toObject ? current.toObject() : current;

            const parentDoc = ancestors.find(
                (a: any) => a._id.toString() === doc.parentId?.toString()
            );

            if (!parentDoc) return doc;

            return {
                ...doc,
                parent: buildNestedChain(parentDoc)
            };
        };

        const finalResult = buildNestedChain(baseCategory);

        if (cacheKey) {
            await redis.set(cacheKey, JSON.stringify(finalResult), "EX", 3600);
        }

        return finalResult;
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

    async updateCategory(
        id: string,
        data: CreateCategoryDTO
    ) {
        const categoryId = new mongoose.Types.ObjectId(id);

        const category = await this.repository.findById(categoryId);
        if (!category) throw new Error("Category not found");

        let parentObjectId: mongoose.Types.ObjectId | null = category.parentId;
        let level = category.level;

        if (data.parentId) {
            parentObjectId = new mongoose.Types.ObjectId(data.parentId);

            if (parentObjectId.equals(categoryId))
                throw new Error("Category cannot be its own parent");

            const parent = await this.repository.findById(parentObjectId);
            if (!parent) throw new Error("Parent category not found");
            if (!parent.isActive) throw new Error("Parent category is inactive");

            level = parent.level + 1;
        }
        if (data.parentId === null) {
            level = 1;
            parentObjectId = null;
        }
        const updatedCategory = await this.repository.updateCategory(
            categoryId,
            data.name,
            parentObjectId,
            level
        );

        await redis.del("categories:all");
        await redis.del(`category:${categoryId}`);

        const result = await this.repository.findAllDescendants(categoryId);
        const descendants = result[0]?.descendants || [];
        const descendantKeys = descendants.map((d: any) => `category:${d._id}`);
        if (descendantKeys.length > 0) {
            await redis.del(...descendantKeys);
        }

        return updatedCategory;
    }

    async getChildrens(categoryId: string) {
        const parentObjectId = new mongoose.Types.ObjectId(categoryId);
        const children = await this.repository.findChildren(parentObjectId);
        if (!children) {
            throw new Error("Category not found");
        }
        return children;
    }
}