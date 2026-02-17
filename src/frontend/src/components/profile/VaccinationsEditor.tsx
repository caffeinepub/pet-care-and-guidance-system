import { useState } from 'react';
import { useGetCallerUserProfile, useAddVaccination, useMarkVaccinationCompleted, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Loader2, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { PetId } from '../../backend';
import { VaccinationFrequency } from '../../backend';

export default function VaccinationsEditor() {
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const addVaccination = useAddVaccination();
  const markCompleted = useMarkVaccinationCompleted();
  const saveProfile = useSaveCallerUserProfile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [vaccinationName, setVaccinationName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState<VaccinationFrequency>(VaccinationFrequency.everyYear);

  const resetForm = () => {
    setSelectedPetId('');
    setVaccinationName('');
    setDueDate('');
    setFrequency(VaccinationFrequency.everyYear);
  };

  const ensureProfileExists = async () => {
    if (!profile) {
      await saveProfile.mutateAsync({
        name: 'User',
        email: '',
        pets: [],
        favorites: [],
      });
    }
  };

  const handleAddVaccination = async () => {
    if (!selectedPetId || !vaccinationName.trim() || !dueDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await ensureProfileExists();
      const dueDateTimestamp = BigInt(new Date(dueDate).getTime() * 1_000_000);
      await addVaccination.mutateAsync({
        petId: BigInt(selectedPetId),
        name: vaccinationName.trim(),
        dueDate: dueDateTimestamp,
        reminderFrequency: frequency,
      });
      toast.success('Vaccination added successfully');
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add vaccination';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleMarkCompleted = async (petId: PetId, vaccinationName: string) => {
    try {
      await markCompleted.mutateAsync({ petId, vaccinationName });
      toast.success('Vaccination marked as completed');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to mark vaccination as completed';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const pets = profile?.pets || [];
  const isNewProfile = isFetched && profile === null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vaccination Records</CardTitle>
            <CardDescription>Track and manage vaccination schedules</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={pets.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vaccination
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vaccination</DialogTitle>
                <DialogDescription>Schedule a new vaccination for your pet</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pet">Select Pet *</Label>
                  <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={Number(pet.id)} value={pet.id.toString()}>
                          {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vaccinationName">Vaccination Name *</Label>
                  <Input
                    id="vaccinationName"
                    value={vaccinationName}
                    onChange={(e) => setVaccinationName(e.target.value)}
                    placeholder="e.g., Rabies, DHPP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Reminder Frequency *</Label>
                  <Select value={frequency} onValueChange={(value) => setFrequency(value as VaccinationFrequency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VaccinationFrequency.everyYear}>Every Year</SelectItem>
                      <SelectItem value={VaccinationFrequency.everyThreeYears}>Every 3 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddVaccination} disabled={addVaccination.isPending || saveProfile.isPending} className="w-full">
                  {(addVaccination.isPending || saveProfile.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Vaccination'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isNewProfile && (
          <Alert className="mb-4">
            <AlertDescription>
              Please save your profile and add pets first before managing vaccinations.
            </AlertDescription>
          </Alert>
        )}
        {pets.length === 0 ? (
          <Alert>
            <AlertDescription>
              Please add a pet first before managing vaccinations.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {pets.map((pet) => (
              <div key={Number(pet.id)} className="space-y-3">
                <h4 className="font-semibold">{pet.name}</h4>
                {pet.vaccinations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No vaccinations recorded</p>
                ) : (
                  <div className="space-y-2">
                    {pet.vaccinations.map((vaccination, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{vaccination.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(Number(vaccination.dueDate) / 1_000_000).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {vaccination.completed ? (
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkCompleted(pet.id, vaccination.name)}
                              disabled={markCompleted.isPending}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
