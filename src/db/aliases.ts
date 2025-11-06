import { aliasedTable } from "drizzle-orm";
import { usersTable } from "../models/user.model";

export const creator = aliasedTable(usersTable, "creator");
export const updater = aliasedTable(usersTable, "updater");