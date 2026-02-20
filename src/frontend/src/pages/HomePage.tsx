import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Heart, Stethoscope, BookOpen, Sparkles, Shield, Users } from 'lucide-react';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Pet Information',
      description: 'Detailed breed guides, care instructions, and health information for cats, dogs, birds, and more.',
    },
    {
      icon: Stethoscope,
      title: 'Health & Care Guidance',
      description: 'Expert advice on grooming, nutrition, vaccinations, and emergency care for your beloved pets.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Assistant',
      description: 'Get instant help with behavioral assessments, emergency triage, and breed identification.',
    },
    {
      icon: Shield,
      title: 'Vaccination Reminders',
      description: 'Never miss important vaccinations with smart reminders and personalized schedules.',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Heart className="h-4 w-4 fill-primary" />
                <span>Your Pet's Health Companion</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                Pet Care & Guidance System
              </h1>
              <p className="text-lg text-muted-foreground">
                An AI-powered platform designed to help new and experienced pet owners provide the best care for their pets. 
                Get reliable guidance, health support, and personalized recommendations all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/ai-assistant">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Try AI Assistant
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button size="lg" variant="outline">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-4 text-sm">
                <Shield className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Important:</strong> This system provides educational guidance and support. 
                  It does not replace professional veterinary care. Always consult a licensed veterinarian for medical advice.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-home.dim_1200x600.png"
                alt="Professional pet care and guidance platform"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything You Need for Pet Care</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools and resources to keep your pets healthy and happy
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Explore Our Resources</h2>
            <p className="text-lg text-muted-foreground">
              Find detailed information about different pets and their care requirements
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Link to="/pets">
              <Card className="card-hover h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Pet Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse cats, dogs, birds, and other pets with detailed breed information and care guides.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/health">
              <Card className="card-hover h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-6 w-6 text-primary" />
                    Health & Care
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access grooming tips, nutrition advice, vaccination schedules, and emergency care information.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/ai-assistant">
              <Card className="card-hover h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get instant help with health assessments, emergency guidance, and breed identification.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
