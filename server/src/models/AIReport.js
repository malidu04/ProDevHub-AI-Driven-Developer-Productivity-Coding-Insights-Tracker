import mongoose from 'mongoose'

const aiReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weekly', 'monthly', 'custom'],
    required: true
  },
  reportText: {
    type: String,
    required: true
  },
  insights: {
    productivityScore: Number,
    streak: Number,
    totalHours: Number,
    averageSession: Number,
    recommendations: [String],
    focusAreas: [String]
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
aiReportSchema.index({ userId: 1, type: 1, periodStart: -1 })

export default mongoose.model('AIReport', aiReportSchema)