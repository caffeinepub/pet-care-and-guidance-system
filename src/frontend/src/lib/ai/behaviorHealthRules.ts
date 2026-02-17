interface AssessmentInput {
  species: string;
  appetite: string;
  activity: string;
  behaviorChange: string;
}

export function assessBehaviorHealth(input: AssessmentInput) {
  let concernScore = 0;
  const factors: string[] = [];

  // Score appetite
  if (input.appetite === 'none') {
    concernScore += 3;
    factors.push('no appetite');
  } else if (input.appetite === 'decreased') {
    concernScore += 2;
    factors.push('decreased appetite');
  }

  // Score activity
  if (input.activity === 'lethargic') {
    concernScore += 3;
    factors.push('lethargy');
  } else if (input.activity === 'decreased') {
    concernScore += 2;
    factors.push('reduced activity');
  }

  // Score behavior changes
  if (input.behaviorChange === 'severe') {
    concernScore += 3;
    factors.push('severe behavior changes');
  } else if (input.behaviorChange === 'moderate') {
    concernScore += 2;
    factors.push('moderate behavior changes');
  } else if (input.behaviorChange === 'mild') {
    concernScore += 1;
    factors.push('mild behavior changes');
  }

  // Determine level and response
  if (concernScore >= 6) {
    return {
      level: 'high',
      message: 'Your pet is showing concerning signs that warrant immediate veterinary attention.',
      explanation: `Based on ${factors.join(', ')}, your pet may be experiencing a health issue that requires professional evaluation.`,
      nextSteps: [
        'Contact your veterinarian today',
        'Prepare a list of all symptoms and when they started',
        'Note any changes in eating, drinking, or bathroom habits',
        'Do not wait if symptoms worsen',
      ],
    };
  } else if (concernScore >= 3) {
    return {
      level: 'medium',
      message: 'Your pet is showing some concerning signs. Monitor closely and consider scheduling a vet visit.',
      explanation: `The ${factors.join(' and ')} you\'ve noted could indicate an underlying issue that should be evaluated.`,
      nextSteps: [
        'Monitor symptoms for the next 24-48 hours',
        'Keep a log of any changes',
        'Schedule a vet appointment if symptoms persist',
        'Ensure your pet has access to fresh water',
      ],
    };
  } else {
    return {
      level: 'low',
      message: 'Your pet appears to be doing relatively well, but continue to monitor.',
      explanation: factors.length > 0 
        ? `While you noted ${factors.join(' and ')}, the overall assessment suggests no immediate concern.`
        : 'No significant concerns were identified based on the information provided.',
      nextSteps: [
        'Continue normal care routine',
        'Watch for any changes in behavior or health',
        'Maintain regular vet checkups',
        'Contact your vet if you notice any worsening symptoms',
      ],
    };
  }
}
