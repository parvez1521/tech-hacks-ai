import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import {
  getToolBySlug,
  getCategoryBySlug,
  getProprietaryToolBySlug,
  getCollectionBySlug,
} from './services/catalogService';

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
  const { route, params } = useRouter();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    switch (route) {
      case 'home':
        document.title = 'OpenAlternative — Open Source Alternatives to Popular Software';
        break;
      case 'tools':
        document.title = 'All Open Source Tools — OpenAlternative';
        break;
      case 'tool-detail': {
        const tool = getToolBySlug(params.slug);
        document.title = tool
          ? `${tool.name}: Open Source Alternative to ${tool.alternativesTo.join(', ')} — OpenAlternative`
          : 'Tool Not Found — OpenAlternative';
        break;
      }
      case 'categories':
        document.title = 'Software Categories — OpenAlternative';
        break;
      case 'category-detail': {
        const cat = getCategoryBySlug(params.slug);
        document.title = cat
          ? `Open Source ${cat.name} — OpenAlternative`
          : 'Category Not Found — OpenAlternative';
        break;
      }
      case 'alternatives':
        document.title = 'Browse Proprietary Software Alternatives — OpenAlternative';
        break;
      case 'alternative-detail': {
        const alt = getProprietaryToolBySlug(params.slug);
        document.title = alt
          ? `Open Source ${alt.name} Alternatives — OpenAlternative`
          : 'Software Not Found — OpenAlternative';
        break;
      }
      case 'collection-detail': {
        const col = getCollectionBySlug(params.slug);
        document.title = col
          ? `${col.headline} — OpenAlternative`
          : 'Collection Not Found — OpenAlternative';
        break;
      }
      case 'not-found':
      default:
        document.title = '404 Page Not Found — OpenAlternative';
        break;
    }
  }, [route, params]);

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
