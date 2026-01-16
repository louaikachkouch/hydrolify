require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Create users and stores
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // User 1 - Demo Store
    const user1 = new User({
      name: 'Demo User',
      email: 'demo@hydrolify.com',
      password: hashedPassword
    });

    const store1 = new Store({
      slug: 'demo-store',
      subdomain: 'demo-store',
      ownerId: user1._id,
      storeName: 'Demo Store',
      storeEmail: 'contact@demo-store.com',
      storePhone: '+216 71 123 456',
      storeAddress: 'Avenue Habib Bourguiba, Tunis 1000, Tunisia',
      themeColor: '#2563eb',
      currency: 'TND',
      timezone: 'Africa/Tunis',
      description: 'Your one-stop shop for quality products',
      isActive: true
    });

    await store1.save();
    user1.storeId = store1._id;
    await user1.save();

    // User 2 - Fashion Boutique
    const user2 = new User({
      name: 'Fashion Owner',
      email: 'fashion@hydrolify.com',
      password: hashedPassword
    });

    const store2 = new Store({
      slug: 'fashion-boutique',
      subdomain: 'fashion-boutique',
      ownerId: user2._id,
      storeName: 'Fashion Boutique',
      storeEmail: 'hello@fashionboutique.tn',
      storePhone: '+216 71 234 567',
      storeAddress: 'Rue de la Liberté, Sousse 4000, Tunisia',
      themeColor: '#ec4899',
      currency: 'TND',
      timezone: 'Africa/Tunis',
      description: 'Trendy fashion for modern lifestyles',
      isActive: true
    });

    await store2.save();
    user2.storeId = store2._id;
    await user2.save();

    // User 3 - Tech Zone
    const user3 = new User({
      name: 'Tech Owner',
      email: 'tech@hydrolify.com',
      password: hashedPassword
    });

    const store3 = new Store({
      slug: 'tech-zone',
      subdomain: 'tech-zone',
      ownerId: user3._id,
      storeName: 'Tech Zone',
      storeEmail: 'support@techzone.tn',
      storePhone: '+216 71 345 678',
      storeAddress: 'Centre Urbain Nord, Tunis 1082, Tunisia',
      themeColor: '#10b981',
      currency: 'TND',
      timezone: 'Africa/Tunis',
      description: 'Latest electronics and gadgets',
      isActive: true
    });

    await store3.save();
    user3.storeId = store3._id;
    await user3.save();

    console.log('Created users and stores');

    // Create products for Demo Store
    const demoProducts = [
      {
        storeId: store1._id,
        name: 'Classic White T-Shirt',
        description: 'Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
        price: 29.99,
        compareAtPrice: 39.99,
        inventory: 150,
        category: 'Apparel',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
      },
      {
        storeId: store1._id,
        name: 'Leather Messenger Bag',
        description: 'Handcrafted genuine leather bag with multiple compartments.',
        price: 149.99,
        inventory: 45,
        category: 'Accessories',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop'
      },
      {
        storeId: store1._id,
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium sound quality with 30-hour battery life and noise cancellation.',
        price: 199.99,
        compareAtPrice: 249.99,
        inventory: 78,
        category: 'Electronics',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      },
      {
        storeId: store1._id,
        name: 'Organic Coffee Beans',
        description: 'Fair-trade Arabica beans from Colombia. Rich and aromatic.',
        price: 24.99,
        inventory: 200,
        category: 'Food & Beverage',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop'
      },
      {
        storeId: store1._id,
        name: 'Minimalist Watch',
        description: 'Elegant stainless steel watch with genuine leather strap.',
        price: 129.99,
        compareAtPrice: 159.99,
        inventory: 32,
        category: 'Accessories',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
      },
      {
        storeId: store1._id,
        name: 'Yoga Mat Pro',
        description: 'Extra thick, non-slip yoga mat with carrying strap.',
        price: 49.99,
        inventory: 0,
        category: 'Sports',
        status: 'draft',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop'
      }
    ];

    // Create products for Fashion Boutique
    const fashionProducts = [
      {
        storeId: store2._id,
        name: 'Elegant Summer Dress',
        description: 'Flowing floral print dress perfect for summer occasions.',
        price: 89.99,
        compareAtPrice: 120.00,
        inventory: 65,
        category: 'Apparel',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop'
      },
      {
        storeId: store2._id,
        name: 'Designer Handbag',
        description: 'Luxury leather handbag with gold-tone hardware.',
        price: 299.99,
        inventory: 25,
        category: 'Accessories',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop'
      },
      {
        storeId: store2._id,
        name: 'Silk Scarf Collection',
        description: 'Premium silk scarf with artistic patterns.',
        price: 59.99,
        compareAtPrice: 79.99,
        inventory: 100,
        category: 'Accessories',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&h=300&fit=crop'
      }
    ];

    // Create products for Tech Zone
    const techProducts = [
      {
        storeId: store3._id,
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking with GPS and heart rate monitor.',
        price: 349.99,
        compareAtPrice: 399.99,
        inventory: 42,
        category: 'Electronics',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop'
      },
      {
        storeId: store3._id,
        name: 'Wireless Gaming Mouse',
        description: 'High-precision sensor with RGB lighting and programmable buttons.',
        price: 79.99,
        inventory: 150,
        category: 'Electronics',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop'
      },
      {
        storeId: store3._id,
        name: 'Mechanical Keyboard',
        description: 'Cherry MX switches with customizable RGB backlighting.',
        price: 159.99,
        compareAtPrice: 189.99,
        inventory: 75,
        category: 'Electronics',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&h=300&fit=crop'
      }
    ];

    const allProducts = await Product.insertMany([...demoProducts, ...fashionProducts, ...techProducts]);
    console.log(`Created ${allProducts.length} products`);

    // Create sample orders
    const demoProductIds = allProducts.filter(p => p.storeId.equals(store1._id));
    
    const orders = [
      {
        storeId: store1._id,
        orderId: 'ORD-1001',
        customer: { name: 'John Smith', email: 'john.smith@email.com' },
        items: [
          { productId: demoProductIds[0]._id, name: 'Classic White T-Shirt', quantity: 2, price: 29.99 },
          { productId: demoProductIds[4]._id, name: 'Minimalist Watch', quantity: 1, price: 129.99 }
        ],
        total: 189.97,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: '123 Main St, New York, NY 10001'
      },
      {
        storeId: store1._id,
        orderId: 'ORD-1002',
        customer: { name: 'Emily Johnson', email: 'emily.j@email.com' },
        items: [
          { productId: demoProductIds[2]._id, name: 'Wireless Bluetooth Headphones', quantity: 1, price: 199.99 }
        ],
        total: 199.99,
        status: 'shipped',
        paymentStatus: 'paid',
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
      },
      {
        storeId: store1._id,
        orderId: 'ORD-1003',
        customer: { name: 'Michael Brown', email: 'm.brown@email.com' },
        items: [
          { productId: demoProductIds[1]._id, name: 'Leather Messenger Bag', quantity: 1, price: 149.99 },
          { productId: demoProductIds[3]._id, name: 'Organic Coffee Beans', quantity: 3, price: 24.99 }
        ],
        total: 224.96,
        status: 'processing',
        paymentStatus: 'paid',
        shippingAddress: '789 Pine Rd, Chicago, IL 60601'
      },
      {
        storeId: store1._id,
        orderId: 'ORD-1004',
        customer: { name: 'Sarah Wilson', email: 'sarah.w@email.com' },
        items: [
          { productId: demoProductIds[0]._id, name: 'Classic White T-Shirt', quantity: 3, price: 29.99 }
        ],
        total: 89.97,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: '321 Elm St, Houston, TX 77001'
      }
    ];

    await Order.insertMany(orders);
    console.log(`Created ${orders.length} orders`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest accounts:');
    console.log('  demo@hydrolify.com / demo123 (Demo Store)');
    console.log('  fashion@hydrolify.com / demo123 (Fashion Boutique)');
    console.log('  tech@hydrolify.com / demo123 (Tech Zone)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
