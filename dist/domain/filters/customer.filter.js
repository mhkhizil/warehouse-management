"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerFilter = void 0;
const pagination_filter_1 = require("./pagination.filter");
class CustomerFilter extends pagination_filter_1.PaginationFilter {
    constructor(partial) {
        super(partial);
        Object.assign(this, partial);
    }
}
exports.CustomerFilter = CustomerFilter;
//# sourceMappingURL=customer.filter.js.map