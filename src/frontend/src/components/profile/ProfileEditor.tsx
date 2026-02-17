import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Save, User } from 'lucide-react';
import { toast } from 'sonner';
import BlobImageUploader from '../admin/BlobImageUploader';
import { ExternalBlob } from '../../backend';

export default function ProfileEditor() {
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<ExternalBlob | undefined>(undefined);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | undefined>(undefined);
  const [photoCleared, setPhotoCleared] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setProfilePhoto(profile.profilePhoto);
      setProfilePhotoUrl(profile.profilePhoto?.getDirectURL());
      setPhotoCleared(false);
    }
  }, [profile]);

  const handlePhotoSelected = (blob: ExternalBlob) => {
    setProfilePhoto(blob);
    setPhotoCleared(false);
  };

  const handlePhotoCleared = () => {
    setProfilePhoto(undefined);
    setProfilePhotoUrl(undefined);
    setPhotoCleared(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      // Create a new profile or update existing one
      const profileToSave = profile || {
        name: '',
        email: '',
        pets: [],
        favorites: [],
      };

      await saveProfile.mutateAsync({
        ...profileToSave,
        name: name.trim(),
        email: email.trim(),
        profilePhoto: photoCleared ? undefined : profilePhoto,
      });
      toast.success('Profile saved successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save profile';
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

  const isNewProfile = isFetched && profile === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isNewProfile && (
          <Alert>
            <AlertDescription>
              Welcome! Please complete your profile to get started with the Pet Care System.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Profile Photo Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Profile Photo</h3>
            </div>
            <BlobImageUploader
              label="Upload your profile photo"
              currentImageUrl={profilePhotoUrl}
              onImageSelected={handlePhotoSelected}
              onImageCleared={handlePhotoCleared}
            />
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (optional)"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saveProfile.isPending} className="w-full sm:w-auto">
          {saveProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
