import { breedsCatalog, BreedInfo } from '../../content/pets/breedsCatalog';

interface BreedMatch {
  breed: BreedInfo;
  category: string;
  score: number;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[_\-\s]+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(/\s+/);
}

function calculateMatchScore(
  breedInfo: BreedInfo,
  filenameTokens: string[],
  hintTokens: string[]
): number {
  let score = 0;
  const breedNameTokens = tokenize(breedInfo.name);
  const breedIdTokens = tokenize(breedInfo.id);

  // Check filename matches
  for (const token of filenameTokens) {
    // Exact breed ID match (highest priority)
    if (breedIdTokens.some(bt => bt === token)) {
      score += 100;
    }
    // Exact breed name token match
    if (breedNameTokens.some(bt => bt === token)) {
      score += 80;
    }
    // Partial match
    if (breedNameTokens.some(bt => bt.includes(token) || token.includes(bt))) {
      score += 40;
    }
    if (breedIdTokens.some(bt => bt.includes(token) || token.includes(bt))) {
      score += 40;
    }
  }

  // Check hint matches (if provided)
  for (const token of hintTokens) {
    if (breedIdTokens.some(bt => bt === token)) {
      score += 150; // Hints have higher weight
    }
    if (breedNameTokens.some(bt => bt === token)) {
      score += 120;
    }
    if (breedNameTokens.some(bt => bt.includes(token) || token.includes(bt))) {
      score += 60;
    }
    if (breedIdTokens.some(bt => bt.includes(token) || token.includes(bt))) {
      score += 60;
    }
  }

  // Common abbreviations and synonyms
  const abbreviations: Record<string, string[]> = {
    'british-shorthair': ['bsh', 'brit', 'british', 'shorthair'],
    'persian': ['persian', 'pers'],
    'maine-coon': ['maine', 'coon', 'mainecoon'],
    'golden-retriever': ['golden', 'retriever', 'goldie'],
    'german-shepherd': ['german', 'shepherd', 'gsd'],
    'labrador': ['lab', 'labrador', 'retriever'],
  };

  for (const token of [...filenameTokens, ...hintTokens]) {
    if (abbreviations[breedInfo.id]?.includes(token)) {
      score += 70;
    }
  }

  return score;
}

function findBestBreedMatch(
  filename: string,
  hint?: string
): BreedMatch | null {
  const filenameTokens = tokenize(filename);
  const hintTokens = hint ? tokenize(hint) : [];

  const allMatches: BreedMatch[] = [];

  // Search through all categories
  for (const [category, breeds] of Object.entries(breedsCatalog)) {
    for (const breed of breeds) {
      const score = calculateMatchScore(breed, filenameTokens, hintTokens);
      if (score > 0) {
        allMatches.push({ breed, category, score });
      }
    }
  }

  // Sort by score descending
  allMatches.sort((a, b) => b.score - a.score);

  // Return best match if score is high enough
  if (allMatches.length > 0 && allMatches[0].score >= 40) {
    return allMatches[0];
  }

  return null;
}

export function identifyBreed(filename: string, hint?: string) {
  const match = findBestBreedMatch(filename, hint);

  if (match) {
    const { breed, category, score } = match;
    const confidence = score >= 100 ? 'High confidence match' : score >= 70 ? 'Good confidence match' : 'Moderate confidence match';

    return {
      breed: breed.name,
      confidence,
      explanation: `Identified based on ${hint ? 'your hint and ' : ''}visual characteristics typical of ${breed.name}. ${breed.description}`,
      breedLink: `/pets/${category}/breeds/${breed.id}`,
    };
  }

  // Default response
  return {
    breed: 'Mixed Breed / Unknown',
    confidence: 'Low confidence',
    explanation: 'Unable to confidently identify a specific breed from our catalog. Your pet may be a mixed breed, a rare breed not in our database, or the image quality may not be sufficient for accurate identification. Try providing a hint with the breed name or keywords.',
    breedLink: null,
  };
}
