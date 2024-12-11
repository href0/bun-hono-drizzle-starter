import { faker } from '@faker-js/faker/locale/id_ID';
import ora from 'ora';
import { db, pool } from '../config/db.config';
import { usersTable } from '../models/user.model';
import { hashPassword } from '../utils/helpers/common.helper';

// Fungsi untuk generate satu user
const generateUser = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const password = faker.internet.password({ length: 12 });
  
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: await hashPassword(password),
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
};

async function seedUsers(count = 10) {
  const mainSpinner = ora('Memulai proses seeding users').start();
  
  try {
    // Generate users
    mainSpinner.text = '🎲 Generating user data...';
    const generateSpinner = ora().start();
    let users = [];
    
    for (let i = 0; i < count; i++) {
      generateSpinner.text = `Generating user data ${i + 1}/${count}`;
      const user = await generateUser();
      users.push(user);
    }
    generateSpinner.succeed(`✅ Berhasil generate ${count} user data`);

    // Insert users
    mainSpinner.text = '💾 Menyimpan data ke database...';
    const insertSpinner = ora().start();
    
    await db.insert(usersTable)
      .values(users)
      .onConflictDoNothing({ target: [usersTable.email] });
    
    insertSpinner.succeed('✅ Data berhasil disimpan ke database');

    // Tampilkan sample data
    console.log('\n📊 Sample dari data yang di-generate:');
    const sampleUsers = users.slice(0, 3);
    sampleUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`Nama: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Created: ${user.created_at}`);
    });

    mainSpinner.succeed('✨ Proses seeding selesai!');

  } catch (error) {
    mainSpinner.fail('❌ Terjadi error saat seeding users');
    console.error(error);
    throw error;
  } finally {
    // Cleanup database connection
    const cleanupSpinner = ora('Membersihkan koneksi database...').start();
    await pool.end();
    cleanupSpinner.succeed('✅ Koneksi database ditutup');
  }
}

// Jalankan seeder dengan 10 users
seedUsers(100).catch((error) => {
  console.error('Failed to seed:', error);
  process.exit(1);
});