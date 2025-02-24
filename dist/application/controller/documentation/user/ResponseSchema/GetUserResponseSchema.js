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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserResonseSchema = exports.GetUserResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const UserEnum_1 = require("../../../../../core/common/type/UserEnum");
const BaseResponseSchema_1 = require("../../common/BaseResponseSchema");
class GetUserResponse {
}
exports.GetUserResponse = GetUserResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetUserResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetUserResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetUserResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetUserResponse.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], GetUserResponse.prototype, "createdDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], GetUserResponse.prototype, "updatedDate", void 0);
class GetUserResonseSchema extends BaseResponseSchema_1.BaseResponseSchema {
}
exports.GetUserResonseSchema = GetUserResonseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ type: GetUserResponse }),
    __metadata("design:type", GetUserResponse)
], GetUserResonseSchema.prototype, "data", void 0);
//# sourceMappingURL=GetUserResponseSchema.js.map