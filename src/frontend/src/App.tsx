import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PetsLandingPage from './pages/pets/PetsLandingPage';
import PetCategoryPage from './pages/pets/PetCategoryPage';
import PetDetailPage from './pages/pets/PetDetailPage';
import BreedListPage from './pages/pets/BreedListPage';
import BreedDetailPage from './pages/pets/BreedDetailPage';
import HealthCareLandingPage from './pages/health/HealthCareLandingPage';
import HealthCategoryPage from './pages/health/HealthCategoryPage';
import HealthTopicPage from './pages/health/HealthTopicPage';
import AIAssistantPage from './pages/ai/AIAssistantPage';
import AdminLandingPage from './pages/admin/AdminLandingPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminBreedsPage from './pages/admin/AdminBreedsPage';
import AdminVideosPage from './pages/admin/AdminVideosPage';
import RequireAuth from './components/auth/RequireAuth';
import RequireAdmin from './components/auth/RequireAdmin';
import { Toaster } from './components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

const petsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets',
  component: PetsLandingPage,
});

const petCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets/$category',
  component: PetCategoryPage,
});

const petDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets/$category/$pet',
  component: PetDetailPage,
});

const breedListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets/$category/breeds',
  component: BreedListPage,
});

const breedDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pets/$category/breeds/$breed',
  component: BreedDetailPage,
});

const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health',
  component: HealthCareLandingPage,
});

const healthCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health/$category',
  component: HealthCategoryPage,
});

const healthTopicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health/$category/$topic',
  component: HealthTopicPage,
});

const aiAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-assistant',
  component: AIAssistantPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RequireAdmin>
      <AdminLandingPage />
    </RequireAdmin>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: () => (
    <RequireAdmin>
      <AdminCategoriesPage />
    </RequireAdmin>
  ),
});

const adminBreedsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/breeds',
  component: () => (
    <RequireAdmin>
      <AdminBreedsPage />
    </RequireAdmin>
  ),
});

const adminVideosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/videos',
  component: () => (
    <RequireAdmin>
      <AdminVideosPage />
    </RequireAdmin>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  dashboardRoute,
  profileRoute,
  petsRoute,
  petCategoryRoute,
  petDetailRoute,
  breedListRoute,
  breedDetailRoute,
  healthRoute,
  healthCategoryRoute,
  healthTopicRoute,
  aiAssistantRoute,
  adminRoute,
  adminCategoriesRoute,
  adminBreedsRoute,
  adminVideosRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
