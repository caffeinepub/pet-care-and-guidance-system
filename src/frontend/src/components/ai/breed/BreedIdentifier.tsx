import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Link } from '@tanstack/react-router';
import { Upload, Info } from 'lucide-react';
import { identifyBreed } from '../../../lib/ai/breedIdentification';

interface BreedIdentifierProps {
  title?: string;
}

export default function BreedIdentifier({ title = 'Breed Identification' }: BreedIdentifierProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setResult(null); // Reset previous result
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const identification = identifyBreed(image.name, hint || undefined);
      setResult(identification);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleReset = () => {
    setImage(null);
    setPreview('');
    setResult(null);
    setHint('');
  };

  if (result) {
    return (
      <div className="space-y-4">
        {preview && (
          <div className="relative aspect-video w-full max-w-md mx-auto">
            <img src={preview} alt="Uploaded pet" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Identification Result</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Predicted Breed:</p>
                <p className="text-lg text-primary">{result.breed}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Confidence:</p>
                <p className="text-muted-foreground">{result.confidence}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Explanation:</p>
                <p className="text-muted-foreground">{result.explanation}</p>
              </div>
              {result.breedLink && (
                <Link to={result.breedLink as any}>
                  <Button variant="outline" className="w-full">
                    View Breed Information
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This identification is based on visual analysis and may not be 100% accurate. For definitive breed identification, 
            consider DNA testing or consult with a veterinarian.
          </AlertDescription>
        </Alert>

        <Button onClick={handleReset}>Analyze Another Image</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Upload Pet Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hint">Breed Hint (Optional)</Label>
        <Input
          id="hint"
          type="text"
          placeholder="e.g., British Shorthair, Persian, Golden Retriever"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Provide breed name or keywords to improve accuracy
        </p>
      </div>

      {preview && (
        <div className="relative aspect-video w-full max-w-md mx-auto">
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
        </div>
      )}

      <Button onClick={handleAnalyze} disabled={!image || isAnalyzing} className="w-full">
        {isAnalyzing ? (
          <>Analyzing...</>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Identify Breed
          </>
        )}
      </Button>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Upload a clear photo of your pet for best results. The system works best with front-facing images. 
          Adding a breed hint can significantly improve accuracy.
        </AlertDescription>
      </Alert>
    </div>
  );
}
