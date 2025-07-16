"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilter = void 0;
const BaseFilterSchema_1 = require("../../../common/schema/BaseFilterSchema");
class UserFilter extends BaseFilterSchema_1.BaseFilterSchema {
    constructor(name, role, take, skip) {
        super(take, skip);
        this.name = name || '';
        this.role = role;
    }
}
exports.UserFilter = UserFilter;
//# sourceMappingURL=UserFilter.js.map