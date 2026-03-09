import mongoose from "mongoose";
import { CreateCategoryDTO } from "./category.types";

export abstract class AbstractCategoryRepository {
    abstract findByName(name: string): Promise<any>;

    abstract findById(id: mongoose.Types.ObjectId): Promise<any>;

    abstract searchByName(name: string): Promise<any>;

    abstract findAll(): Promise<any>;

    abstract create(data: any): Promise<any>;

    abstract findChildren(parentId: mongoose.Types.ObjectId): Promise<any>;

    abstract updateStatus(
        id: mongoose.Types.ObjectId,
        isActive: boolean
    ): Promise<any>;

    abstract deleteCategory(id: mongoose.Types.ObjectId): Promise<any>;

    abstract findAllDescendants(parentId: mongoose.Types.ObjectId): Promise<any>;
    abstract updateMany(
        ids: mongoose.Types.ObjectId[],
        isActive: boolean
    ): Promise<any>;

    abstract deleteMany(
        ids: mongoose.Types.ObjectId[]
    ): Promise<mongoose.DeleteResult>;

    abstract updateCategory(categoyrId: mongoose.Types.ObjectId, name: string, parentId?: mongoose.Types.ObjectId | null, level?: number): Promise<any>
}


export abstract class AbstractCategoryService {
    abstract createCategory(data: CreateCategoryDTO): Promise<any>;

    abstract getAllCategories(): Promise<any>;

    abstract getCategory(query: { id?: string; name?: string }): Promise<any>;

    abstract updateCategoryStatus(id: string, isActive: boolean): Promise<void>;

    abstract deleteCategory(id: string): Promise<void>;

    abstract updateCategory(id: string, data: CreateCategoryDTO): Promise<any>;
}