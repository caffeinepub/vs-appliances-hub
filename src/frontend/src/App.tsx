import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import RegisterRequestPage from './pages/RegisterRequestPage';
import RequestSuccessPage from './pages/RequestSuccessPage';
import RequestDetailPage from './pages/RequestDetailPage';
import MyRequestsPage from './pages/MyRequestsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PageLayout from './components/PageLayout';

const rootRoute = createRootRoute({
  component: PageLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterRequestPage,
});

const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/success/$requestId',
  component: RequestSuccessPage,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request/$requestId',
  component: RequestDetailPage,
});

const myRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-requests',
  component: MyRequestsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  successRoute,
  detailRoute,
  myRequestsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
