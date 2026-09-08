const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const archiver = require('archiver');

/*
|--------------------------------------------------------------------------
| MONGODB BACKUP SCRIPT
|--------------------------------------------------------------------------
|
| Yeh script `mongodump` binary PAR DEPEND NAHI karta (Render/Railway
| jaise free hosting par woh install nahi hota) — iski jagah Mongoose
| ke through har collection ko seedha JSON me export karta hai, phir
| sabko ek single .zip me bundle kar deta hai.
|
| USAGE:
|
|   1. Standalone (manual run / server cron job):
|        npm run backup
|
|   2. Automated (app ke andar se, node-cron ke through):
|        `utils/cronJobs.js` isi file ka `runBackup()` function
|        import karke schedule par chalata hai — dekho ENABLE_AUTO_BACKUP
|        aur BACKUP_CRON_SCHEDULE env vars.
|
| OUTPUT:
|
|   Backend/backups/backup-<timestamp>.zip
|
|   Purane backups `BACKUP_RETENTION_COUNT` (default 7) se zyada ho
|   jaane par sabse purane khud-ba-khud delete ho jaate hain.
|
|--------------------------------------------------------------------------
*/

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const RETENTION_COUNT = Number(process.env.BACKUP_RETENTION_COUNT) || 7;

// ======================================================
// ENSURE BACKUP DIRECTORY EXISTS
// ======================================================

const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
};

// ======================================================
// DUMP ALL COLLECTIONS TO A TEMP FOLDER AS JSON
// ======================================================

const dumpCollectionsToJson = async (tempDir) => {
  fs.mkdirSync(tempDir, { recursive: true });

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  for (const { name } of collections) {
    const documents = await mongoose.connection.db
      .collection(name)
      .find({})
      .toArray();

    fs.writeFileSync(
      path.join(tempDir, `${name}.json`),
      JSON.stringify(documents, null, 2)
    );

    console.log(`   📄 Dumped ${documents.length} docs from "${name}"`);
  }

  return collections.map((c) => c.name);
};

// ======================================================
// ZIP THE TEMP FOLDER INTO backups/backup-<timestamp>.zip
// ======================================================

const zipFolder = (tempDir, zipPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(archive.pointer()));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();
  });
};

// ======================================================
// DELETE OLD BACKUPS BEYOND RETENTION COUNT
// ======================================================

const cleanupOldBackups = () => {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('backup-') && f.endsWith('.zip'))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time); // newest first

  const toDelete = files.slice(RETENTION_COUNT);

  toDelete.forEach((file) => {
    fs.unlinkSync(path.join(BACKUP_DIR, file.name));
    console.log(`   🗑️  Removed old backup: ${file.name}`);
  });
};

// ======================================================
// MAIN: runBackup()
// ======================================================
//
// NOTE: is function ko call karne se PEHLE mongoose connection already
// established honi chahiye (ya toh app already running hai, ya standalone
// mode me niche `connectAndRun()` khud connect karta hai).
//
// ======================================================

const runBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tempDir = path.join(BACKUP_DIR, `_tmp-${timestamp}`);
  const zipPath = path.join(BACKUP_DIR, `backup-${timestamp}.zip`);

  ensureBackupDir();

  console.log(`\n🔄 Starting MongoDB backup — ${new Date().toLocaleString()}`);

  try {
    const collectionNames = await dumpCollectionsToJson(tempDir);
    const sizeBytes = await zipFolder(tempDir, zipPath);

    fs.rmSync(tempDir, { recursive: true, force: true });

    cleanupOldBackups();

    console.log(
      `✅ Backup complete: ${path.basename(zipPath)} (${(sizeBytes / 1024).toFixed(1)} KB, ${collectionNames.length} collections)\n`
    );

    return { zipPath, collectionNames, sizeBytes };
  } catch (error) {
    // Cleanup partial temp folder on failure
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    console.error('❌ Backup failed:', error.message);
    throw error;
  }
};

// ======================================================
// STANDALONE MODE (npm run backup)
// ======================================================
//
// Jab yeh file DIRECTLY run ki jaaye (node scripts/backupDatabase.js),
// toh khud DB se connect karo, backup lo, aur connection band karke
// exit ho jaao. Jab isse `require()` kiya jaaye (cronJobs.js se),
// yeh block skip ho jaata hai — assume kiya jaata hai connection
// already open hai.
//
// ======================================================

const connectAndRun = async () => {
  require('dotenv').config({
    path: path.join(__dirname, '..', '.env'),
  });

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB for backup');

    await runBackup();

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Standalone backup run failed:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  connectAndRun();
}

module.exports = { runBackup };