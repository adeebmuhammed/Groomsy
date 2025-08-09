import { Model, Document, ObjectId, FilterQuery } from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }
  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }
  async findOne(condition: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(condition).exec();
  }
  async find(condition: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(condition).exec();
  }
  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }
  async countDocuments(condition: FilterQuery<T> = {}): Promise<number> {
  return await this.model.countDocuments(condition).exec();
}

  async findWithPagination(
    condition: FilterQuery<T> = {},
    skip: number,
    limit: number
  ): Promise<T[]> {
    return await this.model.find(condition).skip(skip).limit(limit).exec();
  }
}