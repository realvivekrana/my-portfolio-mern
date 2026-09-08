const cron = require('node-cron');

const { runBackup } = require('../scripts/backupDatabase');

/*
|--------------------------------------------------------------------------
| AUTOMATED CRON JOBS
|--------------------------------------------------------------------------
|
| server.js is file ko app start hone ke baad call karta hai
| (`initCronJobs()`). Abhi sirf ek job hai: automated DB backup.
|
| CONTROL VIA .env:
|   ENABLE_AUTO_BACKUP=true            -> job schedule hoga
|   BACKUP_CRON_SCHEDULE="0 2 * * *"   -> daily 2:00 AM (default)
|
| NOTE: Yeh sirf tab kaam karega jab tak server process ZINDA hai.
| Render/Railway jaise hosts par agar free-tier instance "spin down"
| ho jaata hai (inactivity ke baad), toh scheduled time par agar
| server sula hua hai, job miss ho sakta hai. Guaranteed daily backup
| ke liye behtar options:
|   - Paid/always-on instance rakho, YA
|   - External cron (cron-job.org / GitHub Actions scheduled workflow)
|     se ek protected endpoint hit karo jo `runBackup()` trigger kare.
|
|--------------------------------------------------------------------------
*/

const initCronJobs = () => {
  if (process.env.ENABLE_AUTO_BACKUP !== 'true') {
    console.log('ℹ️  Automated DB backup is disabled (ENABLE_AUTO_BACKUP=false)');
    return;
  }

  const schedule = process.env.BACKUP_CRON_SCHEDULE || '0 2 * * *'; // daily 2 AM

  if (!cron.validate(schedule)) {
    console.error(
      `❌ Invalid BACKUP_CRON_SCHEDULE "${schedule}" — automated backup NOT scheduled`
    );
    return;
  }

  cron.schedule(schedule, async () => {
    try {
      await runBackup();
    } catch (error) {
      console.error('❌ Scheduled backup failed:', error.message);
    }
  });

  console.log(`🕑 Automated DB backup scheduled: "${schedule}"`);
};

module.exports = { initCronJobs };