import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
    // BUG INJECTED #5: Storing date without clear timezone definition, which will cause off-by-one errors based on user's timezone.
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true, // BUG INJECTED #6: All events are public by default! Privacy issue.
  }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
