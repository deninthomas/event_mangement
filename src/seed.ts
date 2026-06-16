import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://denin_db_user:3cVahCtgnr0X0IGq@cluster99.swlng78.mongodb.net/event-calendar?appName=Cluster99';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  await User.deleteMany({}); // Clear existing users for a clean slate

  const adminPassword = await bcrypt.hash('Admin@123!', 1);
  const user1Password = await bcrypt.hash('User@123!', 1);
  const user2Password = await bcrypt.hash('User@456!', 1);

  await User.create([
    { name: 'Admin Boss', email: 'admin@eventcalendar.com', password: adminPassword, role: 'admin', isActive: true },
    { name: 'Test User 1', email: 'user1@eventcalendar.com', password: user1Password, role: 'user', isActive: true },
    { name: 'Test User 2', email: 'user2@eventcalendar.com', password: user2Password, role: 'user', isActive: false }, // Inactive user
  ]);

  console.log('Database seeded with test users!');
  process.exit(0);
}

seed();
