# COUNTERFIT PRODUCT SETUP GUIDE
*Complete Product Database Setup Instructions*

---

## 🚀 QUICK START CHECKLIST

- [ ] Create all singular jacket products
- [ ] Create pants product
- [ ] Create skull cap accessory
- [ ] Create combo packages
- [ ] Create collection packages
- [ ] Set up pricing rules
- [ ] Configure inventory tracking

---

## 🧥 SINGULAR JACKETS (R1,000 each)

### 1. Midnight Shadow Premium Jacket
- **Image**: `BLACKJACKET.jpeg`
- **Name**: "Midnight Shadow" Premium Jacket
- **Category**: jackets
- **Price**: R1,000
- **Description**: Premium black jacket with sleek design and superior craftsmanship
- **Status**: Active
- **Featured**: Yes

### 2. Arctic Frost Premium Jacket
- **Image**: `WHITEJACKET.jpeg`
- **Name**: "Arctic Frost" Premium Jacket
- **Category**: jackets
- **Price**: R1,000
- **Description**: Elegant white jacket with premium materials and modern styling
- **Status**: Active
- **Featured**: Yes

### 3. Forest Camo Premium Jacket
- **Image**: `NATUREJACKET.jpeg`
- **Name**: "Forest Camo" Premium Jacket
- **Category**: jackets
- **Price**: R1,000
- **Description**: Nature-inspired camouflage jacket with tactical design
- **Status**: Active
- **Featured**: Yes

### 4. Storm Cloud Furry Premium Jacket
- **Image**: `FURRYGREYJACKET.jpeg`
- **Name**: "Storm Cloud" Furry Premium Jacket
- **Category**: jackets
- **Price**: R1,000
- **Description**: Luxurious furry grey jacket with premium texture and comfort
- **Status**: Active
- **Featured**: Yes

### 5. Royal Crown Luxury Jacket
- **Image**: `LUXURYJACKET.jpeg`
- **Name**: "Royal Crown" Luxury Jacket
- **Category**: jackets
- **Price**: R1,200
- **Description**: Ultra-premium luxury jacket with exclusive materials and design
- **Status**: Active
- **Featured**: Yes

---

## 👖 PANTS (R500 each)

### 6. Urban Elite Premium Pants
- **Image**: `COUNTERFITPANTS.jpeg`
- **Name**: "Urban Elite" Premium Pants
- **Category**: pants
- **Price**: R500
- **Description**: Premium pants with urban streetwear aesthetic
- **Status**: Active
- **Featured**: Yes

---

## 🧢 ACCESSORIES (R200 each)

### 7. Skull King Premium Cap
- **Image**: `SKULLCAP.jpg`
- **Name**: "Skull King" Premium Cap
- **Category**: accessories
- **Price**: R200
- **Description**: Premium skull cap with distinctive design
- **Status**: Active
- **Featured**: Yes

---

## 🎯 COMBO PACKAGES

### 8. Urban Elite Jacket + Pants Combo
- **Image**: `COMBOPANTSJACKET.jpeg`
- **Name**: "Urban Elite" Jacket + Pants Combo
- **Category**: collections
- **Collection Type**: combo
- **Base Price**: R1,500
- **Customization**: Yes (any jacket + pants)
- **Max Selections**: 2
- **Product Categories**: [jackets, pants]
- **Description**: Premium jacket and pants combination with customer choice
- **Status**: Active
- **Featured**: Yes

### 9. Skull King Jacket + Cap Combo
- **Image**: `COMBOSKULLYJACKET.jpeg`
- **Name**: "Skull King" Jacket + Cap Combo
- **Category**: collections
- **Collection Type**: combo
- **Base Price**: R1,100
- **Customization**: Yes (any jacket + skull cap)
- **Max Selections**: 2
- **Product Categories**: [jackets, accessories]
- **Description**: Premium jacket and skull cap combination with customer choice
- **Status**: Active
- **Featured**: Yes

---

## 🌟 COLLECTION PACKAGES

### 10. Dynamic Duo Collection
- **Image**: `JACKETDUOCOLLECTION.jpg`
- **Name**: "Dynamic Duo" Collection
- **Category**: collections
- **Collection Type**: duo
- **Base Price**: R1,900
- **Customization**: Yes (any 2 jackets)
- **Max Selections**: 2
- **Product Categories**: [jackets]
- **Description**: Premium collection of any two jackets of customer's choice
- **Status**: Active
- **Featured**: Yes

### 11. Polar Twins Collection
- **Image**: `WHITEDUOCOLLECTION.jpg`
- **Name**: "Polar Twins" Collection
- **Category**: collections
- **Collection Type**: duo
- **Base Price**: R1,900
- **Customization**: Yes (any 2 jackets)
- **Max Selections**: 2
- **Product Categories**: [jackets]
- **Description**: Premium collection of any two jackets of customer's choice
- **Status**: Active
- **Featured**: Yes

### 12. Trinity Elite Collection
- **Image**: `TRIOCOLLECTION.jpg`
- **Name**: "Trinity Elite" Collection
- **Category**: collections
- **Collection Type**: trio
- **Base Price**: R2,700
- **Customization**: Yes (any 3 jackets)
- **Max Selections**: 3
- **Product Categories**: [jackets]
- **Description**: Premium collection of any three jackets of customer's choice
- **Status**: Active
- **Featured**: Yes

### 13. Wilderness Elite Collection
- **Image**: `DUONATURECAMOORBLACKWHITE MIX.jpeg`
- **Name**: "Wilderness Elite" Collection
- **Category**: collections
- **Collection Type**: mixed
- **Base Price**: R1,900
- **Customization**: No (pre-selected combination)
- **Max Selections**: 2
- **Product Categories**: [jackets]
- **Description**: Pre-curated combination of Nature Camo + Black/White jackets
- **Status**: Active
- **Featured**: Yes

---

## 💰 PRICING MATRIX

| Product Type | Individual Price | Combo Price | Collection Price |
|--------------|------------------|-------------|------------------|
| **Jackets** | R1,000 | - | - |
| **Luxury Jacket** | R1,200 | - | - |
| **Pants** | R500 | - | - |
| **Skull Cap** | R200 | - | - |
| **Jacket + Pants** | - | R1,500 | - |
| **Jacket + Cap** | - | R1,100 | - |
| **Duo (2 Jackets)** | - | - | R1,900 |
| **Trio (3 Jackets)** | - | - | R2,700 |
| **Mixed Collection** | - | - | R1,900 |

---

## 🎨 CUSTOMIZATION RULES

### Combo Packages
- **Jacket + Pants**: Customer selects any jacket + pants
- **Jacket + Cap**: Customer selects any jacket + skull cap
- **Price**: Fixed combo price regardless of individual item prices

### Collection Packages
- **Duo**: Customer selects any 2 jackets
- **Trio**: Customer selects any 3 jackets
- **Mixed**: Pre-selected combination (no customization)

---

## 📋 ADMIN SETUP STEPS

### Step 1: Create Individual Products
1. Go to `/admin/products/new`
2. Create each jacket, pants, and accessory product
3. Upload corresponding images
4. Set individual prices and categories

### Step 2: Create Combo Packages
1. Go to `/admin/collections/new`
2. Set collection type to "combo"
3. Enable customization
4. Set appropriate max selections
5. Select relevant product categories

### Step 3: Create Collection Packages
1. Go to `/admin/collections/new`
2. Set collection type (duo, trio, or mixed)
3. Configure customization rules
4. Set base prices
5. Select product categories

### Step 4: Configure Inventory
1. Set stock quantities for each product
2. Configure low stock alerts
3. Set up size availability
4. Test combo/collection creation

---

## 🔧 TECHNICAL NOTES

### Collection Types
- **singular**: Individual products
- **combo**: Customizable combinations
- **duo**: 2-item collections
- **trio**: 3-item collections
- **mixed**: Pre-curated combinations

### Customization Rules
- **allowCustomSelection**: Boolean for customer choice
- **maxSelections**: Maximum number of items customer can select
- **productCategories**: Array of allowed product categories

### Pricing Logic
- Individual products: Fixed prices
- Combos: Fixed combo prices
- Collections: Fixed collection prices
- No dynamic pricing based on selections

---

## 📱 FRONTEND DISPLAY

### Product Pages
- Show individual product details
- Display combo options if applicable
- Show collection membership

### Collection Pages
- Display collection type and price
- Show customization options
- List included products
- Allow product selection (if customizable)

---

*Use this guide to systematically set up all products and collections in the Counterfit system.*
