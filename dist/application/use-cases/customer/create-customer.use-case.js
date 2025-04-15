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
var CreateCustomerUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
let CreateCustomerUseCase = CreateCustomerUseCase_1 = class CreateCustomerUseCase {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
        this.logger = new common_1.Logger(CreateCustomerUseCase_1.name);
    }
    async execute(createCustomerDto) {
        this.logger.log(`Creating customer with name: ${createCustomerDto.name}`);
        if (createCustomerDto.email) {
            const existingCustomerWithEmail = await this.customerRepository.findByEmail(createCustomerDto.email);
            if (existingCustomerWithEmail) {
                this.logger.warn(`Customer with email ${createCustomerDto.email} already exists`);
                throw new common_1.BadRequestException(`Customer with email ${createCustomerDto.email} already exists`);
            }
        }
        if (createCustomerDto.phone) {
            const existingCustomerWithPhone = await this.customerRepository.findByPhone(createCustomerDto.phone);
            if (existingCustomerWithPhone) {
                this.logger.warn(`Customer with phone ${createCustomerDto.phone} already exists`);
                throw new common_1.BadRequestException(`Customer with phone ${createCustomerDto.phone} already exists`);
            }
        }
        const newCustomer = await this.customerRepository.create(createCustomerDto);
        this.logger.log(`Customer created with ID: ${newCustomer.id}`);
        return newCustomer;
    }
};
exports.CreateCustomerUseCase = CreateCustomerUseCase;
exports.CreateCustomerUseCase = CreateCustomerUseCase = CreateCustomerUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], CreateCustomerUseCase);
//# sourceMappingURL=create-customer.use-case.js.map