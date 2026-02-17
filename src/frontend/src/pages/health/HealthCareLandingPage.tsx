import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Scissors, Apple, Syringe, AlertCircle } from 'lucide-react';

export default function HealthCareLandingPage() {
  const categories = [
    {
      id: 'grooming',
      name: 'Grooming',
      description: 'Essential grooming tips and techniques for your pets',
      icon: Scissors,
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      description: 'Dietary guidelines and nutritional requirements',
      icon: Apple,
    },
    {
      id: 'vaccination',
      name: 'Vaccination Guidance',
      description: 'Vaccination schedules and immunization information',
      icon: Syringe,
    },
    {
      id: 'emergency',
      name: 'Emergency Care',
      description: 'First aid and emergency response procedures',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Health & Care</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive health information and care guidelines to keep your pets healthy and happy
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} to={`/health/${category.id}` as any}>
            <Card className="card-hover h-full cursor-pointer">
              <CardHeader>
                <category.icon className="h-12 w-12 text-primary mb-2" />
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
