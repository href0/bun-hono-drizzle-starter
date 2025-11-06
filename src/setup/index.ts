import { count } from "drizzle-orm";
import { db } from "../config/db.config";
import { initMenu } from "./initial-menu";
import { initRole } from "./initial-role";
import { initUserSystem } from "./initial-user-system";
import { systemInitTable } from "../models/system-init.model";
import { initPermission } from "./init-permission";

async function hasBeenInitialized() : Promise<number> {
  const result = await db.select({ count: count() }).from(systemInitTable)
  return result[0].count
}

async function markAsInitialized(): Promise<void> {
  await db.insert(systemInitTable).values({})
}

async function setup() {
  console.log("Initializing system data...");
  if (await hasBeenInitialized()) {
    console.log("Setup has already been completed. Exiting...");
    process.exit(0);
  }
  
  await initUserSystem()
  await Promise.all([
    initMenu(),
    initRole(),
    initPermission()
  ])
  await markAsInitialized()
}

setup()
  .then(() => {
    console.log('Initializing successfuly')
    console.log('Here your superadmin account, dont forget to change passowrd')
    console.log('Email: system@hrefdev.be')
    console.log('Password: password')
    process.exit(0)
  })
  .catch(err => {
    console.error("Error during setup:", err);
    process.exit(1)
  })