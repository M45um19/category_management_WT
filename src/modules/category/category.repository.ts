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
}