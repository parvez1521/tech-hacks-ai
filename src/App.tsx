import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { AlternativesPage } from './pages/AlternativesPage';
import { AlternativeDetailPage } from './pages/AlternativeDetailPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const { route } = useRouter();

  const renderRoute = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'tools':
        return <ToolsPage />;
      case 'tool-detail':
        return <ToolDetailPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'category-detail':
        return <CategoryDetailPage />;
      case 'alternatives':
        return <AlternativesPage />;
      case 'alternative-detail':
        return <AlternativeDetailPage />;
      case 'collection-detail':
        return <CollectionDetailPage />;
      case 'not-found':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{renderRoute()}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
};

export default App;
