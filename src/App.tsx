import React, { useEffect } from 'react';
import { RouterProvider, useRouter, matchRoute } from './router/Router';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AmbientGlow } from './components/AmbientGlow';
import { FloatingChatbot } from './components/FloatingChatbot';
import { AdSenseBanner } from './components/AdSenseBanner';
import { AdSenseRuntime } from './components/AdSenseRuntime';
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
import { getOfferBySlug } from './data/offersData';

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
import { OffersPage } from './pages/OffersPage';
import { OfferDetailPage } from './pages/OfferDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclosurePage } from './pages/DisclosurePage';
import { SubmitToolPage } from './pages/SubmitToolPage';
import { SubmitGuidePage } from './pages/SubmitGuidePage';
import { SubmitPromptPage } from './pages/SubmitPromptPage';
import { DiscoveriesPage } from './pages/DiscoveriesPage';
import { ModerationDashboardPage } from './pages/ModerationDashboardPage';
import { CookieConsentBanner } from './components/CookieConsentBanner';
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
        ? formatPageTitle(`${freeTool.name} (${freeTool.isClientSideOnly ? 'Client-Side' : 'Configured Service'}) — Utility Tool`)
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
    case 'offers':
      return formatPageTitle('AI Deals, Student Plans & Exclusive Discounts');
    case 'offer-detail': {
      const offer = getOfferBySlug(params.slug);
      return offer
        ? formatPageTitle(`${offer.title} — AI Deals & Benefits`)
        : formatPageTitle('Offer Not Found');
    }
    case 'about':
      return formatPageTitle('About Us — Editorial Mission & Standards');
    case 'contact':
      return formatPageTitle('Contact Us — Feedback, Submissions & Inquiries');
    case 'privacy':
      return formatPageTitle('Privacy Policy — Data Protection & Cookie Notice');
    case 'terms':
      return formatPageTitle('Terms of Use — Platform Conditions & Disclaimers');
    case 'disclosure':
      return formatPageTitle('Affiliate & Advertising Disclosure');
    case 'submit-tool':
      return formatPageTitle('Submit an AI Tool — Community Directory Submission');
    case 'submit-guide':
      return formatPageTitle('Submit an AI Guide & Tutorial — Community Knowledge');
    case 'submit-prompt':
      return formatPageTitle('Submit an AI Prompt — SwitchRoute');
    case 'discoveries':
      return formatPageTitle('Daily Discoveries & Featured AI Tools');
    case 'moderation':
      return formatPageTitle('Editorial Moderation Queue');
    case 'not-found':
    default:
      return formatPageTitle('404 Page Not Found');
  }
}

export function getRouteDescription(route: string, params: Record<string, string> = {}): string {
  switch (route) {
    case 'home':
      return siteConfig.description;
    case 'tools':
      return 'Explore verified open-source software alternatives to proprietary SaaS. Inspect star velocity, licenses, and self-hosting guides.';
    case 'tool-detail': {
      const tool = getToolBySlug(params.slug);
      return tool
        ? `${tool.name} is a verified open-source alternative to ${tool.alternativesTo.join(', ')}. ${tool.tagline} License: ${tool.license}.`
        : 'Detailed review and metrics for this open-source software project.';
    }
    case 'categories':
      return 'Browse open-source software and generative AI platforms by technology category, database engine, and workflow.';
    case 'category-detail': {
      const cat = getCategoryBySlug(params.slug);
      return cat
        ? `Explore curated open-source alternatives and software tools in the ${cat.name} category.`
        : 'Explore software tools by category.';
    }
    case 'alternatives':
      return 'Find community-maintained open-source replacements for proprietary tools like Figma, Notion, Firebase, and Airtable.';
    case 'alternative-detail': {
      const alt = getProprietaryToolBySlug(params.slug);
      return alt
        ? `Discover verified open-source alternatives to replace ${alt.name}. Avoid vendor lock-in and keep full data control.`
        : 'Open source alternatives to proprietary software.';
    }
    case 'collection-detail': {
      const col = getCollectionBySlug(params.slug);
      return col
        ? col.description
        : 'Curated software collection.';
    }
    case 'ai-tools':
      return 'Comprehensive directory of top generative AI platforms, foundation models, code editors, and video generation engines.';
    case 'ai-tool-detail': {
      const aiTool = getAiToolBySlug(params.slug);
      return aiTool
        ? `${aiTool.name} (${aiTool.pricingType}): ${aiTool.description}`
         : 'Detailed pricing provenance, model capabilities, and verified benchmarks.';
    }
    case 'free-ai-sites':
      return 'Curated directory of 100% free AI sites, recurring free plans, zero-cost accounts, and self-hostable open-source models.';
    case 'guides':
      return 'Actionable, step-by-step AI tutorials and open-source deployment guides written by practitioners.';
    case 'guide-detail': {
      const guide = getGuideBySlug(params.slug);
      return guide
        ? `${guide.title}: ${guide.summary}`
        : 'Step-by-step AI tutorial and workflow guide.';
    }
    case 'prompt-library':
      return 'Explore original AI image and creative prompt recipes with model notes, visual styles, aspect ratios, tag filters, previews, and one-click copying.';
    case 'prompt-detail': {
      const prompt = getPromptBySlug(params.slug);
      return prompt
        ? `${prompt.title} for ${prompt.targetModel}: ${prompt.description}`
        : 'Tested prompt recipe and template.';
    }
    case 'free-tools':
      return 'Utility Tools for developers, designers, and creators. Browser utilities run locally; service-backed transcription clearly reports its configured provider requirement.';
    case 'free-tool-detail': {
      const freeTool = getFreeToolBySlug(params.slug);
      return freeTool
        ? `${freeTool.name}: ${freeTool.description}`
        : 'Free browser-based privacy utility.';
    }
    case 'compare':
      return 'Side-by-side software comparison matrix. Evaluate licenses, self-hostability, repository metrics, and pricing models.';
    case 'pick':
      return 'Answer 3 quick questions about your project goals and budget to get instant tailored software recommendations.';
    case 'saved':
      return 'Access your bookmarked open-source tools, AI platforms, and prompt recipes.';
    case 'updates':
      return 'Changelog of recently indexed software, platform releases, and generative model benchmarks.';
    case 'offers':
      return 'Verified AI deals, student developer packs, carrier bundles (like Jio Gemini), and startup cloud credits.';
    case 'offer-detail': {
      const offer = getOfferBySlug(params.slug);
      return offer
        ? `${offer.title} from ${offer.provider}. ${offer.benefitSummary} Eligibility: ${offer.eligibility}`
        : 'Verified AI deal and benefit terms.';
    }
    case 'about':
      return 'Learn about the mission, editorial methodology, and independent review standards behind SwitchRoute.';
    case 'contact':
      return 'Get in touch with the SwitchRoute editorial team for tool submissions, pricing corrections, feedback, and partnerships.';
    case 'privacy':
      return 'Our privacy policy details data handling, Google advertising cookies, DoubleClick opt-out mechanisms, and user rights under GDPR, CCPA, and ePrivacy.';
    case 'terms':
      return 'Terms of use, intellectual property conditions, acceptable conduct, and disclaimers for SwitchRoute visitors.';
    case 'disclosure':
      return 'Our advertising and affiliate disclosure policy. Learn how SwitchRoute maintains 100% editorial independence while funding operations.';
    case 'submit-tool':
      return 'Submit your AI platform, open-source model, developer tool, or creative application for editorial review and directory inclusion.';
    case 'submit-guide':
      return 'Share practical technical guides, prompt recipes, or developer workflows with the SwitchRoute community.';
    case 'submit-prompt':
      return 'Submit an original or authorized AI prompt for moderator review.';
    case 'discoveries':
      return 'Explore hand-curated daily discoveries and featured AI platforms reviewed by the SwitchRoute editorial team.';
    case 'moderation':
      return 'Editorial moderation queue for reviewing community-submitted AI tools and technical tutorials.';
    case 'not-found':
    default:
      return 'The requested page could not be found on SwitchRoute.';
  }
}

const AppRoutes: React.FC = () => {
  const { route, params, currentPath } = useRouter();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const title = getRouteTitle(route, params);
    const desc = getRouteDescription(route, params);
    document.title = title;

    // Update dynamic meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    // Update OG metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && typeof window !== 'undefined') {
      const canonicalPath = route === 'community-redirect' ? '/ai-tools' : window.location.pathname;
      canonicalLink.setAttribute('href', `${siteConfig.url}${canonicalPath}`);
    }
  }, [route, params, currentPath]);

  useEffect(() => {
    if (route === 'community-redirect') {
      window.history.replaceState({}, '', '/ai-tools');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [route]);

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
      case 'community-redirect':
        return <AiToolsPage />;
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
      case 'offers':
        return <OffersPage />;
      case 'offer-detail':
        return <OfferDetailPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'disclosure':
        return <DisclosurePage />;
      case 'submit-tool':
        return <SubmitToolPage />;
      case 'submit-guide':
        return <SubmitGuidePage />;
      case 'submit-prompt':
        return <SubmitPromptPage />;
      case 'discoveries':
        return <DiscoveriesPage />;
      case 'moderation':
        return <ModerationDashboardPage />;
      case 'not-found':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/25 selection:text-foreground">
      <AmbientGlow />
      <Header />
      <main className="flex-1 relative z-10">
        {renderRoute()}
        {route === 'home' && <AdSenseBanner slot={siteConfig.adsense.slots.homepage} format="auto" />}
      </main>
      <Footer />
      <FloatingChatbot />
      <CookieConsentBanner />
      <AdSenseRuntime />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </ThemeProvider>
  );
};

export {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  DisclosurePage,
  CookieConsentBanner,
  Footer,
  AdSenseBanner,
  matchRoute,
  RouterProvider,
  ModerationDashboardPage,
};

export default App;
