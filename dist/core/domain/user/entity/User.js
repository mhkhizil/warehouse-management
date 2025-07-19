"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(id = '', name, email, phone, role, password, profileImageUrl, createdDate, updatedDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.password = password;
        this.profileImageUrl = profileImageUrl;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
    static toEntity(user) {
        return new UserEntity(user?.id?.toString(), user?.username, user?.email, user?.phone, user?.role, user?.password, user?.profileImageUrl, user?.createdAt, user?.updatedAt);
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=User.js.map