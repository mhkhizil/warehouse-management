"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id = '', name, email, phone, role, password, createdDate, updatedDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.password = password;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
    static toEntity(user) {
        return new UserEntity(user?.id, user?.name, user?.email, user?.phone, user?.role, user?.password, user?.createdDate, user?.updatedDate);
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=User.js.map