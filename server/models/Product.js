import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  discountPrice: { 
    type: Number, 
    default: 0 
  },
  
  // Images
  images: [{ 
    type: String, 
    required: true 
  }],
  
  // Inventory
  sizes: [{
    size: { 
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE SIZE']
    },
    stock: { 
      type: Number, 
      default: 0 
    }
  }],
  
  colors: [{
    name: String,
    hexCode: String
  }],
  
  // Status
  featured: { 
    type: Boolean, 
    default: false 
  },
  
  // Admin Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
  
}, { timestamps: true });

// Virtual field for total stock
productSchema.virtual('totalStock').get(function() {
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.reduce((total, size) => total + (size.stock || 0), 0);
  }
  return 0;
});

// Pre-save middleware to calculate something if needed
productSchema.pre('save', function(next) {
  // You can add any pre-save logic here
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;