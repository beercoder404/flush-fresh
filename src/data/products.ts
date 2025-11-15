export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  size: string;
  category: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  image: string;
}

export const products: Product[] = [
  {
    id: "citrus-bloom",
    name: "Citrus Bloom",
    shortDescription: "Bright and refreshing citrus blend with natural essential oils",
    description: "Experience the invigorating freshness of our Citrus Bloom spray. Crafted with pure essential oils of orange, lemon, and grapefruit, this natural formula creates an invisible barrier on the water's surface, trapping odors before they escape.",
    price: 24.99,
    size: "100ml",
    category: "Citrus Collection",
    benefits: [
      "100% natural essential oils",
      "No harsh chemicals or artificial fragrances",
      "Creates invisible odor-trapping barrier",
      "Up to 200 uses per bottle",
      "Eco-friendly and biodegradable"
    ],
    ingredients: [
      "Sweet Orange Oil",
      "Lemon Essential Oil",
      "Grapefruit Extract",
      "Natural Surfactants",
      "Purified Water"
    ],
    howToUse: [
      "Shake bottle gently before use",
      "Spray 3-5 times directly into toilet bowl before use",
      "Watch the natural barrier form on the water's surface",
      "Use as needed for lasting freshness"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "lavender-fresh",
    name: "Lavender Fresh",
    shortDescription: "Calming lavender essence with hints of eucalyptus",
    description: "Indulge in the soothing aroma of our Lavender Fresh spray. This premium blend combines French lavender with eucalyptus to create a spa-like atmosphere while effectively neutralizing bathroom odors naturally.",
    price: 24.99,
    size: "100ml",
    category: "Lavender Collection",
    benefits: [
      "Pure French lavender essential oil",
      "Calming and spa-like aroma",
      "Chemical-free formula",
      "Gentle on sensitive noses",
      "Sustainable packaging"
    ],
    ingredients: [
      "French Lavender Oil",
      "Eucalyptus Essential Oil",
      "Chamomile Extract",
      "Natural Surfactants",
      "Purified Water"
    ],
    howToUse: [
      "Shake bottle gently before use",
      "Spray 3-5 times directly into toilet bowl before use",
      "Enjoy the calming lavender aroma",
      "Use daily for a spa-like bathroom experience"
    ],
    image: "/placeholder.svg"
  }
];
