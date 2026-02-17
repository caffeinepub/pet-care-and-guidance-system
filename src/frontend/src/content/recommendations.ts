const careTips = [
  'Regular exercise is essential for your pet\'s physical and mental health. Aim for at least 30 minutes of activity daily.',
  'Fresh water should always be available. Change your pet\'s water bowl at least twice a day.',
  'Dental health is crucial. Brush your pet\'s teeth regularly or provide dental chews to prevent plaque buildup.',
  'Regular grooming helps detect skin issues early and strengthens your bond with your pet.',
  'Keep your pet\'s living area clean to prevent infections and maintain their overall health.',
  'Monitor your pet\'s weight regularly. Obesity can lead to serious health problems.',
  'Socialization is important for pets. Regular interaction with other animals and people builds confidence.',
  'Create a consistent routine for feeding, exercise, and sleep to help your pet feel secure.',
];

export function getDailyCareTip(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return careTips[dayOfYear % careTips.length];
}

export interface RecommendedVideo {
  title: string;
  url: string;
  category: string;
}

export function getRecommendedVideos(): RecommendedVideo[] {
  return [
    {
      title: 'Essential Pet Care Tips for Beginners',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'General Care',
    },
    {
      title: 'Understanding Pet Nutrition and Diet',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'Nutrition',
    },
    {
      title: 'How to Recognize Signs of Illness in Pets',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'Health',
    },
  ];
}
