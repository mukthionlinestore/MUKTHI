const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import models
const Settings = require('./models/Settings');
const Footer = require('./models/Footer');
const WebsiteConfig = require('./models/WebsiteConfig');
const HomePageSettings = require('./models/HomePageSettings');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // 1. Create default Settings
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: 'MUKTHI Store',
        siteDescription: 'Your one-stop online shop',
        contactEmail: 'mukthionlinestore@gmail.com',
        contactPhone: '+1234567890',
        currency: 'INR',
        currencySymbol: '₹',
        shippingFee: 50,
        freeShippingThreshold: 500,
        taxRate: 0,
        maintenanceMode: false,
        maintenanceMessage: 'We are currently under maintenance. Please check back soon.',
        allowRegistration: true,
        allowGuestCheckout: false,
        maxCartItems: 50,
        maxWishlistItems: 100
      });
      console.log('✅ Created default Settings');
    } else {
      console.log('ℹ️  Settings already exist');
    }

    // 2. Create default Footer
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({
        sections: [
          {
            title: 'About Us',
            links: [
              { text: 'Our Story', url: '/about' },
              { text: 'Contact Us', url: '/contact' }
            ]
          },
          {
            title: 'Customer Service',
            links: [
              { text: 'Shipping Info', url: '/shipping' },
              { text: 'Returns', url: '/returns' }
            ]
          }
        ],
        socialMedia: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          twitter: 'https://twitter.com'
        },
        copyrightText: `© ${new Date().getFullYear()} MUKTHI Store. All rights reserved.`,
        paymentMethods: ['Visa', 'Mastercard', 'Razorpay'],
        showNewsletter: true,
        newsletterTitle: 'Subscribe to our Newsletter',
        newsletterDescription: 'Get the latest updates and offers'
      });
      console.log('✅ Created default Footer');
    } else {
      console.log('ℹ️  Footer already exists');
    }

    // 3. Create default WebsiteConfig
    let websiteConfig = await WebsiteConfig.findOne();
    if (!websiteConfig) {
      websiteConfig = await WebsiteConfig.create({
        websiteName: 'MUKTHI Store',
        websiteLogo: '',
        logoAlt: 'MUKTHI Store Logo',
        faviconUrl: '/favicon.ico',
        metaTitle: 'MUKTHI Store - Your Shopping Destination',
        metaDescription: 'Shop the latest products at MUKTHI Store',
        metaKeywords: 'online shopping, ecommerce, products',
        
        // Theme colors
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        accentColor: '#06B6D4',
        
        // Header/Footer
        headerBackground: '#FFFFFF',
        headerTextColor: '#1F2937',
        footerBackground: '#1F2937',
        footerTextColor: '#F9FAFB',
        
        // General
        backgroundColor: '#F9FAFB',
        textPrimaryColor: '#1F2937',
        textSecondaryColor: '#6B7280',
        linkColor: '#3B82F6',
        
        // Buttons
        buttonPrimaryColor: '#3B82F6',
        buttonPrimaryHoverColor: '#2563EB',
        
        // Features
        features: {
          showRatings: true,
          showReviews: true,
          showWishlist: true,
          showCompare: false,
          showQuickView: true,
          enableGoogleOAuth: true,
          enableNotifications: true
        },
        
        // Payment
        paymentSettings: {
          paymentMethod: 'razorpay',
          razorpayEnabled: true,
          stripeEnabled: false,
          codEnabled: true
        },
        
        // Social Media
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: '',
          linkedin: ''
        },
        
        maintenanceMode: false,
        maintenanceMessage: 'We are currently under maintenance. Please check back soon.'
      });
      console.log('✅ Created default WebsiteConfig');
    } else {
      console.log('ℹ️  WebsiteConfig already exists');
    }

    // 4. Create default HomePageSettings
    let homePageSettings = await HomePageSettings.findOne();
    if (!homePageSettings) {
      homePageSettings = await HomePageSettings.create({
        heroSection: {
          enabled: true,
          title: 'Welcome to MUKTHI Store',
          subtitle: 'Discover Amazing Products',
          buttonText: 'Shop Now',
          buttonLink: '/products',
          backgroundImage: '',
          textColor: '#FFFFFF',
          backgroundColor: '#3B82F6'
        },
        featuredCategories: {
          enabled: true,
          title: 'Shop by Category',
          categories: []
        },
        newArrivals: {
          enabled: true,
          title: 'New Arrivals',
          limit: 8
        },
        bestSellers: {
          enabled: true,
          title: 'Best Sellers',
          limit: 8
        },
        featuredProducts: {
          enabled: false,
          title: 'Featured Products',
          productIds: []
        },
        banners: {
          enabled: false,
          items: []
        },
        testimonials: {
          enabled: false,
          title: 'What Our Customers Say',
          items: []
        }
      });
      console.log('✅ Created default HomePageSettings');
    } else {
      console.log('ℹ️  HomePageSettings already exists');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Settings: ✓');
    console.log('   - Footer: ✓');
    console.log('   - WebsiteConfig: ✓');
    console.log('   - HomePageSettings: ✓');
    console.log('\n✨ Your application should now work correctly!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

