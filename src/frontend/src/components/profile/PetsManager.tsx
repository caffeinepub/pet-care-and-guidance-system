import { useState } from 'react';
import { useGetCallerUserProfile, useAddPet, useUpdatePet, useRemovePet, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2, Plus, Trash2, Edit, PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import BlobImageUploader from '../admin/BlobImageUploader';
import type { Pet, Gender, PetType, ExternalBlob } from '../../backend';
import { petTypeToString, stringToPetType, getPetTypeDisplayName } from '../../utils/petTypeHelpers';

export default function PetsManager() {
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const addPet = useAddPet();
  const updatePet = useUpdatePet();
  const removePet = useRemovePet();
  const saveProfile = useSaveCallerUserProfile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<string>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [lastVaccinatedDate, setLastVaccinatedDate] = useState('');
  const [petPhoto, setPetPhoto] = useState<ExternalBlob | undefined>(undefined);
  const [petPhotoUrl, setPetPhotoUrl] = useState<string | undefined>(undefined);
  const [photoCleared, setPhotoCleared] = useState(false);

  const resetForm = () => {
    setPetName('');
    setPetType('dog');
    setBreed('');
    setAge('');
    setGender('male');
    setLastVaccinatedDate('');
    setPetPhoto(undefined);
    setPetPhotoUrl(undefined);
    setPhotoCleared(false);
    setEditingPet(null);
  };

  const handleOpenDialog = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet);
      setPetName(pet.name);
      setPetType(petTypeToString(pet.petType));
      setBreed(pet.breed || '');
      setAge(pet.age.toString());
      
      // Set gender
      if (pet.gender.__kind__ === 'male') {
        setGender('male');
      } else if (pet.gender.__kind__ === 'female') {
        setGender('female');
      } else {
        setGender('other');
      }

      // Set last vaccinated date
      if (pet.lastVaccinatedDate) {
        const date = new Date(Number(pet.lastVaccinatedDate) / 1_000_000);
        setLastVaccinatedDate(date.toISOString().split('T')[0]);
      } else {
        setLastVaccinatedDate('');
      }

      // Set pet photo
      setPetPhoto(pet.photo);
      setPetPhotoUrl(pet.photo?.getDirectURL());
      setPhotoCleared(false);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handlePhotoSelected = (blob: ExternalBlob) => {
    setPetPhoto(blob);
    setPhotoCleared(false);
  };

  const handlePhotoCleared = () => {
    setPetPhoto(undefined);
    setPetPhotoUrl(undefined);
    setPhotoCleared(true);
  };

  const ensureProfileExists = async () => {
    if (!profile) {
      // Create a minimal profile first
      await saveProfile.mutateAsync({
        name: 'User',
        email: '',
        pets: [],
        favorites: [],
      });
    }
  };

  const handleSavePet = async () => {
    if (!petName.trim()) {
      toast.error('Please enter a pet name');
      return;
    }

    const ageNum = parseInt(age) || 0;

    try {
      // Ensure profile exists before adding pet
      await ensureProfileExists();

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
        lastVaccinatedTimestamp = BigInt(date.getTime() * 1_000_000); // Convert to nanoseconds
      }

      if (editingPet) {
        await updatePet.mutateAsync({
          petId: editingPet.id,
          updatedPet: {
            ...editingPet,
            name: petName.trim(),
            petType: petTypeValue,
            breed: breed.trim() || undefined,
            age: BigInt(ageNum),
            gender: genderValue,
            lastVaccinatedDate: lastVaccinatedTimestamp,
            photo: photoCleared ? undefined : petPhoto,
          },
        });
        toast.success('Pet updated successfully');
      } else {
        const newPet: Pet = {
          id: BigInt(0),
          name: petName.trim(),
          petType: petTypeValue,
          breed: breed.trim() || undefined,
          age: BigInt(ageNum),
          weight: undefined,
          gender: genderValue,
          lastVaccinatedDate: lastVaccinatedTimestamp,
          vaccinations: [],
          photo: petPhoto,
        };
        await addPet.mutateAsync(newPet);
        toast.success('Pet added successfully');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || (editingPet ? 'Failed to update pet' : 'Failed to add pet');
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleRemovePet = async (petId: bigint) => {
    if (!confirm('Are you sure you want to remove this pet?')) return;

    try {
      await removePet.mutateAsync(petId);
      toast.success('Pet removed successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to remove pet';
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
            <CardTitle>Your Pets</CardTitle>
            <CardDescription>Add and manage your pet profiles</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
                <DialogDescription>
                  {editingPet ? 'Update your pet information' : 'Add a new pet to your profile'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Pet Photo Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Pet Photo</h3>
                  </div>
                  <BlobImageUploader
                    label="Upload your pet's photo"
                    currentImageUrl={petPhotoUrl}
                    onImageSelected={handlePhotoSelected}
                    onImageCleared={handlePhotoCleared}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petName">Pet Name *</Label>
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Enter pet name"
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
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Enter breed (optional)"
                  />
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
                <Button onClick={handleSavePet} disabled={addPet.isPending || updatePet.isPending || saveProfile.isPending} className="w-full">
                  {(addPet.isPending || updatePet.isPending || saveProfile.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{editingPet ? 'Update Pet' : 'Add Pet'}</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isNewProfile && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Create your profile first to add pets</p>
          </div>
        )}
        {!isNewProfile && pets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pets added yet. Click "Add Pet" to get started!</p>
          </div>
        )}
        {pets.length > 0 && (
          <div className="space-y-4">
            {pets.map((pet) => {
              const genderDisplay = 
                pet.gender.__kind__ === 'male' ? 'Male' :
                pet.gender.__kind__ === 'female' ? 'Female' :
                pet.gender.other;

              return (
                <div key={Number(pet.id)} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                  <Avatar className="h-16 w-16">
                    {pet.photo ? (
                      <AvatarImage src={pet.photo.getDirectURL()} alt={pet.name} />
                    ) : (
                      <AvatarFallback>
                        <PawPrint className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{pet.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getPetTypeDisplayName(pet.petType)} • {genderDisplay} • {pet.age.toString()} years old
                      {pet.breed && ` • ${pet.breed}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(pet)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRemovePet(pet.id)} disabled={removePet.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
