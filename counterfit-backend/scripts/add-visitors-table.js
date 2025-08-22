const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addVisitorsTable() {
  try {
    console.log('🚀 Starting visitors table migration...')
    
    // Check if we're using Prisma or need to create the table manually
    try {
      // Try to query the visitors table to see if it exists
      await prisma.visitor.findFirst()
      console.log('✅ Visitors table already exists')
      return
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log('📋 Visitors table does not exist, creating...')
      } else {
        console.log('⚠️  Error checking visitors table, proceeding with creation...')
      }
    }

    // Create the visitors table using raw SQL since Prisma might not be fully set up
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS "Visitor" (
        "id" TEXT NOT NULL,
        "sessionId" TEXT NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "referrer" TEXT,
        "pageUrl" TEXT NOT NULL,
        "pageTitle" TEXT,
        "country" TEXT,
        "city" TEXT,
        "region" TEXT,
        "timezone" TEXT,
        "deviceType" TEXT,
        "browser" TEXT,
        "os" TEXT,
        "screenResolution" TEXT,
        "language" TEXT,
        "isReturning" BOOLEAN NOT NULL DEFAULT false,
        "visitDuration" INTEGER,
        "pagesViewed" INTEGER NOT NULL DEFAULT 1,
        "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "Visitor_sessionId_key" ON "Visitor"("sessionId");
    `

    await prisma.$executeRawUnsafe(createTableSQL)
    console.log('✅ Visitors table created successfully')

    // Create some sample data for testing
    const sampleVisitors = [
      {
        id: 'sample_1',
        sessionId: 'sample_session_1',
        pageUrl: '/',
        pageTitle: 'Counterfit - Home',
        deviceType: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
        country: 'South Africa',
        city: 'Johannesburg',
        timezone: 'Africa/Johannesburg',
        pagesViewed: 3,
        visitDuration: 180,
        isReturning: false
      },
      {
        id: 'sample_2',
        sessionId: 'sample_session_2',
        pageUrl: '/shop',
        pageTitle: 'Counterfit - Shop',
        deviceType: 'mobile',
        browser: 'Safari',
        os: 'iOS',
        country: 'South Africa',
        city: 'Cape Town',
        timezone: 'Africa/Johannesburg',
        pagesViewed: 1,
        visitDuration: 45,
        isReturning: true
      }
    ]

    for (const visitor of sampleVisitors) {
      try {
        await prisma.visitor.create({
          data: visitor
        })
        console.log(`✅ Created sample visitor: ${visitor.sessionId}`)
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Sample visitor ${visitor.sessionId} already exists`)
        } else {
          console.error(`❌ Error creating sample visitor ${visitor.sessionId}:`, error.message)
        }
      }
    }

    console.log('🎉 Visitors table migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during visitors table migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  addVisitorsTable()
    .then(() => {
      console.log('✅ Migration completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    })
}

module.exports = { addVisitorsTable }
