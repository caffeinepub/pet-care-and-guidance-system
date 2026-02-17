import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetDashboardInfo, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Sparkles, Heart, Calendar, AlertCircle, Video, Stethoscope, BookOpen, Clock } from 'lucide-react';
import { getVaccinationReminderMessage } from '../lib/vaccinationReminders';
import { useVaccinationDueTodayCountdown } from '../hooks/useVaccinationDueTodayCountdown';
import { getDailyCareTip, getRecommendedVideos } from '../content/recommendations';
import DashboardPetOnboarding from '../components/onboarding/DashboardPetOnboarding';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: dashboardInfo, isLoading, error, isFetched } = useGetDashboardInfo();
  const countdown = useVaccinationDueTodayCountdown();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const isAuthenticated = !!identity;

  // Show loading while actor is initializing or query is loading
  if (isLoading || profileLoading) {
    return (
      <div className="container-custom section-spacing">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error only for real unexpected failures
  if (error) {
    return (
      <div className="container-custom section-spacing">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="container-custom section-spacing">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If data hasn't been fetched yet, keep loading
  if (!isFetched || !dashboardInfo || !profileFetched) {
    return (
      <div className="container-custom section-spacing">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasProfile = userProfile !== null && dashboardInfo.name !== '';
  const hasPets = dashboardInfo.pets.length > 0;
  const showPetOnboarding = hasProfile && !hasPets && !onboardingComplete;

  const dailyTip = getDailyCareTip();
  const recommendedVideos = getRecommendedVideos();

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back{dashboardInfo.name ? `, ${dashboardInfo.name}` : ''}!
        </h1>
        <p className="text-lg text-muted-foreground">Here's what's happening with your pets today</p>
      </div>

      {showPetOnboarding ? (
        <div className="max-w-2xl mx-auto">
          <DashboardPetOnboarding onComplete={() => setOnboardingComplete(true)} />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pets Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Your Pets
                </CardTitle>
                <CardDescription>Manage your pet profiles and health records</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardInfo.pets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't added any pets yet</p>
                    <Link to="/profile">
                      <Button>Add Your First Pet</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardInfo.pets.map((pet) => {
                      const genderDisplay = 
                        pet.gender.__kind__ === 'male' ? 'Male' :
                        pet.gender.__kind__ === 'female' ? 'Female' :
                        pet.gender.other;

                      const lastVaccinated = pet.lastVaccinatedDate 
                        ? new Date(Number(pet.lastVaccinatedDate) / 1_000_000).toLocaleDateString()
                        : null;

                      return (
                        <div key={Number(pet.id)} className="flex items-start justify-between p-4 rounded-lg border bg-card">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{pet.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {pet.petType} • {genderDisplay} • {pet.age.toString()} years old
                              {pet.breed && ` • ${pet.breed}`}
                            </p>
                            {lastVaccinated && (
                              <p className="text-xs text-muted-foreground">
                                Last vaccinated: {lastVaccinated}
                              </p>
                            )}
                            {pet.vaccinations.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {pet.vaccinations.length} vaccination{pet.vaccinations.length !== 1 ? 's' : ''} tracked
                                </span>
                              </div>
                            )}
                          </div>
                          <Badge variant={pet.petType === 'dog' ? 'default' : 'secondary'}>
                            {pet.petType}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vaccination Reminders */}
            {dashboardInfo.pets.some(pet => pet.vaccinations.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Vaccination Reminders
                  </CardTitle>
                  <CardDescription>Stay on top of your pets' health schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardInfo.pets.map((pet) =>
                      pet.vaccinations
                        .filter(v => !v.completed)
                        .map((vaccination, idx) => {
                          const reminder = getVaccinationReminderMessage(vaccination.dueDate);
                          return (
                            <Alert 
                              key={`${pet.id}-${idx}`} 
                              className={
                                reminder.variant === 'urgent' 
                                  ? 'border-destructive' 
                                  : reminder.variant === 'warning' 
                                  ? 'border-yellow-500' 
                                  : ''
                              }
                            >
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <strong>{pet.name}</strong> - {vaccination.name}: {reminder.message}
                                  </div>
                                  {reminder.isDueToday && countdown && (
                                    <div className="flex items-center gap-1 text-destructive font-mono text-sm shrink-0">
                                      <Clock className="h-4 w-4" />
                                      {countdown}
                                    </div>
                                  )}
                                </div>
                              </AlertDescription>
                            </Alert>
                          );
                        })
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daily Care Tip */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Daily Care Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dailyTip}</p>
              </CardContent>
            </Card>

            {/* Recommended Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Recommended Videos
                </CardTitle>
                <CardDescription>Helpful resources for pet care</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendedVideos.map((video, idx) => (
                    <a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <Video className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.category}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/ai-assistant">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                  </Button>
                </Link>
                <Link to="/pets">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <BookOpen className="h-4 w-4" />
                    Browse Pets
                  </Button>
                </Link>
                <Link to="/health">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Stethoscope className="h-4 w-4" />
                    Health & Care
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Heart className="h-4 w-4" />
                    Manage Pets
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Based on your pets' profiles, we recommend regular check-ups and maintaining up-to-date vaccination records.
                </p>
                <Link to="/ai-assistant">
                  <Button variant="link" className="p-0 h-auto">
                    Get personalized health assessment →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
