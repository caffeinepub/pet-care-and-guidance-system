export interface HealthTopic {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  immediateCare: string[];
  videos: { title: string; url: string }[];
  isEmergency?: boolean;
}

export interface HealthCategory {
  name: string;
  description: string;
  topics: HealthTopic[];
}

export const healthCatalog: Record<string, HealthCategory> = {
  grooming: {
    name: 'Grooming',
    description: 'Essential grooming tips and techniques for your pets',
    topics: [
      {
        id: 'brushing',
        name: 'Brushing & Coat Care',
        description: 'Proper brushing techniques for different coat types',
        symptoms: ['Matted fur', 'Excessive shedding', 'Dull coat'],
        causes: ['Infrequent brushing', 'Poor nutrition', 'Skin conditions'],
        prevention: ['Regular brushing schedule', 'Quality diet', 'Proper tools for coat type'],
        immediateCare: ['Gently work out small mats', 'Use detangling spray', 'Consult groomer for severe matting'],
        videos: [{ title: 'How to Brush Your Pet Properly', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
      },
      {
        id: 'nail-trimming',
        name: 'Nail Trimming',
        description: 'Safe nail trimming practices',
        symptoms: ['Overgrown nails', 'Clicking sounds when walking', 'Difficulty walking'],
        causes: ['Lack of regular trimming', 'Insufficient exercise on hard surfaces'],
        prevention: ['Trim nails every 3-4 weeks', 'Regular walks on pavement', 'Scratching posts for cats'],
        immediateCare: ['Use proper nail clippers', 'Trim small amounts', 'Have styptic powder ready'],
        videos: [{ title: 'Pet Nail Trimming Guide', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
      },
    ],
  },
  nutrition: {
    name: 'Nutrition',
    description: 'Dietary guidelines and nutritional requirements',
    topics: [
      {
        id: 'balanced-diet',
        name: 'Balanced Diet Basics',
        description: 'Understanding your pet\'s nutritional needs',
        symptoms: ['Weight loss or gain', 'Dull coat', 'Low energy', 'Digestive issues'],
        causes: ['Poor quality food', 'Incorrect portions', 'Food allergies'],
        prevention: ['High-quality pet food', 'Appropriate portions', 'Regular weight monitoring'],
        immediateCare: ['Consult vet for diet plan', 'Gradual food transitions', 'Monitor eating habits'],
        videos: [{ title: 'Pet Nutrition Essentials', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
      },
    ],
  },
  vaccination: {
    name: 'Vaccination Guidance',
    description: 'Vaccination schedules and immunization information',
    topics: [
      {
        id: 'core-vaccines',
        name: 'Core Vaccinations',
        description: 'Essential vaccines for all pets',
        symptoms: ['Due for vaccination', 'Puppy/kitten age'],
        causes: ['Age-appropriate vaccination schedule'],
        prevention: ['Follow veterinary vaccination schedule', 'Keep records updated'],
        immediateCare: ['Schedule vet appointment', 'Bring vaccination records', 'Discuss any concerns'],
        videos: [{ title: 'Understanding Pet Vaccinations', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
      },
    ],
  },
  emergency: {
    name: 'Emergency Care',
    description: 'First aid and emergency response procedures',
    topics: [
      {
        id: 'poisoning',
        name: 'Poisoning & Toxicity',
        description: 'What to do if your pet ingests something toxic',
        symptoms: ['Vomiting', 'Diarrhea', 'Seizures', 'Difficulty breathing', 'Lethargy'],
        causes: ['Ingestion of toxic substances', 'Household chemicals', 'Toxic plants', 'Human medications'],
        prevention: ['Keep toxins out of reach', 'Pet-proof your home', 'Know toxic plants'],
        immediateCare: [
          'Call veterinarian or poison control immediately',
          'Do NOT induce vomiting unless instructed',
          'Bring product packaging if possible',
          'Keep pet calm and monitor closely',
        ],
        videos: [{ title: 'Pet Poisoning Emergency Response', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
        isEmergency: true,
      },
      {
        id: 'choking',
        name: 'Choking',
        description: 'Emergency response for choking pets',
        symptoms: ['Difficulty breathing', 'Pawing at mouth', 'Blue gums', 'Panic'],
        causes: ['Foreign object in throat', 'Food lodged in airway'],
        prevention: ['Supervise eating', 'Appropriate toy sizes', 'Avoid small bones'],
        immediateCare: [
          'Check mouth for visible obstruction',
          'Perform Heimlich maneuver if trained',
          'Rush to emergency vet immediately',
          'Do not delay seeking professional help',
        ],
        videos: [{ title: 'Pet Choking First Aid', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }],
        isEmergency: true,
      },
    ],
  },
};
