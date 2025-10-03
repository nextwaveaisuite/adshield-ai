/**
 * Seed script for local Postgres (or any DATABASE_URL).
 * Usage:
 *   DATABASE_URL=postgres://postgres:postgres@localhost:5432/adsdb node scripts/seed_local.js
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
const { Client } = pg;

async function main(){
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if(!url){ console.error('Set DATABASE_URL or POSTGRES_URL'); process.exit(1); }
  const client = new Client({ connectionString: url });
  await client.connect();
  const schemaPath = path.join(process.cwd(), 'sql', 'events_vercel.sql');
  const seedPath = path.join(process.cwd(), 'sql', 'seed_events.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const seed = fs.readFileSync(seedPath, 'utf8');
  console.log('Applying schema...'); await client.query(schema);
  console.log('Inserting seed data...'); await client.query(seed);
  await client.end();
  console.log('Done.');
}
main().catch(err=>{ console.error(err); process.exit(1); });