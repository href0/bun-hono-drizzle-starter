import { eq } from "drizzle-orm";
import { usersTable } from "../../models/user.model";

export const select = () =>{
  return {
    id : usersTable.id,
    name : usersTable.name,
    email : usersTable.email,
    updatedAt : usersTable.updatedAt,
    createdAt : usersTable.createdAt,
  }
}

export const getById = (id:number) =>{
  return eq(usersTable.id, id)
}
