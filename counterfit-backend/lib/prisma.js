const { PrismaClient } = require('@prisma/client')

// Create Prisma client with connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error'],
})

// Connection retry logic
let retryCount = 0
const maxRetries = 3

async function connectWithRetry() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    retryCount = 0
  } catch (error) {
    console.error(`❌ Database connection failed (attempt ${retryCount + 1}/${maxRetries}):`, error.message)
    
    if (retryCount < maxRetries) {
      retryCount++
      console.log(`🔄 Retrying connection in 5 seconds...`)
      setTimeout(connectWithRetry, 5000)
    } else {
      console.error('❌ Max retries reached. Database connection failed.')
      process.exit(1)
    }
  }
}

// Initialize connection
connectWithRetry()

// Handle connection errors gracefully
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

prisma.$on('error', (e) => {
  console.error('Prisma error:', e)
  
  // Reconnect on connection errors
  if (e.code === 'P1001' || e.code === 'P1008') {
    console.log('🔄 Connection lost, attempting to reconnect...')
    setTimeout(connectWithRetry, 5000)
  }
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

module.exports = prisma
