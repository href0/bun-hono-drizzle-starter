import { usersTable } from "../../models/user.model";

export const USER_SELECT = {
    id : usersTable.id,
    name : usersTable.name,
    email : usersTable.email,
    updatedAt : usersTable.updatedAt,
    createdAt : usersTable.createdAt,
  }
