"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilter = exports.SortOrder = exports.UserSortBy = void 0;
const BaseFilterSchema_1 = require("../../../common/schema/BaseFilterSchema");
var UserSortBy;
(function (UserSortBy) {
    UserSortBy["NAME"] = "name";
    UserSortBy["EMAIL"] = "email";
    UserSortBy["PHONE"] = "phone";
    UserSortBy["ROLE"] = "role";
    UserSortBy["CREATED_AT"] = "createdAt";
    UserSortBy["UPDATED_AT"] = "updatedAt";
})(UserSortBy || (exports.UserSortBy = UserSortBy = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class UserFilter extends BaseFilterSchema_1.BaseFilterSchema {
    constructor(name, role, email, phone, sortBy, sortOrder, take, skip) {
        super(take, skip);
        this.name = name || '';
        this.email = email || '';
        this.phone = phone || '';
        this.role = role;
        this.sortBy = sortBy || UserSortBy.CREATED_AT;
        this.sortOrder = sortOrder || SortOrder.DESC;
    }
}
exports.UserFilter = UserFilter;
//# sourceMappingURL=UserFilter.js.map