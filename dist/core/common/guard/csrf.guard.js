"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsrfGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const csrf_service_1 = require("../service/csrf.service");
const skip_csrf_decorator_1 = require("../decorator/skip-csrf.decorator");
let CsrfGuard = class CsrfGuard {
    constructor(csrfService, reflector) {
        this.csrfService = csrfService;
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const skipCsrf = this.reflector.getAllAndOverride(skip_csrf_decorator_1.SKIP_CSRF_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skipCsrf) {
            return true;
        }
        if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
            return true;
        }
        const isValid = this.csrfService.validateToken(request);
        if (!isValid) {
            throw new common_1.ForbiddenException('Invalid CSRF token');
        }
        return true;
    }
};
exports.CsrfGuard = CsrfGuard;
exports.CsrfGuard = CsrfGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [csrf_service_1.CsrfService,
        core_1.Reflector])
], CsrfGuard);
//# sourceMappingURL=csrf.guard.js.map