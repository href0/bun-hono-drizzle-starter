import { eq } from "drizzle-orm";
import { db } from "../src/config/db.config";
import { usersTable } from "../src/models/user.model";
import { hashPassword } from "../src/utils/helpers/common.helper";
import { rolesTable } from "../src/models/role.model";
import { signUpAuthSchema } from "../src/modules/auth/auth.schema";

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[0];
const name = args[1];
const password = args[2];
// Show help message if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: bun db:seed:superadmin [email] [name] [password]

Arguments:
  email     Masukkan email superadmin anda
  name      Masukkan nama superadmin anda
  password  Masukkan password superadmin anda

Options:
  --help, -h    Menampilkan bantuan ini

Examples:
  bun db:seed:superadmin super@gmail.com superrrr password123
  `);
  process.exit(0);
}

const seedSuperAdmin = async() => {
  await signUpAuthSchema.parseAsync({
    name,
    email,
    password
  })
  const [ [ checkUser ], [ checkRole ] ] = await Promise.all([
    db.select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email)),
    db.select({ id: rolesTable.id })
    .from(rolesTable)
    .where(eq(rolesTable.isSuperadmin, true))
  ])

  if(checkUser) throw new Error('Email already exists!')
  if(!checkRole) throw new Error('Role superadmin not found!')

  const hashedPassword = await hashPassword(password)
  await db.
    insert(usersTable).values({
      email: email,
      name: name,
      password: hashedPassword,
      roleId: checkRole.id
    })
    .returning({ id: usersTable.id })
}

console.time('Seeding duration');
seedSuperAdmin()
  .then(() => {
    console.timeEnd('Seeding duration');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });