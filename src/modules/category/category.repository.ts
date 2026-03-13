import mongoose from "mongoose";
import { Category } from "./category.model";
import { AbstractCategoryRepository } from "./category.abstract";

export class CategoryRepository extends AbstractCategoryRepository {

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
    return Category.find().lean();
  }

  async create(data: any) {
    return Category.create(data);
  }

  async findChildren(parentId: mongoose.Types.ObjectId) {
    return Category.find({ parentId, isActive: true });
  }

  async updateStatus(id: mongoose.Types.ObjectId, isActive: boolean) {
    return Category.findByIdAndUpdate(id, { isActive }, { new: true });
  }

  async deleteCategory(id: mongoose.Types.ObjectId) {
    return Category.findByIdAndDelete(id);
  }

  async findAllDescendants(parentId: mongoose.Types.ObjectId) {
    return Category.aggregate([
      {
        $match: { _id: parentId }
      },
      {
        $graphLookup: {
          from: "categories",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "descendants"
        }
      }
    ]);
  }

  async updateMany(ids: mongoose.Types.ObjectId[], isActive: boolean) {
    return Category.updateMany(
      { _id: { $in: ids } },
      { $set: { isActive } }
    );
  }

  async deleteMany(ids: mongoose.Types.ObjectId[]) {
    return Category.deleteMany({
      _id: { $in: ids }
    });
  }

  async updateCategory(
    categoryId: mongoose.Types.ObjectId,
    name: string,
    parentId?: mongoose.Types.ObjectId | null,
    level?: number
  ) {
    return Category.findByIdAndUpdate(
      categoryId,
      { name, parentId, level },
      { new: true }
    );
  }
  async findAllAncestors(categoryId: mongoose.Types.ObjectId) {
    return Category.aggregate([
      {
        $match: { _id: categoryId }
      },
      {
        $graphLookup: {
          from: "categories",
          startWith: "$parentId",
          connectFromField: "parentId",
          connectToField: "_id",
          as: "ancestors"
        }
      }
    ]);
  }

async updateDescendantsLevel(
  parentId: mongoose.Types.ObjectId,
  levelDiff: number
) {

  const result = await Category.aggregate([
    {
      $match: { _id: parentId }
    },
    {
      $graphLookup: {
        from: "categories",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentId",
        as: "descendants"
      }
    }
  ]);

  const descendants = result[0]?.descendants || [];

  if (descendants.length === 0) return;

  const ids = descendants.map((d: any) => new mongoose.Types.ObjectId(d._id));
  return Category.updateMany(
    { _id: { $in: ids } },
    { $inc: { level: levelDiff } }
  );
}
}