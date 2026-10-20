const mongoose = require('mongoose');

/*
|--------------------------------------------------------------------------
| MONGODB CONNECTION (with retry — server crash nahi hoga)
|--------------------------------------------------------------------------
|
| Pehle: DB connect fail hote hi `process.exit(1)` — Render par poora
| backend band ho jata tha (Atlas ka ek chhota network hiccup bhi kaafi tha).
|
| Ab: error ka kaaran saaf dikhata hai aur har 5 second baad dobara
| try karta hai. Server zinda rehta hai, DB aate hi sab chalne lagta hai.
|
|--------------------------------------------------------------------------
*/

const RETRY_DELAY_MS = 5000;

const explainError = (error) => {
  const msg = error.message || '';

  if (!process.env.MONGO_URI) {
    return 'MONGO_URI environment variable set nahi hai (Render → Environment me add karo).';
  }

  if (/bad auth|authentication failed/i.test(msg)) {
    return 'Username/password galat hai ya password me special character URL-encode nahi hua.';
  }

  if (/ENOTFOUND|querySrv|ECONNREFUSED/i.test(msg)) {
    return 'Cluster address galat hai, ya internet/DNS issue hai. Atlas cluster paused to nahi?';
  }

  if (/Server selection timed out|ReplicaSetNoPrimary|whitelist|not allowed/i.test(msg)) {
    return 'Atlas → Network Access me IP allow nahi hai (0.0.0.0/0 add karo) ya cluster paused hai.';
  }

  return null;
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);

    const hint = explainError(error);
    if (hint) console.error(`💡 Hint: ${hint}`);

    console.error(`🔁 ${RETRY_DELAY_MS / 1000}s baad dobara try karunga...`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;