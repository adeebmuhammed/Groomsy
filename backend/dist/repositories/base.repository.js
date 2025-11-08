"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async findById(id) {
        return await this.model.findById(id);
    }
    async findOne(condition) {
        return await this.model.findOne(condition).exec();
    }
    async find(condition = {}) {
        return await this.model.find(condition).exec();
    }
    async update(id, updateData) {
        return await this.model.findByIdAndUpdate(id, updateData, {
            new: true,
        });
    }
    async countDocuments(condition = {}) {
        return await this.model.countDocuments(condition).exec();
    }
    async findWithPagination(condition = {}, skip, limit) {
        return await this.model.find(condition).skip(skip).limit(limit).exec();
    }
}
exports.BaseRepository = BaseRepository;
