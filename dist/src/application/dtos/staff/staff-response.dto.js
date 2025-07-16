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
exports.StaffResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_response_dto_1 = require("../user/user-response.dto");
class StaffResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new user_response_dto_1.UserResponseDto(partial.user);
        }
    }
}
exports.StaffResponseDto = StaffResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Staff ID', example: 1 }),
    __metadata("design:type", Number)
], StaffResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID', example: 1 }),
    __metadata("design:type", Number)
], StaffResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, class_transformer_1.Type)(() => user_response_dto_1.UserResponseDto),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], StaffResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name', example: 'John Smith' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', example: '+1234567890' }),
    __metadata("design:type", String)
], StaffResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff permissions',
        example: {
            canEditItems: true,
            canViewReports: true,
            canManageStock: true,
        },
    }),
    __metadata("design:type", Object)
], StaffResponseDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], StaffResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=staff-response.dto.js.map