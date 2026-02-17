export interface BreedTestCase {
  id: string;
  filename: string;
  hint?: string;
  expectedBreedId: string;
  expectedBreedName: string;
  description: string;
}

export const breedTestCases: BreedTestCase[] = [
  // Persian cat tests
  {
    id: 'persian-1',
    filename: 'persian-cat.jpg',
    expectedBreedId: 'persian',
    expectedBreedName: 'Persian',
    description: 'Persian cat with standard filename',
  },
  {
    id: 'persian-2',
    filename: 'persian_cat_white.png',
    expectedBreedId: 'persian',
    expectedBreedName: 'Persian',
    description: 'Persian cat with underscores',
  },
  {
    id: 'persian-3',
    filename: 'my-persian.jpeg',
    expectedBreedId: 'persian',
    expectedBreedName: 'Persian',
    description: 'Persian cat with hyphens',
  },
  {
    id: 'persian-4',
    filename: 'IMG_1234.jpg',
    hint: 'Persian',
    expectedBreedId: 'persian',
    expectedBreedName: 'Persian',
    description: 'Generic filename with Persian hint',
  },
  {
    id: 'persian-5',
    filename: 'fluffy_cat.jpg',
    hint: 'pers',
    expectedBreedId: 'persian',
    expectedBreedName: 'Persian',
    description: 'Generic filename with partial Persian hint',
  },

  // British Shorthair tests
  {
    id: 'british-shorthair-1',
    filename: 'british-shorthair.jpg',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'British Shorthair with standard filename',
  },
  {
    id: 'british-shorthair-2',
    filename: 'british_shorthair_gray.png',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'British Shorthair with underscores',
  },
  {
    id: 'british-shorthair-3',
    filename: 'britishshorthair.jpeg',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'British Shorthair concatenated',
  },
  {
    id: 'british-shorthair-4',
    filename: 'bsh-cat.jpg',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'British Shorthair with BSH abbreviation',
  },
  {
    id: 'british-shorthair-5',
    filename: 'british.jpg',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'British Shorthair with partial keyword',
  },
  {
    id: 'british-shorthair-6',
    filename: 'shorthair.png',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'British Shorthair with shorthair keyword only',
  },
  {
    id: 'british-shorthair-7',
    filename: 'IMG_5678.jpg',
    hint: 'British Shorthair',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'Generic filename with British Shorthair hint',
  },
  {
    id: 'british-shorthair-8',
    filename: 'cat_photo.jpg',
    hint: 'bsh',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'Generic filename with BSH hint',
  },
  {
    id: 'british-shorthair-9',
    filename: 'gray_cat.jpg',
    hint: 'brit',
    expectedBreedId: 'british-shorthair',
    expectedBreedName: 'British Shorthair',
    description: 'Generic filename with partial British hint',
  },

  // Maine Coon tests
  {
    id: 'maine-coon-1',
    filename: 'maine-coon.jpg',
    expectedBreedId: 'maine-coon',
    expectedBreedName: 'Maine Coon',
    description: 'Maine Coon with standard filename',
  },
  {
    id: 'maine-coon-2',
    filename: 'mainecoon_cat.png',
    expectedBreedId: 'maine-coon',
    expectedBreedName: 'Maine Coon',
    description: 'Maine Coon concatenated',
  },
  {
    id: 'maine-coon-3',
    filename: 'big_cat.jpg',
    hint: 'Maine Coon',
    expectedBreedId: 'maine-coon',
    expectedBreedName: 'Maine Coon',
    description: 'Generic filename with Maine Coon hint',
  },

  // Golden Retriever tests
  {
    id: 'golden-retriever-1',
    filename: 'golden-retriever.jpg',
    expectedBreedId: 'golden-retriever',
    expectedBreedName: 'Golden Retriever',
    description: 'Golden Retriever with standard filename',
  },
  {
    id: 'golden-retriever-2',
    filename: 'golden_retriever_puppy.png',
    expectedBreedId: 'golden-retriever',
    expectedBreedName: 'Golden Retriever',
    description: 'Golden Retriever with underscores',
  },
  {
    id: 'golden-retriever-3',
    filename: 'goldie.jpg',
    expectedBreedId: 'golden-retriever',
    expectedBreedName: 'Golden Retriever',
    description: 'Golden Retriever with nickname',
  },
  {
    id: 'golden-retriever-4',
    filename: 'dog_photo.jpg',
    hint: 'Golden Retriever',
    expectedBreedId: 'golden-retriever',
    expectedBreedName: 'Golden Retriever',
    description: 'Generic filename with Golden Retriever hint',
  },

  // German Shepherd tests
  {
    id: 'german-shepherd-1',
    filename: 'german-shepherd.jpg',
    expectedBreedId: 'german-shepherd',
    expectedBreedName: 'German Shepherd',
    description: 'German Shepherd with standard filename',
  },
  {
    id: 'german-shepherd-2',
    filename: 'gsd.png',
    expectedBreedId: 'german-shepherd',
    expectedBreedName: 'German Shepherd',
    description: 'German Shepherd with GSD abbreviation',
  },
  {
    id: 'german-shepherd-3',
    filename: 'shepherd_dog.jpg',
    hint: 'German',
    expectedBreedId: 'german-shepherd',
    expectedBreedName: 'German Shepherd',
    description: 'Shepherd filename with German hint',
  },

  // Labrador tests
  {
    id: 'labrador-1',
    filename: 'labrador.jpg',
    expectedBreedId: 'labrador',
    expectedBreedName: 'Labrador Retriever',
    description: 'Labrador with standard filename',
  },
  {
    id: 'labrador-2',
    filename: 'lab-dog.png',
    expectedBreedId: 'labrador',
    expectedBreedName: 'Labrador Retriever',
    description: 'Labrador with Lab abbreviation',
  },
  {
    id: 'labrador-3',
    filename: 'yellow_dog.jpg',
    hint: 'Labrador',
    expectedBreedId: 'labrador',
    expectedBreedName: 'Labrador Retriever',
    description: 'Generic filename with Labrador hint',
  },
];
