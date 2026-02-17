export interface PetInfo {
  id: string;
  name: string;
  description: string;
  care: string[];
  imageUrl?: string;
  videos: { title: string; url: string }[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  pets: PetInfo[];
}

export interface CategoryData {
  name: string;
  description: string;
  hasBreeds?: boolean;
  subcategories?: Subcategory[];
}

export const petsCatalog: Record<string, CategoryData> = {
  cat: {
    name: 'Cats',
    description: 'Comprehensive information about cats, their breeds, and care requirements',
    hasBreeds: true,
  },
  dog: {
    name: 'Dogs',
    description: 'Everything you need to know about dogs, breeds, and proper care',
    hasBreeds: true,
  },
  bird: {
    name: 'Birds',
    description: 'Bird care guides including parrots and other avian species',
    hasBreeds: true,
  },
  other: {
    name: 'Other Pets',
    description: 'Explore a wide variety of unique and exotic pets',
    subcategories: [
      {
        id: 'small-mammals',
        name: 'Small Mammals',
        description: 'Rabbits, hamsters, guinea pigs, and more',
        pets: [
          {
            id: 'rabbit',
            name: 'Rabbit',
            description: 'Social and intelligent pets that require spacious housing and a diet rich in hay.',
            care: ['Provide unlimited hay', 'Fresh vegetables daily', 'Regular grooming', 'Spacious enclosure'],
            videos: [{ title: 'Complete Rabbit Care Guide', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'hamster',
            name: 'Hamster',
            description: 'Small, nocturnal rodents that are popular first pets for children.',
            care: ['Clean cage weekly', 'Provide exercise wheel', 'Fresh water daily', 'Balanced pellet diet'],
            videos: [{ title: 'Hamster Care Basics', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
          {
            id: 'guinea-pig',
            name: 'Guinea Pig',
            description: 'Gentle, social animals that thrive in pairs or groups.',
            care: ['Vitamin C supplementation', 'Large cage space', 'Daily vegetables', 'Social interaction'],
            videos: [{ title: 'Guinea Pig Care Guide', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'chinchilla',
            name: 'Chinchilla',
            description: 'Soft-furred rodents that require dust baths and cool temperatures.',
            care: ['Dust baths 2-3 times weekly', 'Keep cool (below 75°F)', 'Hay-based diet', 'Large multi-level cage'],
            videos: [{ title: 'Chinchilla Care Essentials', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
          {
            id: 'gerbil',
            name: 'Gerbil',
            description: 'Active, social rodents that love to dig and burrow.',
            care: ['Deep bedding for burrowing', 'Keep in pairs', 'Exercise wheel', 'Seed and pellet mix'],
            videos: [{ title: 'Gerbil Care Guide', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'ferret',
            name: 'Ferret',
            description: 'Playful, curious carnivores that need lots of interaction.',
            care: ['Daily playtime', 'High-protein diet', 'Ferret-proof home', 'Regular vet checkups'],
            videos: [{ title: 'Ferret Care and Training', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
          {
            id: 'rat',
            name: 'Rat',
            description: 'Intelligent, social rodents that make affectionate pets.',
            care: ['Keep in pairs or groups', 'Large cage with toys', 'Daily handling', 'Varied diet'],
            videos: [{ title: 'Pet Rat Care Guide', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'mouse',
            name: 'Mouse',
            description: 'Small, active rodents that are easy to care for.',
            care: ['Clean cage regularly', 'Provide hiding spots', 'Balanced pellet diet', 'Exercise opportunities'],
            videos: [{ title: 'Mouse Care Basics', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
          {
            id: 'hedgehog',
            name: 'Hedgehog',
            description: 'Nocturnal insectivores with spiny coats.',
            care: ['Keep warm (72-80°F)', 'Insect-based diet', 'Exercise wheel', 'Regular nail trimming'],
            videos: [{ title: 'Hedgehog Care Guide', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'sugar-glider',
            name: 'Sugar Glider',
            description: 'Small marsupials that glide and bond strongly with owners.',
            care: ['Keep in pairs', 'Specialized diet', 'Large tall cage', 'Daily bonding time'],
            videos: [{ title: 'Sugar Glider Care Essentials', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
        ],
      },
      {
        id: 'aquatic',
        name: 'Aquatic Pets',
        description: 'Fish and other water-dwelling creatures',
        pets: [
          {
            id: 'goldfish',
            name: 'Goldfish',
            description: 'Hardy freshwater fish suitable for beginners.',
            care: ['Proper tank size (20+ gallons)', 'Regular water changes', 'Quality filtration', 'Balanced diet'],
            videos: [{ title: 'Goldfish Care for Beginners', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'betta',
            name: 'Betta Fish',
            description: 'Colorful, territorial fish with flowing fins.',
            care: ['Minimum 5-gallon tank', 'Heated water (78-80°F)', 'Gentle filtration', 'Varied diet'],
            videos: [{ title: 'Betta Fish Complete Care', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
          {
            id: 'guppy',
            name: 'Guppy',
            description: 'Small, colorful livebearers that are easy to breed.',
            care: ['10+ gallon tank', 'Tropical temperature', 'Plants for hiding', 'Flake food'],
            videos: [{ title: 'Guppy Care Guide', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'tetra',
            name: 'Tetra',
            description: 'Small schooling fish available in many varieties.',
            care: ['Keep in schools of 6+', 'Planted tank', 'Stable water parameters', 'Small pellets or flakes'],
            videos: [{ title: 'Tetra Care Essentials', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
          {
            id: 'angelfish',
            name: 'Angelfish',
            description: 'Elegant freshwater fish with tall, triangular bodies.',
            care: ['Tall tank (20+ gallons)', 'Warm water', 'Peaceful tankmates', 'Varied diet'],
            videos: [{ title: 'Angelfish Care Guide', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'molly',
            name: 'Molly',
            description: 'Hardy livebearers that come in many colors.',
            care: ['10+ gallon tank', 'Slightly alkaline water', 'Vegetable matter in diet', 'Social groups'],
            videos: [{ title: 'Molly Fish Care', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
          {
            id: 'platy',
            name: 'Platy',
            description: 'Peaceful, colorful livebearers perfect for community tanks.',
            care: ['10+ gallon tank', 'Tropical temperature', 'Varied diet', 'Keep in groups'],
            videos: [{ title: 'Platy Care Guide', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'corydoras',
            name: 'Corydoras Catfish',
            description: 'Bottom-dwelling catfish that help keep tanks clean.',
            care: ['Soft substrate', 'Keep in groups', 'Sinking pellets', 'Peaceful tankmates'],
            videos: [{ title: 'Corydoras Care Essentials', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
          {
            id: 'axolotl',
            name: 'Axolotl',
            description: 'Aquatic salamanders with external gills and regenerative abilities.',
            care: ['Cold water (60-64°F)', 'No gravel substrate', 'Carnivorous diet', 'Gentle filtration'],
            videos: [{ title: 'Axolotl Care Guide', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'shrimp',
            name: 'Freshwater Shrimp',
            description: 'Small invertebrates that help maintain aquarium cleanliness.',
            care: ['Stable water parameters', 'Planted tank', 'Algae and biofilm', 'Avoid copper'],
            videos: [{ title: 'Freshwater Shrimp Care', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
        ],
      },
      {
        id: 'reptiles',
        name: 'Reptiles',
        description: 'Turtles, lizards, snakes, and more',
        pets: [
          {
            id: 'turtle',
            name: 'Turtle / Tortoise',
            description: 'Long-lived reptiles requiring specific habitat conditions.',
            care: ['UVB lighting', 'Proper temperature gradient', 'Varied diet', 'Large enclosure'],
            videos: [{ title: 'Turtle Care Essentials', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'bearded-dragon',
            name: 'Bearded Dragon',
            description: 'Popular, docile lizards that make great pets.',
            care: ['UVB and heat lamps', 'Insects and vegetables', 'Regular handling', '40+ gallon tank'],
            videos: [{ title: 'Bearded Dragon Care Guide', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
          {
            id: 'leopard-gecko',
            name: 'Leopard Gecko',
            description: 'Hardy, docile geckos perfect for beginners.',
            care: ['Heat mat', 'Calcium supplementation', 'Live insects', 'Hide boxes'],
            videos: [{ title: 'Leopard Gecko Care', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'crested-gecko',
            name: 'Crested Gecko',
            description: 'Arboreal geckos with easy care requirements.',
            care: ['Vertical enclosure', 'Room temperature', 'Fruit-based diet', 'High humidity'],
            videos: [{ title: 'Crested Gecko Care Guide', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
          {
            id: 'ball-python',
            name: 'Ball Python',
            description: 'Docile snakes that are popular for beginners.',
            care: ['Heat gradient', 'Hide boxes', 'Frozen-thawed rodents', 'Proper humidity'],
            videos: [{ title: 'Ball Python Care Essentials', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'corn-snake',
            name: 'Corn Snake',
            description: 'Hardy, colorful snakes perfect for beginners.',
            care: ['Heat gradient', 'Secure enclosure', 'Frozen-thawed mice', 'Regular handling'],
            videos: [{ title: 'Corn Snake Care Guide', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
          {
            id: 'blue-tongue-skink',
            name: 'Blue-Tongue Skink',
            description: 'Large, docile lizards with distinctive blue tongues.',
            care: ['Large enclosure', 'UVB lighting', 'Omnivorous diet', 'Moderate humidity'],
            videos: [{ title: 'Blue-Tongue Skink Care', url: 'https://www.youtube.com/watch?v=aZRV7jPvqIo' }],
          },
          {
            id: 'chameleon',
            name: 'Chameleon',
            description: 'Color-changing lizards requiring advanced care.',
            care: ['Screen enclosure', 'Live plants', 'Live insects', 'High humidity'],
            videos: [{ title: 'Chameleon Care Guide', url: 'https://www.youtube.com/watch?v=Yz_K8Gx6eoQ' }],
          },
          {
            id: 'iguana',
            name: 'Iguana',
            description: 'Large herbivorous lizards requiring spacious enclosures.',
            care: ['Very large enclosure', 'UVB lighting', 'Vegetarian diet', 'High humidity'],
            videos: [{ title: 'Iguana Care Essentials', url: 'https://www.youtube.com/watch?v=8pU0kF_NSRI' }],
          },
          {
            id: 'red-eared-slider',
            name: 'Red-Eared Slider',
            description: 'Popular aquatic turtles with distinctive red markings.',
            care: ['Large aquarium', 'Basking area', 'UVB lighting', 'Omnivorous diet'],
            videos: [{ title: 'Red-Eared Slider Care', url: 'https://www.youtube.com/watch?v=JFtB_9aW0bg' }],
          },
        ],
      },
    ],
  },
};
