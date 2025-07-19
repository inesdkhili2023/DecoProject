/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { TypeRole } from "src/user/dto/enums/role.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: TypeRole[]) => SetMetadata(ROLES_KEY, roles);
