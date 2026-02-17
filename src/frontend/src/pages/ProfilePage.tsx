import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProfileEditor from '../components/profile/ProfileEditor';
import PetsManager from '../components/profile/PetsManager';
import VaccinationsEditor from '../components/profile/VaccinationsEditor';
import FavoritesManager from '../components/profile/FavoritesManager';
import { User, Heart as PetIcon, Syringe, Star } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-lg text-muted-foreground">Manage your account, pets, and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="pets" className="gap-2">
            <PetIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Pets</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="gap-2">
            <Syringe className="h-4 w-4" />
            <span className="hidden sm:inline">Vaccinations</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>

        <TabsContent value="pets">
          <PetsManager />
        </TabsContent>

        <TabsContent value="vaccinations">
          <VaccinationsEditor />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
