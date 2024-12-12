import { faker } from '@faker-js/faker/locale/id_ID';
import ora from 'ora';
import { usersTable } from '../src/models/user.model';
import { db, pool } from '../src/config/db.config';
import { DEFAULT_SEEDER_VALUE } from '../src/utils/constants/app.constant';

// Parse command line arguments
const args = process.argv.slice(2);
const countArg = args[0];
const defaultCount = DEFAULT_SEEDER_VALUE;

// Show help message if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: bun db:seed:user [count]

Arguments:
  count    Jumlah user yang akan di-generate (default: ${defaultCount})

Options:
  --help, -h    Menampilkan bantuan ini

Examples:
  bun db:seed:user         # Generate ${defaultCount} users
  bun db:seed:user 1000    # Generate 1000 users
  bun db:seed:user 1000000 # Generate 1 million users
  `);
  process.exit(0);
}

// Parse and validate seed count
const getSeedCount = () => {
  if (!countArg) return defaultCount;
  
  const count = parseInt(countArg, 10);
  if (isNaN(count) || count <= 0) {
    console.warn(`⚠️ Invalid count "${countArg}", using default: ${defaultCount}`);
    return defaultCount;
  }
  return count;
};

// Fungsi untuk generate satu user - tanpa async untuk performa
const generateUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const password = '$2b$10$Vt4XcGWtbgZnaTx8EWhnHO9DqnYKNt3aBJig1ZXp4DxTNgNzPAM6G';
  
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password,
    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
  };
};

async function seedUsers(count = defaultCount) {
  const mainSpinner = ora('Memulai proses seeding users').start();
  const BATCH_SIZE = 500; // Ukuran batch lebih kecil
  const CONCURRENT_BATCHES = 3; // Batasi concurrent operations
  
  try {
    // Generate users in chunks untuk menghemat memory
    const totalChunks = Math.ceil(count / 10000);
    const users = [];
    
    for(let chunk = 0; chunk < totalChunks; chunk++) {
      mainSpinner.text = `🎲 Generating user data chunk ${chunk + 1}/${totalChunks}...`;
      const chunkSize = Math.min(10000, count - (chunk * 10000));
      const chunkUsers = Array.from({ length: chunkSize }, () => generateUser());
      users.push(...chunkUsers);
    }
    
    mainSpinner.succeed(`✅ Berhasil generate ${count.toLocaleString()} user data`);

    // Bagi menjadi batches
    const batches = [];
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      batches.push(users.slice(i, i + BATCH_SIZE));
    }

    // Insert dengan throttling
    mainSpinner.text = '💾 Menyimpan data ke database...';
    const insertSpinner = ora().start();
    let completed = 0;

    // Process batches dengan throttling
    for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
      const currentBatches = batches.slice(i, i + CONCURRENT_BATCHES);
      
      await Promise.all(
        currentBatches.map(async (batch) => {
          try {
            await db.insert(usersTable)
              .values(batch)
              .onConflictDoNothing({ target: [usersTable.email] });
            
            completed += batch.length;
            const progress = ((completed / count) * 100).toFixed(2);
            insertSpinner.text = `Progress: ${completed.toLocaleString()}/${count.toLocaleString()} (${progress}%)`;
          } catch (error) {
            console.error(`Error inserting batch:`, error);
            throw error;
          }
        })
      );

      // Delay kecil antara grup batch
      if (i + CONCURRENT_BATCHES < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    insertSpinner.succeed(`✅ ${count} Data berhasil disimpan ke database`);
    mainSpinner.succeed('✨ Proses seeding selesai!');

  } catch (error) {
    mainSpinner.fail('❌ Terjadi error saat seeding users');
    console.error(error);
    throw error;
  } finally {
    const cleanupSpinner = ora('Membersihkan koneksi database...').start();
    try {
      await Promise.race([
        pool.end(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout closing pool')), 7000)
        )
      ]);
      cleanupSpinner.succeed('✅ Koneksi database ditutup');
    } catch (error) {
      cleanupSpinner.warn('⚠️ Force exit');
      process.exit(0);
    }
  }
}

// Jalankan seeder
console.time('Seeding duration');
seedUsers(getSeedCount())
  .then(() => {
    console.timeEnd('Seeding duration');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });