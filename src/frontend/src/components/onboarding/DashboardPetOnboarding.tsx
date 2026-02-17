import { useState } from 'react';
import { useSubmitOnboardingPet } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import type { Pet, Gender, PetType, Vaccination } from '../../backend';
import { VaccinationFrequency } from '../../backend';
import { stringToPetType } from '../../utils/petTypeHelpers';

interface DashboardPetOnboardingProps {
  onComplete: () => void;
}

export default function DashboardPetOnboarding({ onComplete }: DashboardPetOnboardingProps) {
  const submitPet = useSubmitOnboardingPet();

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<string>('dog');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [lastVaccinatedDate, setLastVaccinatedDate] = useState('');
  const [upcomingVaccinationName, setUpcomingVaccinationName] = useState('');
  const [upcomingVaccinationDate, setUpcomingVaccinationDate] = useState('');

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
      // Prepare gender
      let genderValue: Gender;
      if (gender === 'male') {
        genderValue = { __kind__: 'male', male: null };
      } else if (gender === 'female') {
        genderValue = { __kind__: 'female', female: null };
      } else {
        genderValue = { __kind__: 'other', other: 'Not specified' };
      }

      // Prepare pet type
      const petTypeValue: PetType = stringToPetType(petType);

      // Prepare last vaccinated date
      let lastVaccinatedTimestamp: bigint | undefined;
      if (lastVaccinatedDate) {
        const date = new Date(lastVaccinatedDate);
        lastVaccinatedTimestamp = BigInt(date.getTime() * 1_000_000);
      }

      // Prepare upcoming vaccination
      const vaccinations: Vaccination[] = [];
      if (upcomingVaccinationName && upcomingVaccinationDate) {
        const vaccinationDate = new Date(upcomingVaccinationDate);
        vaccinations.push({
          name: upcomingVaccinationName,
          dueDate: BigInt(vaccinationDate.getTime() * 1_000_000),
          reminderFrequency: VaccinationFrequency.everyYear,
          completed: false,
        });
      }

      const newPet: Pet = {
        id: BigInt(0),
        name: petName.trim(),
        petType: petTypeValue,
        breed: undefined,
        age: BigInt(parseInt(age)),
        weight: undefined,
        gender: genderValue,
        lastVaccinatedDate: lastVaccinatedTimestamp,
        vaccinations,
        photo: undefined,
      };

      await submitPet.mutateAsync(newPet);
      toast.success('Pet added successfully!');
      onComplete();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add pet';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <PawPrint className="h-6 w-6 text-primary" />
          <CardTitle>Add Your First Pet</CardTitle>
        </div>
        <CardDescription>
          Let's get started by adding your pet's information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Select value={petType} onValueChange={setPetType}>
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="lastVaccinatedDate">Last Vaccinated Date (optional)</Label>
          <Input
            id="lastVaccinatedDate"
            type="date"
            value={lastVaccinatedDate}
            onChange={(e) => setLastVaccinatedDate(e.target.value)}
          />
        </div>

        <div className="border-t pt-4 space-y-4">
          <h3 className="font-semibold text-sm">Upcoming Vaccination (optional)</h3>
          <div className="space-y-2">
            <Label htmlFor="upcomingVaccinationName">Vaccination Name</Label>
            <Input
              id="upcomingVaccinationName"
              value={upcomingVaccinationName}
              onChange={(e) => setUpcomingVaccinationName(e.target.value)}
              placeholder="e.g., Rabies, DHPP"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upcomingVaccinationDate">Due Date</Label>
            <Input
              id="upcomingVaccinationDate"
              type="date"
              value={upcomingVaccinationDate}
              onChange={(e) => setUpcomingVaccinationDate(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={submitPet.isPending} className="w-full">
          {submitPet.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Pet...
            </>
          ) : (
            'Add Pet'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
