"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class UserZodValidationPipe {
    constructor(schema) {
        this.schema = schema;
    }
    transform(value, metadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        }
        catch (e) {
            throw new common_1.BadRequestException('invalid input type');
        }
    }
}
exports.UserZodValidationPipe = UserZodValidationPipe;
//# sourceMappingURL=user-pipes.js.map