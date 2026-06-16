import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    // BUG INJECTED #2: No uniqueness constraint on email! Multiple users can register with the same email.
    // unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    // BUG INJECTED #3: No minimum length or complexity requirement for password
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true, // BUG INJECTED #4: New users are active by default, perhaps skipping verification
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
