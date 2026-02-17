import { useState } from 'react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Shield } from 'lucide-react';
import { assessBehaviorHealth } from '../../../lib/ai/behaviorHealthRules';

export default function BehaviorHealthAssessment() {
  const [species, setSpecies] = useState('');
  const [appetite, setAppetite] = useState('');
  const [activity, setActivity] = useState('');
  const [behaviorChange, setBehaviorChange] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAssess = () => {
    const assessment = assessBehaviorHealth({ species, appetite, activity, behaviorChange });
    setResult(assessment);
  };

  const handleReset = () => {
    setSpecies('');
    setAppetite('');
    setActivity('');
    setBehaviorChange('');
    setResult(null);
  };

  if (result) {
    return (
      <div className="space-y-4">
        <Card className={result.level === 'high' ? 'border-destructive' : result.level === 'medium' ? 'border-warning' : ''}>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Assessment Result</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Concern Level: {result.level.toUpperCase()}</p>
                <p className="text-muted-foreground">{result.message}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Explanation:</p>
                <p className="text-muted-foreground">{result.explanation}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Next Steps:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.nextSteps.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This assessment is based on the information provided and does not replace professional veterinary diagnosis.
          </AlertDescription>
        </Alert>

        <Button onClick={handleReset}>Start New Assessment</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pet Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger>
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="bird">Bird</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Appetite</Label>
        <Select value={appetite} onValueChange={setAppetite}>
          <SelectTrigger>
            <SelectValue placeholder="Select appetite level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="increased">Increased</SelectItem>
            <SelectItem value="decreased">Decreased</SelectItem>
            <SelectItem value="none">No appetite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Activity Level</Label>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger>
            <SelectValue placeholder="Select activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="increased">More active than usual</SelectItem>
            <SelectItem value="decreased">Less active than usual</SelectItem>
            <SelectItem value="lethargic">Very lethargic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Behavior Changes</Label>
        <Select value={behaviorChange} onValueChange={setBehaviorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select behavior changes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No changes</SelectItem>
            <SelectItem value="mild">Mild changes</SelectItem>
            <SelectItem value="moderate">Moderate changes</SelectItem>
            <SelectItem value="severe">Severe changes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleAssess} 
        disabled={!species || !appetite || !activity || !behaviorChange}
      >
        Get Assessment
      </Button>
    </div>
  );
}
