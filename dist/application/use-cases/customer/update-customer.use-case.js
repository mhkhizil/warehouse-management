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
var UpdateCustomerUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
let UpdateCustomerUseCase = UpdateCustomerUseCase_1 = class UpdateCustomerUseCase {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
        this.logger = new common_1.Logger(UpdateCustomerUseCase_1.name);
    }
    async execute(id, updateCustomerDto) {
        this.logger.log(`Updating customer with ID: ${id}`);
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            this.logger.warn(`Customer with ID ${id} not found`);
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
            const existingCustomerWithEmail = await this.customerRepository.findByEmail(updateCustomerDto.email);
            if (existingCustomerWithEmail && existingCustomerWithEmail.id !== id) {
                this.logger.warn(`Email ${updateCustomerDto.email} already in use by another customer`);
                throw new common_1.BadRequestException(`Email ${updateCustomerDto.email} already in use by another customer`);
            }
        }
        if (updateCustomerDto.phone && updateCustomerDto.phone !== customer.phone) {
            const existingCustomerWithPhone = await this.customerRepository.findByPhone(updateCustomerDto.phone);
            if (existingCustomerWithPhone && existingCustomerWithPhone.id !== id) {
                this.logger.warn(`Phone ${updateCustomerDto.phone} already in use by another customer`);
                throw new common_1.BadRequestException(`Phone ${updateCustomerDto.phone} already in use by another customer`);
            }
        }
        const updatedCustomer = await this.customerRepository.update(id, updateCustomerDto);
        this.logger.log(`Customer with ID ${id} updated successfully`);
        return updatedCustomer;
    }
};
exports.UpdateCustomerUseCase = UpdateCustomerUseCase;
exports.UpdateCustomerUseCase = UpdateCustomerUseCase = UpdateCustomerUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], UpdateCustomerUseCase);
//# sourceMappingURL=update-customer.use-case.js.map