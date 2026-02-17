import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import EmergencyTriageFlow from '../../components/ai/emergency/EmergencyTriageFlow';
import BehaviorHealthAssessment from '../../components/ai/behavior/BehaviorHealthAssessment';
import BreedIdentifier from '../../components/ai/breed/BreedIdentifier';
import BreedIdentificationTestHarness from '../../components/ai/breed/BreedIdentificationTestHarness';
import { Sparkles, AlertCircle, Stethoscope, Camera, Shield, ScanSearch, FlaskConical } from 'lucide-react';

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('emergency');
  const [showTestHarness, setShowTestHarness] = useState(false);

  // Check for developer mode via query param
  const urlParams = new URLSearchParams(window.location.search);
  const devMode = urlParams.get('dev') === 'true';

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">AI Assistant</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Get instant help with health assessments, emergency guidance, and breed identification
        </p>
      </div>

      <Alert className="mb-8">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Disclaimer:</strong> This AI assistant provides educational guidance based on rule-based logic. 
          It does not replace professional veterinary care. Always consult a licensed veterinarian for medical advice, 
          diagnosis, or treatment.
        </AlertDescription>
      </Alert>

      {devMode && (
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowTestHarness(!showTestHarness)}
            className="gap-2"
          >
            <FlaskConical className="h-4 w-4" />
            {showTestHarness ? 'Hide' : 'Show'} Test Harness
          </Button>
        </div>
      )}

      {showTestHarness && devMode && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Breed Identification Test Harness</CardTitle>
            <CardDescription>
              Developer tool for testing breed identification accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreedIdentificationTestHarness />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="emergency" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Emergency Care
          </TabsTrigger>
          <TabsTrigger value="behavior" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Health Assessment
          </TabsTrigger>
          <TabsTrigger value="breed" className="gap-2">
            <Camera className="h-4 w-4" />
            Breed Identification
          </TabsTrigger>
          <TabsTrigger value="check-breed" className="gap-2">
            <ScanSearch className="h-4 w-4" />
            Check Your Breed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Care Assistance</CardTitle>
              <CardDescription>
                Interactive triage to help you assess your pet's condition and determine the appropriate level of care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyTriageFlow />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral & Health Assessment</CardTitle>
              <CardDescription>
                Answer questions about your pet's behavior and symptoms to receive personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BehaviorHealthAssessment />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breed">
          <Card>
            <CardHeader>
              <CardTitle>Breed Identification</CardTitle>
              <CardDescription>
                Upload a photo of your pet to identify its breed and receive care recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BreedIdentifier title="Breed Identification" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="check-breed">
          <Card>
            <CardHeader>
              <CardTitle>Check Your Breed</CardTitle>
              <CardDescription>
                Upload a photo of your pet and we'll help identify its breed with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BreedIdentifier title="Check Your Breed" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
