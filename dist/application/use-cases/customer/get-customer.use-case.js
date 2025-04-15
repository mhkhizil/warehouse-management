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
var GetCustomerUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
let GetCustomerUseCase = GetCustomerUseCase_1 = class GetCustomerUseCase {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
        this.logger = new common_1.Logger(GetCustomerUseCase_1.name);
    }
    async execute(id) {
        this.logger.log(`Fetching customer with ID: ${id}`);
        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            this.logger.warn(`Customer with ID ${id} not found`);
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async findByEmail(email) {
        this.logger.log(`Fetching customer with email: ${email}`);
        const customer = await this.customerRepository.findByEmail(email);
        if (!customer) {
            this.logger.warn(`Customer with email ${email} not found`);
            throw new common_1.NotFoundException(`Customer with email ${email} not found`);
        }
        return customer;
    }
    async findByPhone(phone) {
        this.logger.log(`Fetching customer with phone: ${phone}`);
        const customer = await this.customerRepository.findByPhone(phone);
        if (!customer) {
            this.logger.warn(`Customer with phone ${phone} not found`);
            throw new common_1.NotFoundException(`Customer with phone ${phone} not found`);
        }
        return customer;
    }
    async findWithDebts() {
        this.logger.log('Fetching customers with outstanding debts');
        return this.customerRepository.findWithDebts();
    }
};
exports.GetCustomerUseCase = GetCustomerUseCase;
exports.GetCustomerUseCase = GetCustomerUseCase = GetCustomerUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], GetCustomerUseCase);
//# sourceMappingURL=get-customer.use-case.js.map