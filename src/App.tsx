import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AmbientGlow } from './components/AmbientGlow';
import {
  getToolBySlug,
  getCategoryBySlug,
  getProprietaryToolBySlug,
  getCollectionBySlug,
} from './services/catalogService';
import {
  getAiToolBySlug,
  getGuideBySlug,
  getPromptBySlug,
  getFreeToolBySlug,
} from './services/aiCatalogService';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { AlternativesPage } from './pages/AlternativesPage';
import { AlternativeDetailPage } from './pages/AlternativeDetailPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { AiToolsPage } from './pages/AiToolsPage';
import { AiToolDetailPage } from './pages/AiToolDetailPage';
import { FreeAiSitesPage } from './pages/FreeAiSitesPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { PromptLibraryPage } from './pages/PromptLibraryPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { FreeToolsPage } from './pages/FreeToolsPage';
import { FreeToolDetailPage } from './pages/FreeToolDetailPage';
import { ComparePage } from './pages/ComparePage';
import { PickPage } from './pages/PickPage';
import { SavedPage } from './pages/SavedPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const { route, params } = useRouter();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    switch (route) {
      case 'home':
        document.title = 'OpenAlternative — AI Tools & Open Source Discovery Platform';
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
      case 'ai-tools':
        document.title = 'AI Tools & Generative Platforms Directory — OpenAlternative';
        break;
      case 'ai-tool-detail': {
        const aiTool = getAiToolBySlug(params.slug);
        document.title = aiTool
          ? `${aiTool.name} (${aiTool.pricingType}) — AI Tool Review & Features`
          : 'AI Tool Not Found — OpenAlternative';
        break;
      }
      case 'free-ai-sites':
        document.title = 'Free AI Sites & Zero-Cost Generative Tools — OpenAlternative';
        break;
      case 'guides':
        document.title = 'Step-by-Step AI Workflows & Tutorials — OpenAlternative';
        break;
      case 'guide-detail': {
        const guide = getGuideBySlug(params.slug);
        document.title = guide
          ? `${guide.title} — OpenAlternative Guides`
          : 'Guide Not Found — OpenAlternative';
        break;
      }
      case 'prompt-library':
        document.title = 'AI Prompt Library & Creative Recipes — OpenAlternative';
        break;
      case 'prompt-detail': {
        const prompt = getPromptBySlug(params.slug);
        document.title = prompt
          ? `${prompt.title} (${prompt.targetModel}) — AI Prompt Recipe`
          : 'Prompt Not Found — OpenAlternative';
        break;
      }
      case 'free-tools':
        document.title = 'Free Browser-Based Utilities — OpenAlternative';
        break;
      case 'free-tool-detail': {
        const freeTool = getFreeToolBySlug(params.slug);
        document.title = freeTool
          ? `${freeTool.name} (100% Client-Side) — Free Browser Utility`
          : 'Utility Not Found — OpenAlternative';
        break;
      }
      case 'compare':
        document.title = 'Side-by-Side Tool Comparison — OpenAlternative';
        break;
      case 'pick':
        document.title = 'Help Me Pick: Guided Tool Discovery — OpenAlternative';
        break;
      case 'saved':
        document.title = 'Saved Tools & Prompt Recipes — OpenAlternative';
        break;
      case 'updates':
        document.title = 'Platform & Model Changelog — OpenAlternative';
        break;
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
      case 'ai-tools':
        return <AiToolsPage />;
      case 'ai-tool-detail':
        return <AiToolDetailPage />;
      case 'free-ai-sites':
        return <FreeAiSitesPage />;
      case 'guides':
        return <GuidesPage />;
      case 'guide-detail':
        return <GuideDetailPage />;
      case 'prompt-library':
        return <PromptLibraryPage />;
      case 'prompt-detail':
        return <PromptDetailPage />;
      case 'free-tools':
        return <FreeToolsPage />;
      case 'free-tool-detail':
        return <FreeToolDetailPage />;
      case 'compare':
        return <ComparePage />;
      case 'pick':
        return <PickPage />;
      case 'saved':
        return <SavedPage />;
      case 'updates':
        return <UpdatesPage />;
      case 'not-found':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/25 selection:text-foreground">
      <AmbientGlow />
      <Header />
      <main className="flex-1 relative z-10">{renderRoute()}</main>
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
