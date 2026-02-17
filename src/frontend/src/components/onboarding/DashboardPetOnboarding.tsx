import { useState } from 'react';
import { useSubmitOnboardingPet, useAddVaccination } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { Pet, Gender } from '../../backend';
import { PetType, VaccinationFrequency } from '../../backend';

interface DashboardPetOnboardingProps {
  onComplete: () => void;
}

export default function DashboardPetOnboarding({ onComplete }: DashboardPetOnboardingProps) {
  const submitPet = useSubmitOnboardingPet();
  const addVaccination = useAddVaccination();

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<PetType>(PetType.dog);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [lastVaccinatedDate, setLastVaccinatedDate] = useState('');
  const [upcomingVaccinationDate, setUpcomingVaccinationDate] = useState('');
  const [upcomingVaccinationName, setUpcomingVaccinationName] = useState('');

  const handleSubmit = async () => {
    if (!petName.trim()) {
      toast.error('Please enter your pet\'s name');
      return;
    }

    if (!age || parseInt(age) < 0) {
      toast.error('Please enter a valid age');
      return;
    }

    try {
      const ageNum = parseInt(age) || 0;
      
      // Prepare gender
      let genderValue: Gender;
      if (gender === 'male') {
        genderValue = { __kind__: 'male', male: null };
      } else if (gender === 'female') {
        genderValue = { __kind__: 'female', female: null };
      } else {
        genderValue = { __kind__: 'other', other: 'Not specified' };
      }

      // Prepare last vaccinated date
      let lastVaccinatedTimestamp: bigint | undefined;
      if (lastVaccinatedDate) {
        const date = new Date(lastVaccinatedDate);
        lastVaccinatedTimestamp = BigInt(date.getTime() * 1_000_000); // Convert to nanoseconds
      }

      const newPet: Pet = {
        id: BigInt(0),
        name: petName.trim(),
        petType,
        breed: undefined,
        age: BigInt(ageNum),
        weight: undefined,
        gender: genderValue,
        lastVaccinatedDate: lastVaccinatedTimestamp,
        vaccinations: [],
      };

      const petId = await submitPet.mutateAsync(newPet);

      // Add upcoming vaccination if provided
      if (upcomingVaccinationDate && upcomingVaccinationName.trim()) {
        const vaccinationDate = new Date(upcomingVaccinationDate);
        const dueDate = BigInt(vaccinationDate.getTime() * 1_000_000); // Convert to nanoseconds

        await addVaccination.mutateAsync({
          petId,
          name: upcomingVaccinationName.trim(),
          dueDate,
          reminderFrequency: VaccinationFrequency.everyYear,
        });
      }

      toast.success('Pet profile created successfully!');
      onComplete();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create pet profile';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Add Your First Pet
        </CardTitle>
        <CardDescription>
          Let's get started by adding your pet's information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertDescription>
            Complete your pet's profile to unlock personalized care tips and vaccination reminders.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Pet Name *</Label>
            <Input
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Enter your pet's name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="petType">Pet Type *</Label>
            <Select value={petType} onValueChange={(value) => setPetType(value as PetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PetType.dog}>Dog</SelectItem>
                <SelectItem value={PetType.cat}>Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age (years) *</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={gender} onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastVaccinatedDate">Last Vaccinated Date</Label>
            <Input
              id="lastVaccinatedDate"
              type="date"
              value={lastVaccinatedDate}
              onChange={(e) => setLastVaccinatedDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upcomingVaccinationName">Upcoming Vaccination Name</Label>
            <Input
              id="upcomingVaccinationName"
              value={upcomingVaccinationName}
              onChange={(e) => setUpcomingVaccinationName(e.target.value)}
              placeholder="e.g., Rabies, DHPP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upcomingVaccinationDate">Upcoming Vaccination Date</Label>
            <Input
              id="upcomingVaccinationDate"
              type="date"
              value={upcomingVaccinationDate}
              onChange={(e) => setUpcomingVaccinationDate(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={submitPet.isPending || addVaccination.isPending} 
            className="w-full"
          >
            {(submitPet.isPending || addVaccination.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
