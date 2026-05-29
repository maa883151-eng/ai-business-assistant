import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:%24%23%23mdmam1022%23%23%24@db.nsqsafsqrdokawkenpnu.supabase.co:5432/postgres';

const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
}

testConnection();
