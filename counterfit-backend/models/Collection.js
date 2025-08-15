const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    maxlength: [100, 'Collection name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  image: {
    url: String,
    alt: String
  },
  banner: {
    url: String,
    alt: String
  },
  badge: {
    text: String, // e.g., "New Drop", "Limited Edition", "Exclusive"
    color: {
      type: String,
      default: '#000000'
    }
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  publishedAt: Date,
  visibility: {
    type: String,
    enum: ['public', 'private', 'password'],
    default: 'public'
  },
  password: String
}, {
  timestamps: true
});

// Create slug from name
collectionSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Indexes
collectionSchema.index({ name: 'text', description: 'text' });
collectionSchema.index({ status: 1 });
collectionSchema.index({ featured: 1 });
collectionSchema.index({ sortOrder: 1 });
collectionSchema.index({ createdAt: -1 });

// Virtual for product count
collectionSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'collections',
  count: true
});

// Ensure virtual fields are serialized
collectionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Collection', collectionSchema);
