"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtFilter = void 0;
const pagination_filter_1 = require("./pagination.filter");
class DebtFilter extends pagination_filter_1.PaginationFilter {
    constructor(partial) {
        super(partial);
        Object.assign(this, partial);
    }
}
exports.DebtFilter = DebtFilter;
//# sourceMappingURL=debt.filter.js.map