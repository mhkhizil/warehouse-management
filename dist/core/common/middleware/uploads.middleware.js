"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsMiddleware = void 0;
const common_1 = require("@nestjs/common");
let UploadsMiddleware = class UploadsMiddleware {
    use(req, res, next) {
        if (req.path.startsWith('/uploads/')) {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            if (req.method === 'OPTIONS') {
                res.status(200).end();
                return;
            }
        }
        next();
    }
};
exports.UploadsMiddleware = UploadsMiddleware;
exports.UploadsMiddleware = UploadsMiddleware = __decorate([
    (0, common_1.Injectable)()
], UploadsMiddleware);
//# sourceMappingURL=uploads.middleware.js.map