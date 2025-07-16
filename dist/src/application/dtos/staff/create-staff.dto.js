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
exports.CreateStaffDto = exports.StaffPermissionsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_user_dto_1 = require("../user/create-user.dto");
class StaffPermissionsDto {
    constructor() {
        this.canEditItems = false;
        this.canViewReports = false;
        this.canManageStock = false;
        this.canManageCustomers = false;
        this.canManageTransactions = false;
        this.canManageDebt = false;
    }
}
exports.StaffPermissionsDto = StaffPermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Can edit items', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffPermissionsDto.prototype, "canEditItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Can view reports', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffPermissionsDto.prototype, "canViewReports", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Can manage stock', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffPermissionsDto.prototype, "canManageStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Can manage customers', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffPermissionsDto.prototype, "canManageCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Can manage transactions', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffPermissionsDto.prototype, "canManageTransactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Can manage debt', default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], StaffPermissionsDto.prototype, "canManageDebt", void 0);
class CreateStaffDto {
}
exports.CreateStaffDto = CreateStaffDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The full name of the staff member',
        example: 'John Smith',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff phone number',
        example: '+1234567890',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(null, { message: 'Please provide a valid phone number' }),
    __metadata("design:type", String)
], CreateStaffDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff permissions',
        type: StaffPermissionsDto,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => StaffPermissionsDto),
    __metadata("design:type", StaffPermissionsDto)
], CreateStaffDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Related user ID if already created',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateStaffDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User information for new staff member if user does not exist yet',
        type: create_user_dto_1.CreateUserDto,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_user_dto_1.CreateUserDto),
    __metadata("design:type", create_user_dto_1.CreateUserDto)
], CreateStaffDto.prototype, "user", void 0);
//# sourceMappingURL=create-staff.dto.js.map