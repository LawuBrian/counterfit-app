const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  try {
    // Create sample categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'outerwear' },
        update: {},
        create: {
          name: 'Outerwear',
          slug: 'outerwear',
          description: 'Premium jackets, blazers, and coats',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'tops' },
        update: {},
        create: {
          name: 'Tops',
          slug: 'tops',
          description: 'Hoodies, tees, and performance wear',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'accessories' },
        update: {},
        create: {
          name: 'Accessories',
          slug: 'accessories',
          description: 'Bags, caps, and luxury details',
        },
      }),
    ])

    // Create sample collections
    const collections = await Promise.all([
      prisma.collection.upsert({
        where: { slug: 'platform-series' },
        update: {},
        create: {
          name: 'Platform Series',
          slug: 'platform-series',
          description: 'Elevated streetwear that puts you on another level',
          featured: true,
        },
      }),
      prisma.collection.upsert({
        where: { slug: 'dynamic-motion' },
        update: {},
        create: {
          name: 'Dynamic Motion',
          slug: 'dynamic-motion',
          description: 'Athletic-inspired pieces that blur the line between performance and style',
          featured: true,
        },
      }),
    ])

    // Create sample products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { slug: 'urban-duo-collection' },
        update: {},
        create: {
          name: 'Urban Duo Collection',
          slug: 'urban-duo-collection',
          description: 'Contemporary streetwear set featuring coordinated pieces. Perfect for the modern streetwear enthusiast who values both style and comfort.',
          price: 2000,
          images: ['/images/1d66cc_149ffeb3bc0f441aa37acb363303a407_mv2.jpg'],
          featured: true,
          inventory: 50,
          categoryId: categories[1].id, // Tops
          collectionId: collections[0].id, // Platform Series
        },
      }),
      prisma.product.upsert({
        where: { slug: 'executive-trio-collection' },
        update: {},
        create: {
          name: 'Executive Trio Collection',
          slug: 'executive-trio-collection',
          description: 'Professional streetwear for the modern individual. Where business meets street culture in perfect harmony.',
          price: 3000,
          images: ['/images/1d66cc_2cd6bfd9f3f14c02bf9bec1597481052_mv2.jpg'],
          featured: true,
          inventory: 30,
          categoryId: categories[1].id, // Tops
          collectionId: collections[0].id, // Platform Series
        },
      }),
      prisma.product.upsert({
        where: { slug: 'premium-camo-hoodie' },
        update: {},
        create: {
          name: 'Premium Camo Hoodie',
          slug: 'premium-camo-hoodie',
          description: 'Elevated camouflage design with luxury construction. Where street culture meets high-end fashion.',
          price: 1000,
          images: ['/images/1d66cc_dae82150175d4010871e43fef851f81a_mv2.jpg'],
          featured: true,
          inventory: 75,
          categoryId: categories[1].id, // Tops
          collectionId: collections[1].id, // Dynamic Motion
        },
      }),
      prisma.product.upsert({
        where: { slug: 'black-skull-cap' },
        update: {},
        create: {
          name: 'Black Skull Cap',
          slug: 'black-skull-cap',
          description: 'Premium black skull cap with COUNTERFIT branding. Crafted for those who appreciate luxury streetwear excellence.',
          price: 200,
          images: ['/images/1d66cc_770f254da8114e36a8c99b2ae2d76e57_mv2.jpg'],
          featured: true,
          inventory: 100,
          categoryId: categories[2].id, // Accessories
        },
      }),
      prisma.product.upsert({
        where: { slug: 'luxury-cream-jacket' },
        update: {},
        create: {
          name: 'Luxury Cream Jacket',
          slug: 'luxury-cream-jacket',
          description: 'Sophisticated cream-colored outerwear that embodies timeless elegance and modern streetwear aesthetics.',
          price: 1100,
          images: ['/images/1d66cc_b4b6f42d5bec4d1296ef5f4525844fb8_mv2.png'],
          featured: true,
          inventory: 40,
          categoryId: categories[0].id, // Outerwear
        },
      }),
    ])

    // Create admin user (optional - you can also do this via signup)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@counterfit.co.za'
    const adminPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
      },
    })

    console.log('✅ Database setup complete!')
    console.log(`📊 Created ${categories.length} categories`)
    console.log(`🎨 Created ${collections.length} collections`)
    console.log(`📦 Created ${products.length} products`)
    console.log(`👑 Admin user: ${adminUser.email} (password: admin123)`)
    console.log('')
    console.log('🚀 You can now:')
    console.log('1. Run: npm run dev')
    console.log('2. Visit: http://localhost:3000')
    console.log('3. Admin: http://localhost:3000/admin')
    console.log('')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
