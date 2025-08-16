const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function updateCollectionsStatus() {
  try {
    console.log('🔄 Updating all collections to draft status...')
    
    // Update all collections to have draft status
    const result = await prisma.collection.updateMany({
      where: {}, // Update all collections
      data: {
        status: 'draft'
      }
    })
    
    console.log(`✅ Successfully updated ${result.count} collections to draft status`)
    
    // Verify the changes
    const collections = await prisma.collection.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true
      }
    })
    
    console.log('\n📋 Current collections:')
    collections.forEach(collection => {
      console.log(`- ${collection.name} (${collection.slug}): ${collection.status}`)
    })
    
  } catch (error) {
    console.error('❌ Error updating collections:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCollectionsStatus()
