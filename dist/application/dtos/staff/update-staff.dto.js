"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStaffDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_staff_dto_1 = require("./create-staff.dto");
class UpdateStaffDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_staff_dto_1.CreateStaffDto, ['userId', 'user'])) {
}
exports.UpdateStaffDto = UpdateStaffDto;
//# sourceMappingURL=update-staff.dto.js.map