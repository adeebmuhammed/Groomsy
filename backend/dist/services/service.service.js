"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const inversify_1 = require("inversify");
const service_mapper_1 = require("../mappers/service.mapper");
const types_1 = require("../config/types");
let ServiceService = class ServiceService {
    constructor(_serviceRepo) {
        this._serviceRepo = _serviceRepo;
        this.fetch = async (search, page, limit) => {
            const { services, totalCount } = await this._serviceRepo.findAllServices(search, page, limit);
            const response = {
                data: service_mapper_1.ServiceMapper.toServiceDtoArray(services),
                message: "services fetched successfully",
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            };
            return {
                response,
            };
        };
        this.create = async (data) => {
            if (!data.name || !data.description || !data.duration || !data.price) {
                throw new Error("Required field : Name, Description, Duration and Price");
            }
            const existinng = await this._serviceRepo.findOne({ name: data.name });
            if (existinng) {
                throw new Error("service with the same name exists");
            }
            const duration = ["15m", "30m", "45m", "60m", "75m", "90m", "105m", "120m"];
            if (!duration.includes(data.duration)) {
                throw new Error("invalid duration type");
            }
            const newService = await this._serviceRepo.create(data);
            if (!newService) {
                throw new Error("service creation failed");
            }
            return {
                response: { message: "service created successfully" }
            };
        };
        this.edit = async (serviceId, data) => {
            if (!data.name || !data.description || !data.duration || !data.price) {
                throw new Error("Required field : Name, Description, Duration and Price");
            }
            const existinng = await this._serviceRepo.findById(serviceId);
            if (!existinng) {
                throw new Error("service not found");
            }
            const duration = ["15m", "30m", "45m", "60m", "75m", "90m", "105m", "120m"];
            if (!duration.includes(data.duration)) {
                throw new Error("invalid duration type");
            }
            const updated = await this._serviceRepo.update(serviceId, data);
            if (!updated) {
                throw new Error("service editing failed");
            }
            return {
                response: { message: "service edited successfully" },
            };
        };
        this.delete = async (serviceId) => {
            const service = await this._serviceRepo.findById(serviceId);
            if (!service) {
                throw new Error("service not found");
            }
            const deleted = await this._serviceRepo.deleteService(serviceId);
            if (!deleted) {
                throw new Error("deleting service failed");
            }
            return {
                response: { message: "service deleted succefully" }
            };
        };
        this.getServiceById = async (serviceId) => {
            const service = await this._serviceRepo.findById(serviceId);
            if (!service) {
                throw new Error("service not found");
            }
            return {
                response: service_mapper_1.ServiceMapper.toServiceResponse(service)
            };
        };
    }
};
exports.ServiceService = ServiceService;
exports.ServiceService = ServiceService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IServiceRepository)),
    __metadata("design:paramtypes", [Object])
], ServiceService);
