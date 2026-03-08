import mongoose from "mongoose";
import { Category } from "./category.model";

export class CategoryRepository {

  async findByName(name: string) {
    return Category.findOne({ name });
  }

  async findById(id: mongoose.Types.ObjectId) {
    return Category.findById(id);
  }

  async searchByName(name: string) {
    return Category.find({
      name: {
        $regex: name,
        $options: "i"
      },
      isActive: true
    }).lean();
  }

  async findAll() {
    return Category.find({ isActive: true }).lean();
  }

  async create(data: any) {
    return Category.create(data);
  }

  async findChildren(parentId: mongoose.Types.ObjectId) {
    return Category.find({ parentId });
  }

  async updateStatus(id: mongoose.Types.ObjectId, isActive: boolean) {
    return Category.findByIdAndUpdate(id, { isActive }, { new: true });
  }
  
  async deleteCategory(id: mongoose.Types.ObjectId) {
    return Category.findByIdAndDelete(id);
  }
}