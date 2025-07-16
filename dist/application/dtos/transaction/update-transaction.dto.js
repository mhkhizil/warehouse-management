"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_transaction_dto_1 = require("./create-transaction.dto");
class UpdateTransactionDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_transaction_dto_1.CreateTransactionDto, ['type', 'createDebt', 'debt'])) {
}
exports.UpdateTransactionDto = UpdateTransactionDto;
//# sourceMappingURL=update-transaction.dto.js.map