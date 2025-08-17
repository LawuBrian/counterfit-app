const { PrismaClient } = require('@prisma/client')

// Create a global Prisma instance
let prisma

if (process.env.NODE_ENV === 'production') {
  // In production, create a single instance
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    })
  }
  prisma = global.prisma
} else {
  // In development, create a new instance for each request
  prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  })
}

// Test database connection with retry logic
async function testConnection(retries = 3, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempting database connection (${attempt}/${retries})...`)
      
      await prisma.$connect()
      console.log('✅ Prisma connected to database successfully')
      
      // Test a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`
      console.log('✅ Database query test successful:', result)
      
      return true // Connection successful
      
    } catch (error) {
      console.error(`❌ Prisma database connection failed (attempt ${attempt}/${retries}):`, error.message)
      
      if (error.code === 'P1001') {
        console.error('💡 Database connection error details:')
        console.error('   - Check if DATABASE_URL is set correctly')
        console.error('   - Verify database server is running')
        console.error('   - Check firewall/network settings')
        console.error('   - Ensure database credentials are correct')
        console.error('   - Current DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
      }
      
      if (attempt < retries) {
        console.log(`🔄 Retrying in ${delay/1000} seconds...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        console.error('❌ All connection attempts failed')
        
        // In production, exit the process if database connection fails
        if (process.env.NODE_ENV === 'production') {
          console.error('🚨 Exiting due to database connection failure in production')
          process.exit(1)
        }
        return false
      }
    }
  }
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

// Test connection on startup
testConnection()

module.exports = prisma
