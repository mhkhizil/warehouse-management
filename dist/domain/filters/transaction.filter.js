"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFilter = void 0;
const pagination_filter_1 = require("./pagination.filter");
class TransactionFilter extends pagination_filter_1.PaginationFilter {
    constructor(partial) {
        super(partial);
        Object.assign(this, partial);
    }
}
exports.TransactionFilter = TransactionFilter;
//# sourceMappingURL=transaction.filter.js.map