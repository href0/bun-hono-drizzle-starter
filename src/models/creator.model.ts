import { creator } from "../db/aliases";
import { usersTable } from "./user.model";

export const creatorRelation = {
    fields: [usersTable.createdBy],
    references: [creator.id]
  }