export function assessEmergency(symptom: string, frequency: string, duration: string) {
  const symptomLower = symptom.toLowerCase();
  const frequencyNum = parseInt(frequency) || 0;

  // High urgency conditions
  if (
    symptomLower.includes('seizure') ||
    symptomLower.includes('bleeding') ||
    symptomLower.includes('unconscious') ||
    symptomLower.includes('difficulty breathing') ||
    symptomLower.includes('choking') ||
    frequencyNum >= 5
  ) {
    return {
      urgency: 'high',
      message: 'This is a potential emergency. Seek veterinary care immediately.',
      actions: [
        'Contact your veterinarian or emergency vet clinic right away',
        'Do not wait - transport your pet to the clinic immediately',
        'Keep your pet calm and comfortable during transport',
        'Bring any relevant medical records or medications',
      ],
    };
  }

  // Medium urgency
  if (
    frequencyNum >= 3 ||
    symptomLower.includes('vomit') ||
    symptomLower.includes('diarrhea') ||
    symptomLower.includes('lethargy')
  ) {
    return {
      urgency: 'medium',
      message: 'Monitor your pet closely and contact your veterinarian if symptoms worsen.',
      actions: [
        'Monitor your pet closely for the next 24 hours',
        'Ensure fresh water is available',
        'Withhold food for 12 hours if vomiting',
        'Contact vet if symptoms persist or worsen',
        'Seek immediate care if condition deteriorates',
      ],
    };
  }

  // Low urgency
  return {
    urgency: 'low',
    message: 'Continue to monitor your pet. If symptoms persist or worsen, consult your veterinarian.',
    actions: [
      'Keep a log of symptoms and frequency',
      'Ensure your pet stays hydrated',
      'Maintain normal feeding schedule unless advised otherwise',
      'Schedule a vet appointment if symptoms continue for more than 24-48 hours',
    ],
  };
}
