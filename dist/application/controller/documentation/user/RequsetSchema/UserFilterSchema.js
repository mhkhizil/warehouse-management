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
exports.UserFilterSchama = void 0;
const swagger_1 = require("@nestjs/swagger");
const BaseFilterSchema_1 = require("../../common/BaseFilterSchema");
const UserEnum_1 = require("../../../../../core/common/type/UserEnum");
const UserFilter_1 = require("../../../../../core/domain/user/dto/UserFilter");
class UserFilterSchama extends BaseFilterSchema_1.BaseFilterSchema {
}
exports.UserFilterSchama = UserFilterSchama;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserFilterSchama.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserFilterSchama.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UserFilterSchama.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, swagger_1.ApiProperty)({
        enum: UserEnum_1.UserRole,
        enumName: 'UserRole',
    }),
    __metadata("design:type", String)
], UserFilterSchama.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: UserFilter_1.UserSortBy,
        enumName: 'UserSortBy',
        description: 'Field to sort by',
    }),
    __metadata("design:type", String)
], UserFilterSchama.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: UserFilter_1.SortOrder,
        enumName: 'SortOrder',
        description: 'Sort direction (asc or desc)',
    }),
    __metadata("design:type", String)
], UserFilterSchama.prototype, "sortOrder", void 0);
//# sourceMappingURL=UserFilterSchema.js.map