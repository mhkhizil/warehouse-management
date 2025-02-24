"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreApiResonseSchema = void 0;
class CoreApiResonseSchema {
    constructor(code, message, data, error) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.error = error;
    }
    static success(data, message) {
        return new CoreApiResonseSchema(200, message || 'Success', data);
    }
    static error(code, message, error) {
        return new CoreApiResonseSchema(code || 500, message || 'Internal Server Error', undefined, error);
    }
}
exports.CoreApiResonseSchema = CoreApiResonseSchema;
//# sourceMappingURL=ApiResponseSchema.js.map