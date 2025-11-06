// import { describe, expect, it, beforeAll, afterAll } from "bun:test";
// import { ConflictError, NotFoundError } from "../../../utils/errors/http.error";
// import { mockUser } from "../../../utils/tests/user-test.util";
// import { RoleTestUtil } from "../../../utils/tests/role-test.util";
// import { RoleResponse } from "./role.type";
// import { roleService } from "./role.service";
// import { userService } from "../user/user.service";

// // const test = new RoleTestUtil()
// let mock = RoleTestUtil.getMock() 
// let role: RoleResponse | null = null

// describe("RoleService", () => {
//   beforeAll(async () => {
//     await userService.removeByEmail(mockUser.email)
//     await roleService.removeByName(RoleTestUtil.getMock().name)
//   });

//   afterAll(async() => {
//     await RoleTestUtil.remove()
//   })

//   describe("create", () => {
//     it("should create a new role", async () => {
//       role = await RoleTestUtil.create()
//       expect(role.name).toEqual(mock.name);
//     });

//     it("should error role already exists", async () => {         
//       expect(RoleTestUtil.create())
//       .rejects.toThrow(ConflictError);
//     });
//   });

//   describe("findAll", () => {
//     it("should found roles with pagination", async () => {
//       const { rows, pagination } = await roleService.findAll({ page: 1, pageSize: 10 });
//       expect(pagination.currentPage).toEqual(1);
//       expect(pagination.hasPreviousPage).toEqual(false);
//       expect(Array.isArray(rows)).toBe(true);

//       rows.forEach(row => {
//         expect(row).toHaveProperty('id');
//         expect(row).toHaveProperty('name');
//       });
//     });
//   });

//   describe("findOne", () => {
//     it("should found a created role", async () => {
//       const check = await roleService.findOne(role?.id!);
//       expect(check.name).toEqual(mock.name);
//     });
//   });

//   describe("update", () => {
//     it("should update created role", async () => {   
//       const updated = await RoleTestUtil.update()
//       expect(updated.name).toEqual(RoleTestUtil.getMockUpdate().name);
//     });
//   });

//   describe("remove", () => {
//     it("should delete test role", async () => {
//       const remove = await RoleTestUtil.remove();
//       expect(remove).toEqual(undefined);
//     });

//     it("should error not found role", async () => {
//       expect(roleService.findOne(Number(role?.id!)))
//       .rejects.toThrow(NotFoundError);
//     });
//   });
  
// })