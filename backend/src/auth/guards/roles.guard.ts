/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { TypeRole } from "src/user/dto/enums/role.enum";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<TypeRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    // SUPER_ADMIN has all access
    if (user.role === TypeRole.SUPER_ADMIN) {
      return true;
    }

    // Checks if the user role is allowed
    return requiredRoles.includes(user.role);
  }
}
