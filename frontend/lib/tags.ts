// Tag configuration matching backend structure

export const genericAttributes = {
  color: [
    "White", "Ivory", "Beige",
    "Light Gray", "Dark Gray", "Black",
    "Light Yellow", "Yellow", "Turmeric",
    "Orange", "Coral", "Red", "Pink", "Hot Pink",
    "Light Green", "Green", "Olive", "Dark Olive",
    "Teal", "Khaki", "Cyan", "Sky Blue",
    "Blue", "Navy", "Lavender", "Purple",
    "Burgundy", "Camel", "Brown", "Dark Brown",
    "Magenta",
    "ETC"
  ],
  season: ["Spring", "Summer", "Fall", "Winter"],
  material: [
    "Cotton", "Polyester", "Linen", "Denim",
    "Wool", "Nylon", "Leather", "Synthetic",
    "ETC"
  ],
  pattern: [
    "Solid", "Striped", "Checked",
    "Graphic", "Printed", "Floral",
    "ETC"
  ],
  occasion: [
    "Daily", "Casual", "Formal",
    "Sports", "Party",
    "ETC"
  ]
};

export const specificAttributes: Record<string, Record<string, string[]>> = {
  upperWear: {
    neckline: [
      "Round",
      "Scoop (U)",
      "Boat",
      "V-Neck",
      "Deep-V",
      "Square",
      "Surplice",
      "Shirt Collar",
      "Stand Collar",
      "Wide Collar",
      "Mockneck",
      "Turtleneck",
      "Strapless",
      "Thick Strap",
      "Thin Strap",
      "Sweetheart",
      "Off-Shoulder",
      "Asymmetric",
      "Halter",
      "Illusion",
      "Keyhole",
      "Suit Collar",
      "ETC"
    ],
    sleeveLength: [
      "Sleeveless",
      "Cap Sleeve",
      "Short Sleeve",
      "3/4 Sleeve",
      "Long Sleeve",
      "ETC"
    ],
    topLength: [
      "Crop",
      "Waist",
      "Hip",
      "Knee",
      "ETC"
    ]
  },
  bottomWear: {
    fit: ["Slim", "Regular", "Relaxed", "Skinny", "Baggy", "ETC"],
    length: ["Above Knee", "Knee Length", "Ankle", "Full", "ETC"],
    rise: ["Low Rise", "Mid Rise", "High Rise", "ETC"]
  },
  outerWear: {
    thickness: ["Lightweight", "Midweight", "Heavy", "ETC"]
  },
  footwear: {
    usageType: ["Casual", "Formal", "Sports", "Daily", "ETC"]
  },
  otherItems: {
    attributes: []
  }
};

export const categoryGroups = {
  upperWear: {
    label: "Upper Wear",
    categories: [
      "T-Shirt",
      "Long Sleeve T-Shirt",
      "Sleeveless T-Shirt",
      "Polo Shirt",
      "Tank Top",
      "Cami Top",
      "Crop Top",
      "Blouse",
      "Shirt",
      "Casual Shirt",
      "Formal Shirt",
      "Sweatshirt",
      "Hoodie",
      "Sweater",
      "Sweater Vest",
      "Cardigan",
      "Sports Top",
      "Bodysuit",
      "Kurti",
      "ETC"
    ]
  },
  bottomWear: {
    label: "Bottom Wear",
    categories: [
      "Jeans",
      "Trousers",
      "Shorts",
      "Joggers",
      "Track Pants",
      "Chinos",
      "Cargo Pants",
      "Skirt",
      "Leggings",
      "Formal Pants",
      "ETC"
    ]
  },
  outerWear: {
    label: "Outer Wear",
    categories: [
      "Jacket",
      "Denim Jacket",
      "Hooded Jacket",
      "Bomber Jacket",
      "Coat",
      "Blazer",
      "Overcoat",
      "Sweater Jacket",
      "ETC"
    ]
  },
  footwear: {
    label: "Footwear",
    categories: [
      "Sneakers",
      "Running Shoes",
      "Loafers",
      "Sandals",
      "Slippers",
      "Boots",
      "Ethnic Footwear",
      "Formal Shoes",
      "ETC"
    ]
  },
  otherItems: {
    label: "Other Items",
    categories: [
      "Underwear",
      "Homewear",
      "Beachwear",
      "Co-ords",
      "Hair Accessories",
      "Eyewear",
      "Ties",
      "Scarves",
      "Mufflers",
      "Watches",
      "Gloves",
      "Belts",
      "Socks",
      "Tights",
      "Wallets & Purses",
      "Other Accessories",
      "Traditional Wear",
      "ETC"
    ]
  }
};

