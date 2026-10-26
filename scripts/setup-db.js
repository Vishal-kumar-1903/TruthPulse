// Standalone CLI Database Setup & Superuser (su) Provisioner
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read .env.local manually if it exists
let MONGODB_URI = 'mongodb://127.0.0.1:27017/truthpulse';
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim();
    }
  }
} catch (e) {}

async function runSetup() {
  console.log(`\n========================================`);
  console.log(` TruthPulse MongoDB Provisioning Script `);
  console.log(`========================================\n`);
  console.log(`Connecting to: ${MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@')} ...`);

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✓ Connected to MongoDB successfully!`);
    console.log(`  Database Name: ${mongoose.connection.name}`);
    console.log(`  Host: ${mongoose.connection.host}\n`);

    // Define minimal schemas for CLI setup
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      role: String,
      truthCredits: Number,
      accuracyRate: Number,
      strikes: Number
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Provision Superusers (su)
    const superusers = [
      {
        name: 'TruthPulse Superuser (SU)',
        email: 'admin@truthpulse.in',
        role: 'ADMIN',
        truthCredits: 1000,
        accuracyRate: 100,
        strikes: 0
      },
      {
        name: 'Vikramaditya Sen (Chief Editor)',
        email: 'editor@truthpulse.in',
        role: 'CHIEF_EDITOR',
        truthCredits: 500,
        accuracyRate: 98,
        strikes: 0
      }
    ];

    for (const su of superusers) {
      const doc = await User.findOneAndUpdate(
        { email: su.email },
        { $set: su },
        { upsert: true, new: true }
      );
      console.log(`✓ Superuser provisioned: ${doc.name} (${doc.email}) - Role: [${doc.role}]`);
    }

    const totalUsers = await User.countDocuments();
    console.log(`\n✓ Total users in database: ${totalUsers}`);
    console.log(`\nSetup completed successfully!\n`);
  } catch (err) {
    console.error(`\n❌ MongoDB Connection Error:`, err.message);
    console.log(`\nTip: To use MongoDB Atlas cloud:`);
    console.log(`1. Create a free cluster at https://cloud.mongodb.com`);
    console.log(`2. Copy the connection string (mongodb+srv://...)`);
    console.log(`3. Put it in .env.local as MONGODB_URI=<your-string>\n`);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSetup();
