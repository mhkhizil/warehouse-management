"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationFilter = void 0;
class PaginationFilter {
    constructor(partial) {
        this.skip = 0;
        this.take = 10;
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
exports.PaginationFilter = PaginationFilter;
//# sourceMappingURL=pagination.filter.js.map