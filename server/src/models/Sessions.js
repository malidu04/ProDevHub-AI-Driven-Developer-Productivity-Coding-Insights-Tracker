import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  project: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Index for efficient queries
sessionSchema.index({ userId: 1, startTime: -1 })
sessionSchema.index({ startTime: 1 })

export default mongoose.model('Session', sessionSchema)