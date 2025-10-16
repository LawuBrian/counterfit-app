// Test script to understand primary image behavior
console.log('Testing primary image logic...');

// Simulate the updateImage function from ImageUpload.tsx
function updateImage(images, index, field, value) {
  console.log(`\n🔄 Updating image ${index}, field: ${field}, value: ${value}`);
  console.log('📋 Before update:', images.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'}`).join(' '));
  
  const updatedImages = images.map((img, i) => 
    i === index ? { ...img, [field]: value } : img
  );
  
  // If setting as primary, unset others
  if (field === 'isPrimary' && value) {
    console.log('🎯 Setting as primary, unsetting others...');
    updatedImages.forEach((img, i) => {
      if (i !== index) {
        console.log(`   Unsetting image ${i}`);
        img.isPrimary = false;
      }
    });
  }
  
  console.log('📋 After update:', updatedImages.map((img, i) => `${i}: ${img.isPrimary ? '⭐' : '○'}`).join(' '));
  return updatedImages;
}

// Test scenarios
console.log('\n=== Test 1: Setting first image as primary ===');
let images = [
  { url: 'image1.jpg', alt: 'Image 1', isPrimary: false },
  { url: 'image2.jpg', alt: 'Image 2', isPrimary: false },
  { url: 'image3.jpg', alt: 'Image 3', isPrimary: false }
];

images = updateImage(images, 0, 'isPrimary', true);

console.log('\n=== Test 2: Switching primary to second image ===');
images = updateImage(images, 1, 'isPrimary', true);

console.log('\n=== Test 3: Unchecking primary (should remain unchecked) ===');
images = updateImage(images, 1, 'isPrimary', false);

console.log('\n=== Test 4: Setting third image as primary ===');
images = updateImage(images, 2, 'isPrimary', true);

console.log('\n✅ Test completed');