import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from './logger.config';
export const pool = new Pool({
  connectionString: Bun.env.DATABASE_URL!,
});
// Test koneksi dan tambahkan logger
pool.connect()
  .then(() => {
    console.log('✅ PostgreSQL Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('DATABASE_URL',  Bun.env.DATABASE_URL!)
    console.error('❌ Unable to connect to the database:', error);
    process.exit()
});
export const db = drizzle({ client: pool, casing : 'snake_case', logger : {
  logQuery(query: string, params: any[]): void {
    params = params.map(param => param.toString().includes('argon') ? 'SECRET' : param)
    logger.info('EXECUTE QUERY',{sql : query, params: params})
  },
}});