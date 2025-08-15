const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['outerwear', 'tops', 'bottoms', 'footwear', 'accessories', 'athletic']
  },
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],
  tags: [{
    type: String,
    lowercase: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  // Stock code for filtering and inventory management
  stockCode: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  
  // Available sizes
  sizes: [{
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  
  // Available colors
  colors: [{
    name: {
      type: String,
      required: true
    },
    hexCode: {
      type: String,
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Invalid hex color code'
      }
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  
  // Legacy variants field for backward compatibility
  variants: [{
    name: String, // e.g., "Size", "Color"
    values: [String] // e.g., ["S", "M", "L"] or ["Red", "Blue"]
  }],
  inventory: {
    trackQuantity: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    allowBackorder: {
      type: Boolean,
      default: false
    }
  },
  shipping: {
    weight: Number, // in grams
    dimensions: {
      length: Number, // in cm
      width: Number,
      height: Number
    },
    requiresShipping: {
      type: Boolean,
      default: true
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  // Overall availability status
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity > 0 || this.inventory.allowBackorder;
});

// Virtual for total stock across all sizes/colors
productSchema.virtual('totalStock').get(function() {
  let total = 0;
  if (this.sizes && this.sizes.length > 0) {
    total += this.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
  }
  if (this.colors && this.colors.length > 0) {
    total += this.colors.reduce((sum, color) => sum + (color.stock || 0), 0);
  }
  return total || this.inventory.quantity;
});

// Virtual for available sizes
productSchema.virtual('availableSizes').get(function() {
  return this.sizes ? this.sizes.filter(size => size.isAvailable && size.stock > 0) : [];
});

// Virtual for available colors
productSchema.virtual('availableColors').get(function() {
  return this.colors ? this.colors.filter(color => color.isAvailable && color.stock > 0) : [];
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
