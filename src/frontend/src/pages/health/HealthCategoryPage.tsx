import { Link, useParams } from '@tanstack/react-router';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { healthCatalog } from '../../content/health/healthCatalog';

export default function HealthCategoryPage() {
  const { category } = useParams({ from: '/health/$category' });
  const categoryData = healthCatalog[category];

  if (!categoryData) {
    return (
      <div className="container-custom section-spacing">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <Breadcrumbs items={[{ label: 'Health & Care', to: '/health' }, { label: categoryData.name }]} />

      <div className="mt-8 mb-12">
        <h1 className="text-4xl font-bold mb-4">{categoryData.name}</h1>
        <p className="text-lg text-muted-foreground">{categoryData.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryData.topics.map((topic) => (
          <Link key={topic.id} to={`/health/${category}/${topic.id}` as any}>
            <Card className="card-hover h-full cursor-pointer">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
                <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Learn more →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
