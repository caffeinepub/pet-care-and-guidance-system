import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { assessEmergency } from '../../../lib/ai/emergencyTriageRules';

export default function EmergencyTriageFlow() {
  const [step, setStep] = useState(0);
  const [symptom, setSymptom] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleStart = () => {
    if (!symptom.trim()) return;
    setStep(1);
  };

  const handleComplete = () => {
    const assessment = assessEmergency(symptom, frequency, duration);
    setResult(assessment);
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setSymptom('');
    setFrequency('');
    setDuration('');
    setResult(null);
  };

  if (step === 0) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symptom">What symptoms is your pet experiencing?</Label>
          <Input
            id="symptom"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="e.g., vomiting, diarrhea, lethargy"
          />
        </div>
        <Button onClick={handleStart} disabled={!symptom.trim()}>
          Start Assessment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Symptom: <strong>{symptom}</strong>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="frequency">How many times has this occurred?</Label>
          <Input
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="e.g., 1-2 times, 5-6 times"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">How long has this been happening?</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., a few hours, since yesterday"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleComplete} disabled={!frequency.trim() || !duration.trim()}>
            Get Assessment
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={result.urgency === 'high' ? 'border-destructive' : result.urgency === 'medium' ? 'border-warning' : ''}>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Assessment Result</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Urgency Level: {result.urgency.toUpperCase()}</p>
              <p className="text-muted-foreground">{result.message}</p>
            </div>
            <div>
              <p className="font-medium mb-2">Recommended Actions:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {result.actions.map((action: string, idx: number) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          This assessment is for informational purposes only. Always consult a veterinarian for professional medical advice.
        </AlertDescription>
      </Alert>

      <Button onClick={handleReset}>Start New Assessment</Button>
    </div>
  );
}
