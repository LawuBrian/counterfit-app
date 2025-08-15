const mongoose = require('mongoose');
const Collection = require('../models/Collection');
require('dotenv').config();

const collections = [
  {
    name: "Platform Series",
    description: "Elevated streetwear that puts you on another level. Clean lines, premium materials, and statement silhouettes that define modern luxury streetwear.",
    shortDescription: "Elevated streetwear with premium materials and clean lines.",
    image: {
      url: "/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png",
      alt: "Platform Series Collection"
    },
    banner: {
      url: "/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png",
      alt: "Platform Series Banner"
    },
    badge: {
      text: "Signature",
      color: "#000000"
    },
    status: "active",
    featured: true,
    sortOrder: 1,
    visibility: "public",
    seo: {
      title: "Platform Series - Elevated Streetwear | Counterfit",
      description: "Discover our Platform Series collection featuring elevated streetwear with premium materials and clean lines.",
      keywords: ["streetwear", "platform", "luxury", "elevated", "premium"]
    }
  },
  {
    name: "Dynamic Motion",
    description: "For those who move with purpose. Athletic-inspired pieces that blur the line between performance and style, designed for the modern urban explorer.",
    shortDescription: "Athletic luxury for those who move with purpose.",
    image: {
      url: "/images/1d66cc_19a0f6de460743f18fef591c43ae2592_mv2.png",
      alt: "Dynamic Motion Collection"
    },
    banner: {
      url: "/images/1d66cc_19a0f6de460743f18fef591c43ae2592_mv2.png",
      alt: "Dynamic Motion Banner"
    },
    badge: {
      text: "Performance",
      color: "#000000"
    },
    status: "active",
    featured: true,
    sortOrder: 2,
    visibility: "public",
    seo: {
      title: "Dynamic Motion - Athletic Luxury | Counterfit",
      description: "Athletic-inspired streetwear that blurs the line between performance and style.",
      keywords: ["athletic", "motion", "performance", "streetwear", "luxury"]
    }
  },
  {
    name: "Urban Explorer",
    description: "Bold patterns and textures for the modern adventurer. Pieces that make a statement without saying a word, designed for those who dare to be different.",
    shortDescription: "Bold patterns for the modern urban adventurer.",
    image: {
      url: "/images/1d66cc_cde498cebe1e46d6a5caf466f6343ed9_mv2.png",
      alt: "Urban Explorer Collection"
    },
    banner: {
      url: "/images/1d66cc_cde498cebe1e46d6a5caf466f6343ed9_mv2.png",
      alt: "Urban Explorer Banner"
    },
    badge: {
      text: "Limited",
      color: "#000000"
    },
    status: "active",
    featured: false,
    sortOrder: 3,
    visibility: "public",
    seo: {
      title: "Urban Explorer - Bold Streetwear | Counterfit",
      description: "Bold patterns and textures for the modern adventurer. Statement pieces for those who dare to be different.",
      keywords: ["urban", "explorer", "bold", "patterns", "streetwear"]
    }
  },
  {
    name: "Spotlight Series",
    description: "For those who command attention. Premium pieces designed for moments that matter, crafted with exceptional attention to detail.",
    shortDescription: "Premium pieces for those who command attention.",
    image: {
      url: "/images/1d66cc_aec60f7b500c482397c35ad1f0ff735e_mv2.png",
      alt: "Spotlight Series Collection"
    },
    banner: {
      url: "/images/1d66cc_aec60f7b500c482397c35ad1f0ff735e_mv2.png",
      alt: "Spotlight Series Banner"
    },
    badge: {
      text: "Premium",
      color: "#000000"
    },
    status: "active",
    featured: false,
    sortOrder: 4,
    visibility: "public",
    seo: {
      title: "Spotlight Series - Premium Streetwear | Counterfit",
      description: "Premium pieces designed for moments that matter, crafted with exceptional attention to detail.",
      keywords: ["spotlight", "premium", "attention", "detail", "streetwear"]
    }
  },
  {
    name: "Retro Athletics",
    description: "Classic athletic aesthetics reimagined for today. Vintage-inspired pieces with modern construction and contemporary fits.",
    shortDescription: "Classic athletic aesthetics reimagined for today.",
    image: {
      url: "/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png",
      alt: "Retro Athletics Collection"
    },
    banner: {
      url: "/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png",
      alt: "Retro Athletics Banner"
    },
    badge: {
      text: "Heritage",
      color: "#000000"
    },
    status: "active",
    featured: false,
    sortOrder: 5,
    visibility: "public",
    seo: {
      title: "Retro Athletics - Heritage Streetwear | Counterfit",
      description: "Classic athletic aesthetics reimagined for today with vintage-inspired pieces and modern construction.",
      keywords: ["retro", "athletics", "vintage", "heritage", "streetwear"]
    }
  }
];

async function seedCollections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections
    await Collection.deleteMany({});
    console.log('Cleared existing collections');

    // Insert new collections
    const createdCollections = await Collection.insertMany(collections);
    console.log(`Created ${createdCollections.length} collections:`);
    createdCollections.forEach(collection => {
      console.log(`- ${collection.name} (${collection.slug})`);
    });

    console.log('Collections seeded successfully!');
  } catch (error) {
    console.error('Error seeding collections:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedCollections();
