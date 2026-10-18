import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AmbientGlow } from './components/AmbientGlow';
import { FloatingChatbot } from './components/FloatingChatbot';
import { siteConfig, formatPageTitle } from './config/site';
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

export function getRouteTitle(route: string, params: Record<string, string> = {}): string {
  switch (route) {
    case 'home':
      return formatPageTitle();
    case 'tools':
      return formatPageTitle('All Open Source Tools');
    case 'tool-detail': {
      const tool = getToolBySlug(params.slug);
      return tool
        ? formatPageTitle(`${tool.name}: Open Source Alternative to ${tool.alternativesTo.join(', ')}`)
        : formatPageTitle('Tool Not Found');
    }
    case 'categories':
      return formatPageTitle('Software Categories');
    case 'category-detail': {
      const cat = getCategoryBySlug(params.slug);
      return cat
        ? formatPageTitle(`Open Source ${cat.name}`)
        : formatPageTitle('Category Not Found');
    }
    case 'alternatives':
      return formatPageTitle('Browse Proprietary Software Alternatives');
    case 'alternative-detail': {
      const alt = getProprietaryToolBySlug(params.slug);
      return alt
        ? formatPageTitle(`Open Source ${alt.name} Alternatives`)
        : formatPageTitle('Software Not Found');
    }
    case 'collection-detail': {
      const col = getCollectionBySlug(params.slug);
      return col
        ? formatPageTitle(col.headline)
        : formatPageTitle('Collection Not Found');
    }
    case 'ai-tools':
      return formatPageTitle('AI Tools & Generative Platforms Directory');
    case 'ai-tool-detail': {
      const aiTool = getAiToolBySlug(params.slug);
      return aiTool
        ? formatPageTitle(`${aiTool.name} (${aiTool.pricingType}) — AI Tool Review & Features`)
        : formatPageTitle('AI Tool Not Found');
    }
    case 'free-ai-sites':
      return formatPageTitle('Free AI Sites & Zero-Cost Generative Tools');
    case 'guides':
      return formatPageTitle('Step-by-Step AI Workflows & Tutorials');
    case 'guide-detail': {
      const guide = getGuideBySlug(params.slug);
      return guide
        ? formatPageTitle(`${guide.title} — AI Guides`)
        : formatPageTitle('Guide Not Found');
    }
    case 'prompt-library':
      return formatPageTitle('AI Prompt Library & Creative Recipes');
    case 'prompt-detail': {
      const prompt = getPromptBySlug(params.slug);
      return prompt
        ? formatPageTitle(`${prompt.title} (${prompt.targetModel}) — AI Prompt Recipe`)
        : formatPageTitle('Prompt Not Found');
    }
    case 'free-tools':
      return formatPageTitle('Free Browser-Based Utilities');
    case 'free-tool-detail': {
      const freeTool = getFreeToolBySlug(params.slug);
      return freeTool
        ? formatPageTitle(`${freeTool.name} (100% Client-Side) — Free Browser Utility`)
        : formatPageTitle('Utility Not Found');
    }
    case 'compare':
      return formatPageTitle('Side-by-Side Tool Comparison');
    case 'pick':
      return formatPageTitle('Help Me Pick: Guided Tool Discovery');
    case 'saved':
      return formatPageTitle('Saved Tools & Prompt Recipes');
    case 'updates':
      return formatPageTitle('Platform & Model Changelog');
    case 'not-found':
    default:
      return formatPageTitle('404 Page Not Found');
  }
}

const AppRoutes: React.FC = () => {
  const { route, params } = useRouter();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = getRouteTitle(route, params);
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
      <FloatingChatbot />
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
