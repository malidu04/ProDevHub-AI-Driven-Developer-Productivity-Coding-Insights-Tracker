import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  repositoryUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
projectSchema.index({ userId: 1, status: 1 })

export default mongoose.model('Project', projectSchema)