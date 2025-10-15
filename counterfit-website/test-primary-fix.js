// Test the primary image fix logic
console.log('🧪 Testing Primary Image Fix Logic\n');

// Simulate the validation function
const validateImages = (imageList) => {
  const primaryCount = imageList.filter(img => img.isPrimary).length
  if (primaryCount === 0 && imageList.length > 0) {
    console.warn('⚠️ No primary image found, setting first image as primary')
    imageList[0].isPrimary = true
  } else if (primaryCount > 1) {
    console.warn(`⚠️ Multiple primary images found (${primaryCount}), keeping only the first one`)
    let foundFirst = false
    imageList.forEach(img => {
      if (img.isPrimary && !foundFirst) {
        foundFirst = true
      } else if (img.isPrimary) {
        img.isPrimary = false
      }
    })
  }
  return imageList
}

// Simulate the updateImage function
const updateImage = (images, index, field, value) => {
  console.log(`🔄 Updating image ${index}, field: ${field}, value: ${value}`)
  console.log('📋 Before:', images.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'}`).join(' '))
  
  // Create a deep copy
  const updatedImages = images.map((img, i) => ({
    url: img.url,
    alt: img.alt,
    isPrimary: img.isPrimary,
    ...(i === index ? { [field]: value } : {})
  }))
  
  // If setting as primary, unset others
  if (field === 'isPrimary' && value === true) {
    console.log('🎯 Setting as primary, unsetting others...')
    updatedImages.forEach((img, i) => {
      if (i !== index && img.isPrimary) {
        console.log(`   Unsetting image ${i}`)
        img.isPrimary = false
      }
    })
  }
  
  // Validate and fix any issues
  const validatedImages = validateImages(updatedImages)
  
  console.log('📋 After:', validatedImages.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'}`).join(' '))
  return validatedImages
}

// Test scenarios
console.log('=== Test 1: Initial upload with no primary ===')
let images = [
  { url: 'image1.jpg', alt: 'Image 1', isPrimary: false },
  { url: 'image2.jpg', alt: 'Image 2', isPrimary: false },
  { url: 'image3.jpg', alt: 'Image 3', isPrimary: false }
]
images = validateImages(images)

console.log('\n=== Test 2: Setting second image as primary ===')
images = updateImage(images, 1, 'isPrimary', true)

console.log('\n=== Test 3: Switching to third image ===')
images = updateImage(images, 2, 'isPrimary', true)

console.log('\n=== Test 4: Multiple primaries (should fix automatically) ===')
images = [
  { url: 'image1.jpg', alt: 'Image 1', isPrimary: true },
  { url: 'image2.jpg', alt: 'Image 2', isPrimary: true },
  { url: 'image3.jpg', alt: 'Image 3', isPrimary: false }
]
images = validateImages(images)

console.log('\n=== Test 5: No primaries (should fix automatically) ===')
images = [
  { url: 'image1.jpg', alt: 'Image 1', isPrimary: false },
  { url: 'image2.jpg', alt: 'Image 2', isPrimary: false },
  { url: 'image3.jpg', alt: 'Image 3', isPrimary: false }
]
images = validateImages(images)

console.log('\n✅ All tests completed!');