import mongoose from "mongoose";
import { Category } from "./category.model";

export class CategoryRepository {

  async findByName(name: string) {
    return Category.findOne({ name });
  }

  async findById(id: mongoose.Types.ObjectId) {
    return Category.findById(id);
  }

  async create(data: any) {
    return Category.create(data);
  }
}