import { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";


export const createRoleService = (roleRepo?: RoleRepository) => new RoleService(roleRepo ?? new RoleRepository());
export const roleService = createRoleService();