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
exports.CustomerListResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const BaseResponseSchema_1 = require("../../common/BaseResponseSchema");
const customer_response_dto_1 = require("../../../../dtos/customer/customer-response.dto");
class CustomerListData {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [customer_response_dto_1.CustomerResponseDto] }),
    __metadata("design:type", Array)
], CustomerListData.prototype, "customers", void 0);
class CustomerListResponseSchema extends BaseResponseSchema_1.BaseResponseSchema {
    constructor(customers) {
        super();
        this.message = 'Customers retrieved successfully';
        this.code = 200;
        this.data = { customers };
    }
}
exports.CustomerListResponseSchema = CustomerListResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ type: CustomerListData }),
    __metadata("design:type", CustomerListData)
], CustomerListResponseSchema.prototype, "data", void 0);
//# sourceMappingURL=CustomerListResponseSchema.js.map