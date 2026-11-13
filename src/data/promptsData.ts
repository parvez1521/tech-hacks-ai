import type { PromptItem } from '../types/index.ts';

export interface PromptCategoryDef {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export const promptCategories: PromptCategoryDef[] = [
  {
    id: 'human-portraits',
    name: 'Human Portraits',
    slug: 'human-portraits',
    description: 'Original portrait recipes for fictional adult subjects, from professional headshots to editorial couples and cinematic close-ups.',
  },
  {
    id: 'ai-image-generation',
    name: 'AI Image Generation',
    slug: 'ai-image-generation',
    description: 'Hyper-detailed photographic, artistic, and conceptual generation prompts for FLUX.1, Gemini Imagen 3, and modern diffusion models.',
  },
  {
    id: 'image-editing-img2img',
    name: 'Image Editing and Image-to-Image',
    slug: 'image-editing-img2img',
    description: 'Reference-guided editing, inpainting, style transfer, and character-consistent modifications.',
  },
  {
    id: 'ai-video-generation',
    name: 'AI Video Generation',
    slug: 'ai-video-generation',
    description: 'High-fidelity generative video prompts for Higgsfield AI, Runway Gen-3, Kling, and Luma.',
  },
  {
    id: 'cinematic-camera-vfx',
    name: 'Cinematic Camera Movement and VFX',
    slug: 'cinematic-camera-vfx',
    description: 'Orbits, dolly zooms, whip pans, high-speed tracking, and aerial choreography for cinematic video.',
  },
  {
    id: 'web-app-development',
    name: 'Web App Development',
    slug: 'web-app-development',
    description: 'End-to-end web application blueprints, client state architectures, and master autonomous agent instructions.',
  },
  {
    id: 'website-landing-page',
    name: 'Website and Landing Page Development',
    slug: 'website-landing-page',
    description: 'High-converting SaaS landing pages, responsive hero sections, bento grids, and layout systems.',
  },
  {
    id: 'ui-ux-design-prototyping',
    name: 'UI/UX Design and Prototyping',
    slug: 'ui-ux-design-prototyping',
    description: 'Modern UI/UX specifications, design tokens, component variants, and accessible prototyping patterns.',
  },
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    slug: 'frontend-development',
    description: 'Production React, Vue, TypeScript custom hooks, state stores, and accessible form engines.',
  },
  {
    id: 'full-stack-development',
    name: 'Full-Stack Application Development',
    slug: 'full-stack-development',
    description: 'Prisma, PostgreSQL schemas, Supabase RLS, authentication flows, and microservice APIs.',
  },
  {
    id: 'claude-artifacts-ui',
    name: 'Claude Artifacts and Interactive UI',
    slug: 'claude-artifacts-ui',
    description: 'Self-contained interactive React widgets, dashboards, data grids, and diagram editors running live in Claude Artifacts.',
  },
  {
    id: 'motion-design-animation',
    name: 'Motion Design and Interface Animation',
    slug: 'motion-design-animation',
    description: 'Fluid micro-interactions, Framer Motion springs, CSS view transitions, and physics-based UI motion.',
  },
  {
    id: '3d-design-product-vis',
    name: '3D Design and Product Visualization',
    slug: '3d-design-product-vis',
    description: 'Isometric 3D icons, tactile material shaders, packaging mockups, and studio lighting renders.',
  },
  {
    id: 'coding-debug-refactor',
    name: 'Coding, Debugging and Refactoring',
    slug: 'coding-debug-refactor',
    description: 'High-precision root cause analysis, code refactoring, performance profiling, and test automation.',
  },
  {
    id: 'marketing-content-social',
    name: 'Marketing, Content and Social Media',
    slug: 'marketing-content-social',
    description: 'High-conversion B2B email sequences, technical launch posts, viral social hooks, and positioning frameworks.',
  },
  {
    id: 'vibe-coded-app-security',
    name: 'Vibe-Coded App Security',
    slug: 'vibe-coded-app-security',
    description: 'Copy-paste security audits for Cursor, Lovable, Bolt, and other AI coding assistants. Use these prompts against your existing codebase — each asks your coding assistant to inspect the implementation, make appropriate fixes, and report what it actually verified. Review changes before deploying.',
  },
  {
    id: 'premium-website-prompts',
    name: 'Premium Website Prompts',
    slug: 'premium-website-prompts',
    description: 'Premium Website Prompts (Part 1) — five complete, animated one-file website builds from Aaghaz / Make First Million (@make.first.million): a workflow-automation SaaS landing page, a holographic trading-card marketplace, a dark techwear store with a 3D centrepiece, a warm coffee roastery one-pager, and an AI assistant site with a glowing particle orb. Copy a prompt, paste it into ChatGPT, Claude or Gemini, and get a complete index.html. Source: Aaghaz / Make First Million (@make.first.million).',
  },
];

export const promptProviders = [
  { id: 'all', name: 'All Providers', filterValue: null },
  { id: 'google', name: 'Google (Nano Banana)', filterValue: 'google' },
  { id: 'anthropic', name: 'Anthropic (Claude)', filterValue: 'anthropic' },
  { id: 'higgsfield', name: 'Higgsfield AI', filterValue: 'higgsfield' },
  { id: 'pixverse', name: 'PixVerse', filterValue: 'pixverse' },
  { id: 'kling', name: 'Kling AI', filterValue: 'kling' },
  { id: 'flux', name: 'Black Forest Labs (FLUX)', filterValue: 'flux' },
  { id: 'runway', name: 'Runway Gen-3', filterValue: 'runway' },
  { id: 'cursor', name: 'Cursor / Coding Agents', filterValue: 'cursor' },
];

export const promptsData: PromptItem[] = [
  {
    id: 'portrait-editorial-duo',
    title: 'Two-Person Editorial Portrait with Natural Skin Detail',
    slug: 'portrait-editorial-duo',
    description: 'A flexible premium portrait setup for two distinct adult subjects, with believable skin, balanced lighting, and room for a landscape crop.',
    category: 'human-portraits',
    targetModel: 'Gemini Image / FLUX.1',
    provider: 'Google',
    promptText: 'Create a premium editorial photograph of two fictional adults: [WOMAN DESCRIPTION] and [MAN DESCRIPTION]. Keep their faces visibly distinct and anatomically natural, with individual skin texture, pores, fine lines, realistic eyes, and expressions that feel relaxed rather than posed. Dress them in [WARDROBE]. Frame both from the chest up, side by side with clear separation, looking toward camera. Set them against [BACKGROUND] with soft key light, subtle warm edge light, and natural shadow falloff. Use an 85mm portrait lens, believable depth of field, refined color, and quiet negative space on the left. Landscape 3:2 composition. Avoid waxy skin, facial symmetry artifacts, extra people, text, logos, or jewelry distortions.',
    tags: ['featured-human-portraits', 'couple-portraits', 'fashion-editorial', 'cinematic-portraits', 'editorial-photography', 'natural-skin', 'landscape-portrait'],
    tips: 'Replace both subject descriptions with fictional adults or people who have consented to image use. Specify age range, complexion, hairstyle, expression, and wardrobe separately for each person.',
    placeholders: ['[WOMAN DESCRIPTION]', '[MAN DESCRIPTION]', '[WARDROBE]', '[BACKGROUND]'],
    customizationInstructions: 'Choose two distinct adult subjects, clothing, background, and lighting. Keep the framing landscape when adding a page headline beside the image.',
    expectedOutputType: 'Landscape 3:2 two-person editorial portrait.',
    exampleUseCase: 'Editorial homepage artwork, creator profiles, or campaign portraits.',
    authorOrSource: 'Original SwitchRoute prompt; preview artwork created specifically for SwitchRoute.',
    previewImage: '/prompts/generated/portrait-editorial-duo.webp',
    previewImageAlt: 'A fictional adult woman with natural curls and a fictional adult man in an ivory knit pose side by side against a dark teal studio backdrop.',
    visualStyle: 'Premium editorial portrait',
    aspectRatio: '3:2',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 2,
    createdAt: '2026-10-22T00:00:00.000Z',
  },
  {
    id: 'portrait-women-windowlight',
    title: 'Women’s Portrait in Warm Window Light',
    slug: 'portrait-women-windowlight',
    description: 'A candid adult portrait that keeps freckles and natural facial texture while using a real-feeling city café setting.',
    category: 'human-portraits',
    targetModel: 'Gemini Image / FLUX.1',
    provider: 'Google',
    promptText: 'Photograph a fictional adult woman, [AGE RANGE], with [SKIN TONE], [HAIR], and [DISTINCTIVE NON-IDENTIFYING DETAILS]. She wears [CLOTHING] and sits naturally beside a large café window. Use warm daylight from camera left, soft reflected fill, and a softly blurred [CITY OR BACKGROUND]. Frame chest-up at a relaxed three-quarter angle, with an authentic expression and natural catchlights. Show realistic skin pores, fine facial hairs, subtle unevenness, and believable hands if visible. Shot on a 50mm lens at f/2.2, gentle film grain, restrained color grade, portrait 4:5. Avoid plastic smoothing, exaggerated makeup, warped eyes, text, or logos.',
    tags: ['featured-human-portraits', 'womens-portraits', 'fashion-editorial', 'street-style-lifestyle', 'window-light', 'photorealism'],
    tips: 'Describe a real lighting direction and one or two individual features rather than stacking generic “perfect face” terms.',
    placeholders: ['[AGE RANGE]', '[SKIN TONE]', '[HAIR]', '[DISTINCTIVE NON-IDENTIFYING DETAILS]', '[CLOTHING]', '[CITY OR BACKGROUND]'],
    customizationInstructions: 'Customize the adult subject’s age range, complexion, hairstyle, clothing, expression, and café setting. Use a consented likeness for any identifiable person.',
    expectedOutputType: 'Natural-light editorial portrait, 4:5.',
    exampleUseCase: 'Lifestyle portrait series and fashion editorial concepts.',
    authorOrSource: 'Original SwitchRoute prompt; preview artwork created specifically for SwitchRoute.',
    previewImage: '/prompts/generated/portrait-woman-windowlight.webp',
    previewImageAlt: 'A fictional adult woman with long dark curls and freckles sits beside a sunlit café window in a rust-colored shirt.',
    visualStyle: 'Natural-light lifestyle photography',
    aspectRatio: '4:5',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
  },
  {
    id: 'portrait-mens-professional-headshot',
    title: 'Men’s Professional Headshot with Character',
    slug: 'portrait-mens-professional-headshot',
    description: 'An approachable business portrait that preserves age, expression lines, and skin texture instead of smoothing away character.',
    category: 'human-portraits',
    targetModel: 'Gemini Image / FLUX.1',
    provider: 'Google',
    promptText: 'Create a polished but natural professional portrait of a fictional adult man, [AGE RANGE], with [SKIN TONE], [HAIR AND FACIAL HAIR], and [DISTINCTIVE NON-IDENTIFYING DETAILS]. He wears [CLOTHING] in a contemporary [WORKPLACE] setting. Frame head and shoulders at eye level; use a relaxed, confident expression, soft window light from camera left, subtle warm practical light in the background, and realistic skin pores and age lines. Use an 70mm portrait lens, restrained depth of field, neutral true-to-life color, square crop with space above the head. Avoid airbrushed skin, exaggerated jaw shape, artificial eye sharpening, text, or logos.',
    tags: ['featured-human-portraits', 'mens-portraits', 'professional-headshots', 'linkedin', 'natural-skin'],
    tips: 'For a LinkedIn crop, keep the eyes near the upper third and describe the actual work context instead of adding decorative office props.',
    placeholders: ['[AGE RANGE]', '[SKIN TONE]', '[HAIR AND FACIAL HAIR]', '[DISTINCTIVE NON-IDENTIFYING DETAILS]', '[CLOTHING]', '[WORKPLACE]'],
    customizationInstructions: 'Adjust clothing formality, workplace, age range, complexion, hair, camera height, and background light. Avoid using a real person’s likeness without permission.',
    expectedOutputType: 'Professional headshot, 1:1.',
    exampleUseCase: 'Business profile portraits and professional team pages.',
    authorOrSource: 'Original SwitchRoute prompt; preview artwork created specifically for SwitchRoute.',
    previewImage: '/prompts/generated/portrait-man-professional.webp',
    previewImageAlt: 'A fictional middle-aged adult man with salt-and-pepper hair wearing a navy blazer in a softly lit architecture studio.',
    visualStyle: 'Professional editorial headshot',
    aspectRatio: '1:1',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 3,
    createdAt: '2026-10-22T00:00:00.000Z',
  },
  {
    id: 'portrait-couple-courtyard-dusk',
    title: 'Couple Portrait in a Courtyard at Dusk',
    slug: 'portrait-couple-courtyard-dusk',
    description: 'A warm, unforced adult couple portrait with two different faces, individual wardrobe, and gentle evening light.',
    category: 'human-portraits',
    targetModel: 'Gemini Image / FLUX.1',
    provider: 'Google',
    promptText: 'Photograph two fictional adults as a relaxed couple: [PERSON ONE DESCRIPTION] and [PERSON TWO DESCRIPTION]. Keep their facial features, skin tones, hair, and expressions distinct. Give each person separate [WARDROBE DETAILS]. Place them close together in a [SETTING] at dusk with soft amber practical lights and a gentle cool ambient fill. Frame from waist-up with a natural, slightly asymmetric stance; capture a quiet shared smile without making them look like twins. Use a 50mm lens, honest skin texture, natural hands, soft background separation, and portrait 4:5 framing. Avoid beauty-filter skin, matching faces, text, or logos.',
    tags: ['featured-human-portraits', 'couple-portraits', 'womens-portraits', 'mens-portraits', 'fashion-editorial', 'cinematic-portraits', 'lifestyle-photography'],
    tips: 'Write one description per person and vary wardrobe silhouettes. It helps prevent face blending and duplicate clothing.',
    placeholders: ['[PERSON ONE DESCRIPTION]', '[PERSON TWO DESCRIPTION]', '[WARDROBE DETAILS]', '[SETTING]'],
    customizationInstructions: 'Change the adults, wardrobe, setting, time of day, pose, lens, and crop. Use only consenting or fictional subjects.',
    expectedOutputType: 'Editorial couple portrait, 4:5.',
    exampleUseCase: 'Couple portrait concepts and lifestyle campaign photography.',
    authorOrSource: 'Original SwitchRoute prompt; preview artwork created specifically for SwitchRoute.',
    previewImage: '/prompts/generated/portrait-couple-courtyard.webp',
    previewImageAlt: 'A fictional East Asian adult woman and Black adult man stand together in a softly lit courtyard at dusk.',
    visualStyle: 'Cinematic lifestyle portrait',
    aspectRatio: '4:5',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 4,
    createdAt: '2026-10-22T00:00:00.000Z',
  },
  {
    id: 'pixverse-cinematic-portrait-motion',
    title: 'Cinematic Rooftop Portrait with Wind and a Slow Push-In',
    slug: 'pixverse-cinematic-portrait-motion',
    description: 'An original suggested image-to-video recipe for subtle hair and fabric movement, identity stability, and a measured camera push-in.',
    category: 'ai-video-generation',
    targetModel: 'PixVerse video model',
    provider: 'PixVerse',
    promptText: 'Animate the provided portrait of a fictional adult woman on a rooftop at blue hour. Preserve her exact facial identity, skin texture, hairline, clothing, and body proportions throughout. A light breeze moves one loose hair strand and gently lifts the edge of her cobalt jacket; she makes one small turn toward the breeze with a calm, confident expression. The camera makes a very slow, stable push-in from a chest-up frame, with distant windows softly glowing in the background. Natural micro-movements only, cinematic portrait optics, realistic fabric physics, no face morphing, no new objects, no text, no logos. Suggested 5-second vertical 9:16 recreation; duration is a prompt target, not a measured source clip.',
    tags: ['pixverse', 'ai-video-generation', 'human-portraits', 'cinematic-portraits', 'image-to-video', 'slow-push-in'],
    tips: 'Use the local poster as a fictional reference image if your selected tool supports image-to-video. This is a SwitchRoute suggested recreation, not a prompt from PixVerse or a creator clip.',
    placeholders: ['[WIND STRENGTH]', '[CAMERA MOVE]', '[COLOR PALETTE]'],
    customizationInstructions: 'Tune wind, camera move, wardrobe color, and environment. Upload only an image you own or have permission to use.',
    expectedOutputType: 'Suggested vertical 9:16 portrait-motion clip; actual duration depends on the selected model.',
    exampleUseCase: 'Short-form fashion portrait clips and gentle image-to-video motion studies.',
    officialToolUrl: 'https://pixverse.ai/en',
    authorOrSource: 'Original SwitchRoute suggested recreation; no provider prompt or creator clip reused.',
    sourceUrl: 'https://pixverse.ai/en',
    sourceCreator: 'SwitchRoute editorial team',
    rightsStatus: 'original',
    rightsLicense: 'Original prompt and locally generated poster artwork.',
    promptProvenance: 'suggested-recreation',
    createdAt: '2026-10-22T00:00:00.000Z',
    mediaType: 'video',
    aspectRatio: '9:16',
    previewImage: '/prompts/generated/pixverse-motion-portrait-poster.webp',
    previewImageAlt: 'A fictional adult Black woman in a cobalt jacket on a rooftop at blue hour, composed as a vertical cinematic still.',
    videoDetails: { previewUrl: '/prompts/generated/pixverse-motion-portrait-poster.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://pixverse.ai/en', creatorAttribution: 'SwitchRoute editorial team; original prompt and poster.', permissionStatus: 'Original SwitchRoute content. No third-party video reused.', aspectRatio: '9:16' },
  },
  // ==========================================
  // PHASE C: GEMINI NANO BANANA COLLECTION (10 Prompts)
  // Official Docs: https://ai.google.dev/gemini-api/docs/image-generation
  // ==========================================
  {
    id: 'gemini-commercial-product-photography',
    title: 'Photorealistic Studio Commercial Product Showcase',
    slug: 'gemini-commercial-product-photography',
    description: 'Engineered for Google Gemini Nano Banana / Imagen 3 multimodal generation with pristine studio lighting and tactile macro details.',
    category: 'ai-image-generation',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'High-end commercial product photograph of [PRODUCT] placed on a minimalist matte slate pedestal. Shot with 85mm prime lens at f/2.8, professional studio softbox key light from 45 degrees, subtle rim lighting matching [BRAND COLORS], clean diffused reflections, natural micro-shadows, zero dust or scratches, ultra-high resolution commercial editorial quality in [VISUAL STYLE] style --ar [ASPECT RATIO]',
    tags: ['product-photography', 'commercial', 'studio-lighting', 'editorial', 'google-gemini'],
    tips: 'Replace [PRODUCT] with your exact hardware, cosmetic, or beverage item. Use standard 1:1 or 16:9 aspect ratios for web display.',
    placeholders: ['[PRODUCT]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Specify your product name, primary brand accent colors, desired aspect ratio, and artistic or realistic visual style.',
    expectedOutputType: 'Ultra-crisp commercial product photograph suitable for e-commerce and marketing heroes.',
    exampleUseCase: 'Creating high-converting marketing hero shots for new hardware gadgets or luxury cosmetics.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-reference-inpainting-replacement',
    title: 'Reference-Guided Object Replacement & Inpainting',
    slug: 'gemini-reference-inpainting-replacement',
    description: 'Precise multimodal prompt instructions for swapping elements in an existing scene while matching ambient lighting and shadows.',
    category: 'image-editing-img2img',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Modify the provided reference scene by replacing [ORIGINAL OBJECT] with a premium [PRODUCT]. Preserve the exact ambient illumination direction, warm tungsten fill, shallow depth of field, and table surface woodgrain reflections. The new item must seamlessly integrate into the scene with corresponding contact shadows in [BRAND COLORS] palette, rendered in [VISUAL STYLE] fidelity.',
    tags: ['inpainting', 'image-to-image', 'replacement', 'lighting-match', 'google-gemini'],
    tips: 'Provide a reference image in the Gemini multimodal API alongside this text prompt for pixel-perfect perspective alignment.',
    placeholders: ['[ORIGINAL OBJECT]', '[PRODUCT]', '[BRAND COLORS]', '[VISUAL STYLE]'],
    customizationInstructions: 'Describe the existing item to replace and the new item to insert, along with key ambient lighting cues.',
    expectedOutputType: 'Seamlessly composited scene where the replaced element matches camera perspective and lighting.',
    exampleUseCase: 'Updating legacy product lifestyle shots with a newly launched product SKU without a reshoot.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-consistent-character-multiangle',
    title: 'Multi-Angle Character Consistency Turnaround',
    slug: 'gemini-consistent-character-multiangle',
    description: 'Maintains facial bone structure, hair texture, and outfit details across a full 3-point studio turnaround sheet.',
    category: 'image-editing-img2img',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Character turnaround model sheet displaying three views side-by-side: front view, 45-degree three-quarter view, and full profile view. Subject is [CHARACTER DESCRIPTION] wearing [OUTFIT DETAILS]. Strict facial symmetry, consistent eye color, exact hairline and scar placement across all three angles, neutral white cyclorama background, uniform studio fill light, crisp vector-sharp edges in [VISUAL STYLE] style --ar [ASPECT RATIO]',
    tags: ['character-sheet', 'consistency', 'turnaround', 'game-dev', 'google-gemini'],
    tips: 'Keep outfit descriptions highly specific to prevent Gemini from hallucinating color shifts between perspectives.',
    placeholders: ['[CHARACTER DESCRIPTION]', '[OUTFIT DETAILS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Detail exact facial features, age, expressions, clothing textures, and overall artistic render aesthetic.',
    expectedOutputType: '3-panel character reference sheet maintaining strict anatomical and sartorial identity.',
    exampleUseCase: 'Game development concept art, storyboard character bible, and 3D modeling reference.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-macro-material-texture',
    title: 'Macro Material Texture & Tactile Surface Render',
    slug: 'gemini-macro-material-texture',
    description: 'Generates ultra-close macro detail showing microscopic grain, woven fibers, carbon weave, or liquid droplets.',
    category: '3d-design-product-vis',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Extreme macro close-up of [PRODUCT] focusing on [MATERIAL SPECIFICATION]. Raking grazing light from the side reveals authentic surface micro-relief, subtle subsurface scattering, microscopic tactile imperfections, crisp focal plane with buttery bokeh falloff, color accents calibrated in [BRAND COLORS], photorealistic optical physics in [VISUAL STYLE] --ar [ASPECT RATIO]',
    tags: ['macro', 'textures', 'materials', 'subsurface-scattering', '3d'],
    tips: 'Grazing light (side angle) maximizes depth and perceived texture on matte surfaces.',
    placeholders: ['[PRODUCT]', '[MATERIAL SPECIFICATION]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Specify the material (e.g., anodized bead-blasted aluminum, Italian full-grain leather, carbon fiber).',
    expectedOutputType: '8K-ready macro material render emphasizing tactile craftsmanship.',
    exampleUseCase: 'Landing page feature zoom-ins showing build quality and premium hardware materials.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-cinematic-environmental-establishing',
    title: 'Cinematic Architectural Establishing Landscape',
    slug: 'gemini-cinematic-environmental-establishing',
    description: 'Wide-angle environmental backdrop with atmospheric depth, golden-hour radiance, and architectural harmony.',
    category: 'ai-image-generation',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Wide cinematic establishing shot of [LOCATION/SETTING] captured during [LIGHTING TIME OF DAY]. Dramatic volumetric sun rays piercing through atmospheric haze, natural environmental foliage, crisp architectural silhouettes, deep horizon perspective, color grade emphasizing [BRAND COLORS], shot on Hasselblad H6D-100c with 24mm wide angle, [VISUAL STYLE] aesthetic --ar [ASPECT RATIO]',
    tags: ['environment', 'architectural', 'cinematic', 'landscape', 'volumetric'],
    tips: 'Use volumetric lighting and atmosphere descriptors to give wide scenes scale and physical weight.',
    placeholders: ['[LOCATION/SETTING]', '[LIGHTING TIME OF DAY]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Input the architectural setting, time of day (e.g. dawn, twilight, golden hour), and color tones.',
    expectedOutputType: 'High-dynamic-range panoramic landscape suitable for video production or hero banners.',
    exampleUseCase: 'Website hero backgrounds, concept art keyframes, and video game environment lore.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-modern-app-isometric-vector',
    title: 'Crisp Modern Vector App Icon & Asset',
    slug: 'gemini-modern-app-isometric-vector',
    description: 'Generates clean, scalable isometric 3D UI icons with frosted glass, smooth gradients, and isolated dark backdrops.',
    category: 'ui-ux-design-prototyping',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Isometric 3D render of a futuristic [APP CONCEPT] icon. Features frosted acrylic glass, glossy metallic connectors, floating luminous data glyphs in [BRAND COLORS], clean beveling, soft ambient occlusion shadows, isolated cleanly on dark obsidian (#0A0D14) background, Figma and Apple design language, ultra-clean edges in [VISUAL STYLE] --ar [ASPECT RATIO]',
    tags: ['app-icon', 'isometric', 'vector', 'figma-asset', 'glassmorphism'],
    tips: 'Keep background explicitly isolated on #0A0D14 to make SVG/PNG background removal effortless.',
    placeholders: ['[APP CONCEPT]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Describe the app domain (e.g., AI cloud computing, decentralized payment vault, database query engine).',
    expectedOutputType: 'Modern isometric badge ready for UI components, feature grids, and landing pages.',
    exampleUseCase: 'SaaS homepage feature grids, App Store icons, and documentation graphics.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-minimalist-packaging-mockup',
    title: 'Minimalist Cosmetic Packaging Box Mockup',
    slug: 'gemini-minimalist-packaging-mockup',
    description: 'Editorial packaging presentation with blind debossing, foil stamping, and tactile uncoated paper stock.',
    category: '3d-design-product-vis',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Minimalist luxury packaging box mockup for [PRODUCT]. Uncoated heavy textured paperboard in neutral stone grey, subtle hot-foil stamped typography in [BRAND COLORS], blind debossed minimalist geometric mark, soft diagonal window shadow casting across the box, studio editorial setup, shot on 90mm macro lens in [VISUAL STYLE] --ar [ASPECT RATIO]',
    tags: ['packaging', 'branding', 'mockup', 'foil-stamping', 'editorial'],
    tips: 'Mentioning paper weight and tactile finishes prevents models from rendering artificial high-gloss plastic.',
    placeholders: ['[PRODUCT]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Specify your product packaging format (e.g. perfume cylinder, skincare jar, tech unboxing box).',
    expectedOutputType: 'Photorealistic packaging mockup suitable for brand identity presentations and pitch decks.',
    exampleUseCase: 'Client brand identity presentations, e-commerce pre-order mockups, and portfolio showcases.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-high-contrast-editorial-typography',
    title: 'High-Impact Editorial Poster & Graphic Layout',
    slug: 'gemini-high-contrast-editorial-typography',
    description: 'Swiss-style modern graphic poster featuring bold kinetic typography, strict grid alignment, and geometric framing.',
    category: 'marketing-content-social',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'International Typographic Style modern poster composition. Prominently displays the bold sans-serif headline "[HEADLINE TEXT]" in crisp legibility. Strict modular grid layout, bold contrasting geometric color blocks in [BRAND COLORS], asymmetric balance, halftone texture overlay, high modernist aesthetic, [VISUAL STYLE] execution --ar [ASPECT RATIO]',
    tags: ['typography', 'swiss-style', 'poster', 'graphic-design', 'editorial'],
    tips: 'Gemini Imagen 3 exhibits best-in-class text rendering when headline phrases are kept under 5 words in quotation marks.',
    placeholders: ['[HEADLINE TEXT]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Enter your short slogan or headline text, brand color tokens, and target vertical/horizontal aspect ratio.',
    expectedOutputType: 'Graphic poster design with cleanly legible typography and bold layout balance.',
    exampleUseCase: 'Conference keynotes, social media announcement banners, and physical art prints.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-architectural-interior-natural-light',
    title: 'Scandi Modern Living Space Interior Scene',
    slug: 'gemini-architectural-interior-natural-light',
    description: 'Photorealistic architectural interior featuring soft north-facing daylight, natural oak, and curated furnishings.',
    category: '3d-design-product-vis',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'High-end architectural interior photography of a minimalist [ROOM TYPE]. Light natural white oak flooring, lime-wash plastered walls, floor-to-ceiling panoramic windows filtering soft diffused overcast daylight, [FURNITURE ACCENTS], subtle organic textile throws in [BRAND COLORS], clean linear perspective, Architectural Digest editorial quality, [VISUAL STYLE] --ar [ASPECT RATIO]',
    tags: ['interior-design', 'architecture', 'scandinavian', 'daylight', 'natural-materials'],
    tips: 'Specifying "lime-wash plaster" and "diffused overcast daylight" eliminates harsh digital glare on interior walls.',
    placeholders: ['[ROOM TYPE]', '[FURNITURE ACCENTS]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Define the room type (e.g. open-concept living pavilion, boutique creative studio) and specific furniture.',
    expectedOutputType: 'Pristine architectural interior photograph with gentle shadow gradients.',
    exampleUseCase: 'Real estate marketing, interior styling moodboards, and smart-home lifestyle imagery.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },
  {
    id: 'gemini-ecommerce-apparel-on-model',
    title: 'High-Fashion E-Commerce Apparel on Model',
    slug: 'gemini-ecommerce-apparel-on-model',
    description: 'Studio fashion photography showcasing accurate clothing fit, seam details, and natural fabric drape on a live model.',
    category: 'ai-image-generation',
    targetModel: 'Gemini Nano Banana / Imagen 3',
    provider: 'Google',
    promptText: 'Clean commercial fashion lookbook photograph of [MODEL DETAILS] modeling [PRODUCT]. Posed naturally against a seamless warm alabaster studio backdrop, gentle rim light accentuating clothing silhouette and fabric drape, crisp focus on seams and weave texture, color accurate to [BRAND COLORS], shot on medium format digital back at f/5.6 for full depth of field, [VISUAL STYLE] --ar [ASPECT RATIO]',
    tags: ['fashion', 'fashion-editorial', 'womens-portraits', 'ecommerce', 'apparel', 'lookbook', 'studio'],
    tips: 'Setting f/5.6 ensures the full garment from collar to hem remains sharp and in focus.',
    placeholders: ['[PRODUCT]', '[MODEL DETAILS]', '[BRAND COLORS]', '[ASPECT RATIO]', '[VISUAL STYLE]'],
    customizationInstructions: 'Describe the garment (fabric, cut, styling) and the model demographics, pose, and aesthetic.',
    expectedOutputType: 'Clean commercial fashion lookbook photograph suitable for direct e-commerce product grids.',
    exampleUseCase: 'Apparel brand catalog creation, seasonal lookbooks, and digital store banners.',
    officialToolUrl: 'https://ai.google.dev/gemini-api/docs/image-generation',
    authorOrSource: 'Verified Google Gemini Workflows',
  },

  // ==========================================
  // PHASE D: CLAUDE ARTIFACTS & INTERACTIVE UI (8 Prompts)
  // Official Docs: https://claude.com/features/artifacts
  // ==========================================
  {
    id: 'claude-interactive-saas-dashboard',
    title: 'Production SaaS Analytics Dashboard with Dynamic Charts',
    slug: 'claude-interactive-saas-dashboard',
    description: 'Prompts Claude 3.5 Sonnet to generate a self-contained, interactive single-file React Artifact with live filters, KPIs, and responsive charts.',
    category: 'claude-artifacts-ui',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Create a comprehensive, production-grade SaaS Financial & User Analytics Dashboard as a single-file interactive React Artifact.

Requirements:
1. Tech Stack: React 18, Tailwind CSS, Lucide React icons, and Recharts (or pure SVG responsive charts).
2. KPI Cards: MRR ($124,500 +14.2%), Active Subscribers (3,420 +8.1%), Churn Rate (1.2% -0.4%), and LTV ($2,890). Include sparkline trend graphs.
3. Interactive Controls: Date range selector (Last 7 Days, 30 Days, 90 Days, 1 Year), Plan filter (All, Starter, Pro, Enterprise), and Currency switcher.
4. Visualizations:
   - Monthly Revenue & Expenses Stacked Area Chart with interactive tooltips.
   - Cohort Retention Heatmap matrix.
   - Top conversion channels breakdown bar chart.
5. Interactive Data Table: Recent high-value transactions with search, status badges (Paid, Pending, Refunded), sortable columns, and pagination.
6. Design: Modern dark-slate aesthetic (#0B0F19 background, subtle glassmorphism borders, accessible typography, smooth hover transitions). Provide the complete executable JSX/TSX without placeholders.`,
    tags: ['claude-artifacts', 'dashboard', 'react', 'tailwind', 'analytics'],
    tips: 'Claude Artifacts will render this live in the chat preview panel where you can interact directly with controls.',
    placeholders: ['[KPI METRICS]', '[DATE RANGES]', '[CHART TYPES]'],
    customizationInstructions: 'Modify the financial metrics and chart types to match your exact SaaS business model.',
    expectedOutputType: 'Executable single-file React component rendering an interactive financial dashboard in Claude Artifacts.',
    exampleUseCase: 'Rapid prototyping of client executive portals and pitching SaaS investor dashboards.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-realtime-chat-agent-ui',
    title: 'Multi-Agent Autonomous Chat Interface with Live Stream',
    slug: 'claude-realtime-chat-agent-ui',
    description: 'Creates a full-featured AI chat workspace artifact with agent switching, markdown message rendering, prompt starters, and token metrics.',
    category: 'claude-artifacts-ui',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Build a production-ready AI Copilot Chat Interface as an interactive Claude Artifact.

Features required:
1. Sidebar: Conversation history with search, model/agent selector (Research Agent, Code Architect, Copywriter), and memory retention toggle.
2. Main Chat:
   - Message bubbles with distinct user/assistant styling.
   - Streaming simulated typing effect with cancel button.
   - Code blocks with syntax copy buttons and language pills.
   - Model latency (ms) and token counter telemetry pills.
3. Interactive Bottom Bar: Auto-resizing textarea, file attachment pill simulation, quick prompt chips, and voice input toggle button.
4. UI States: Empty state with starter prompts, active conversation state, and loading skeleton state.
5. Deliver as a complete, fully functional React component using Tailwind CSS and Lucide icons.`,
    tags: ['claude-artifacts', 'chat-ui', 'agent-interface', 'react', 'ai-copilot'],
    tips: 'Use the conversation history selector to test simulated responses across different personas.',
    placeholders: ['[AGENT ROLES]', '[STARTER PROMPTS]'],
    customizationInstructions: 'Customize the agent roles and default starter questions for your target user base.',
    expectedOutputType: 'Full chat workspace artifact with simulated responses, model selection, and message history.',
    exampleUseCase: 'Prototyping generative AI web apps and customer support assistant interfaces.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-interactive-node-flowchart',
    title: 'Interactive Drag-and-Drop Workflow Diagram Editor',
    slug: 'claude-interactive-node-flowchart',
    description: 'Renders an interactive canvas artifact for connecting workflow nodes with dynamic bezier curves and state management.',
    category: 'claude-artifacts-ui',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Create an interactive Node-Based Workflow Builder as a single-file Claude Artifact in React.

Requirements:
1. Canvas: Infinite-feeling grid canvas with pan and zoom controls (+, -, reset).
2. Draggable Nodes: Nodes representing "Webhook Trigger", "LLM Processing", "Branch Condition", and "Database Write".
3. Dynamic Connections: Draw smooth SVG cubic bezier curves between node connector ports that update dynamically as nodes are dragged.
4. Node Inspector: Clicking a node opens a side properties panel to edit node label, parameters, and retry count.
5. Export: Button to export the graph state to structured JSON.
6. Styling: High-tech dark theme, crisp SVG paths, glowing connection ports, and keyboard shortcut helpers. Complete executable code.`,
    tags: ['claude-artifacts', 'workflow-builder', 'svg-nodes', 'canvas', 'interactive'],
    tips: 'Drag nodes around the canvas to inspect dynamic SVG curve calculations in real time.',
    placeholders: ['[NODE TYPES]', '[CANVAS THEME]'],
    customizationInstructions: 'Define custom node categories like data transformers, notification channels, or API triggers.',
    expectedOutputType: 'Interactive node graph editor where users can reposition nodes and configure properties.',
    exampleUseCase: 'Demonstrating zapier/n8n automation workflows to non-technical stakeholders.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-responsive-design-system-tokens',
    title: 'Accessible Tailwind Design System Component Suite',
    slug: 'claude-responsive-design-system-tokens',
    description: 'Generates a live interactive component playground showcasing buttons, inputs, modals, toasts, and badges with light/dark toggling.',
    category: 'ui-ux-design-prototyping',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Develop an Interactive Design System Showcase as a Claude Artifact.

Components to showcase:
1. Buttons: Primary, secondary, outline, destructive, ghost, with loading states and icon variants.
2. Form Inputs: Text, password with visibility toggle, select dropdown, checkbox, radio group, and slider with live value display.
3. Feedback: Dismissible toast notifications (success, error, info), modal dialog with backdrop blur, and tooltip hover targets.
4. Cards: Stat card, user profile card, and feature announcement card.
5. Interactive Theme Switcher: Toggle between Dark, Light, and High-Contrast modes, changing all CSS variables dynamically.
6. Tabbed View: Switch between "Components Preview", "Color Palette Tokens", and "Typography Hierarchy". Executable code.`,
    tags: ['claude-artifacts', 'design-system', 'tailwind', 'accessible', 'tokens'],
    tips: 'Use the interactive theme toggle inside the artifact to test contrast compliance across states.',
    placeholders: ['[COLOR PALETTE]', '[COMPONENT VARIANTS]'],
    customizationInstructions: 'Swap in your brand color tokens and custom font families.',
    expectedOutputType: 'Component library sandbox with live state toggles and accessible keyboard focus.',
    exampleUseCase: 'Sharing living design system specifications between designers and frontend engineers.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-microinteraction-motion-playground',
    title: 'Physics-Based Micro-Interaction Sandbox',
    slug: 'claude-microinteraction-motion-playground',
    description: 'Renders delight-focused micro-interactions including spring-physics like buttons, floating orbs, and card tilts.',
    category: 'motion-design-animation',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Build an interactive UI Micro-Interactions Showcase artifact in React.

Feature 6 distinct interactive micro-animations:
1. 3D Gyroscopic Card Tilt: Mouse movement over the card recalculates 3D rotateX and rotateY with dynamic specular light reflection.
2. Particle Confetti Burst: Clicking a "Claim Reward" button triggers a multi-colored canvas/DOM particle explosion.
3. Magnetic Cursor Magnet: A floating CTA button that subtly gravitates toward the user's cursor when nearby.
4. Multi-Step Progress Tracker: Smooth morphing progress bar that pulses with SVG checkmark celebrations.
5. Drag-to-Dismiss Card Stack: Swipeable cards with velocity threshold detection and spring snap-back.
6. Ambient Glowing Orb: Interactive fluid gradient sphere responding to click ripples.
Use pure React and CSS transitions/transforms without external animation libraries.`,
    tags: ['claude-artifacts', 'micro-interactions', 'motion', 'physics', 'ui-delight'],
    tips: 'Test mouse hovering over the 3D card tilt to see realistic specular glare reflection.',
    placeholders: ['[ANIMATION STYLES]'],
    customizationInstructions: 'Adjust spring damping and stiffness values to match your application tone.',
    expectedOutputType: 'Interactive sandbox demonstrating responsive tactile feedback for modern web interfaces.',
    exampleUseCase: 'Polishing web app user delight, onboarding flows, and reward celebrations.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-sortable-datagrid-csv-export',
    title: 'High-Performance Filterable Data Grid with CSV Export',
    slug: 'claude-sortable-datagrid-csv-export',
    description: 'Full-featured enterprise data table with multi-column sorting, fuzzy search, bulk row selection, and client-side CSV download.',
    category: 'claude-artifacts-ui',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Create an enterprise Data Table Component as a single-file Claude Artifact in React.

Features:
1. Dataset: 30 mock customer records with fields: ID, Name, Company, Plan, ARR ($), Status, Last Active, Actions.
2. Filtering & Search: Global fuzzy search box, multi-select Plan filter, and Status toggle chips.
3. Sorting: Clickable column headers with ascending/descending indicators and secondary sort support.
4. Bulk Actions: Checkbox select-all, individual row checkboxes, and a floating bulk-action toolbar (Delete Selected, Export Selected).
5. Pagination: Configurable rows per page (5, 10, 25) with page numbers and jump-to-page input.
6. CSV Export: One-click "Export to CSV" that dynamically compiles the currently filtered rows and triggers an instant browser download.
7. Polished dark mode layout with sticky table header.`,
    tags: ['claude-artifacts', 'data-grid', 'csv-export', 'table', 'enterprise-ui'],
    tips: 'Click "Export to CSV" inside the Claude Artifact to generate a real client-side download.',
    placeholders: ['[DATASET SCHEMA]', '[PAGE SIZES]'],
    customizationInstructions: 'Replace the mock customer dataset with your specific database or CRM table schema.',
    expectedOutputType: 'Functional enterprise data table with active sorting, search, and CSV export capabilities.',
    exampleUseCase: 'Internal ops dashboards, CRM contact management, and billing transaction registers.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-kanban-drag-drop-board',
    title: 'Interactive Kanban Board with Task State Persistence',
    slug: 'claude-kanban-drag-drop-board',
    description: 'Generates a complete Kanban task management board supporting column reordering, task creation, tag filters, and local storage.',
    category: 'claude-artifacts-ui',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Build an interactive Kanban Task Management Board as a Claude Artifact in React.

Requirements:
1. Columns: "Backlog", "In Progress", "Code Review", and "Done" with task counters.
2. Task Cards: Title, priority badge (Low, Medium, High, Urgent), assignee avatar, due date, and subtask progress bar (e.g. 2/4 completed).
3. Drag & Drop: Drag cards between columns with smooth hover highlighting and reordering.
4. Task Creation: Quick inline "Add Task" button at the bottom of each column with title and priority input.
5. Search & Filter: Filter cards by priority or assignee name.
6. Card Details Modal: Clicking a card opens a modal to view descriptions and toggle subtask checkboxes.
7. Dark theme design with distinctive column border colors and keyboard accessibility.`,
    tags: ['claude-artifacts', 'kanban', 'project-management', 'drag-and-drop', 'react'],
    tips: 'Drag cards into the "Done" column to observe automatic status badge updates.',
    placeholders: ['[COLUMNS]', '[PRIORITY LEVELS]'],
    customizationInstructions: 'Configure columns to match your sprint workflow (e.g. Triage, In Dev, QA, Released).',
    expectedOutputType: 'Fully functional Kanban board with drag-and-drop state updates and inline editing.',
    exampleUseCase: 'Sprint planning simulations, team roadmap visualizations, and productivity apps.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },
  {
    id: 'claude-markdown-docs-code-runner',
    title: 'Interactive Developer Docs Viewer with Syntax Highlighting',
    slug: 'claude-markdown-docs-code-runner',
    description: 'Generates a modern documentation portal artifact with table-of-contents navigation, syntax highlighting, and copyable snippets.',
    category: 'claude-artifacts-ui',
    targetModel: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: `Create an interactive Developer Documentation Portal as a Claude Artifact in React.

Structure:
1. Sidebar: Tree navigation for documentation sections ("Getting Started", "Authentication", "REST Endpoints", "Webhooks", "SDKs").
2. Table of Contents (Right Rail): Automatically reflects active header scroll position with smooth jump links.
3. Content Area:
   - Formatted markdown with callout alert boxes (Note, Warning, Tip, Caution).
   - Code Blocks: Multi-language tab switcher (cURL, TypeScript, Python, Go) with instant copy-to-clipboard button.
   - Interactive API Endpoint Tester: Mock input fields for endpoint parameters with a "Send Request" button displaying sample 200 OK JSON responses.
4. Quick Search: Command+K search modal overlay with highlighted matching headings.
5. Professional developer theme inspired by Stripe and Supabase docs.`,
    tags: ['claude-artifacts', 'documentation', 'api-docs', 'syntax-highlight', 'developer-portal'],
    tips: 'Use the interactive API tester to simulate sending requests and inspect response payloads.',
    placeholders: ['[API ENDPOINTS]', '[CODE LANGUAGES]'],
    customizationInstructions: 'Populate the endpoints and code examples with your actual REST or GraphQL service specifications.',
    expectedOutputType: 'Stripe-quality documentation reader with code switcher and simulated API request sandbox.',
    exampleUseCase: 'Publishing API documentation, onboarding technical developers, and SDK guides.',
    officialToolUrl: 'https://claude.com/features/artifacts',
    authorOrSource: 'Anthropic Claude Artifacts Patterns',
  },

  // ==========================================
  // PHASE F: WEB & APP DEVELOPMENT (5 Prompts)
  // Master Autonomous Agent, Full-Stack, Landing Page, Forms, APIs
  // ==========================================
  {
    id: 'master-autonomous-coding-agent-orchestrator',
    title: 'Master Autonomous Coding-Agent Execution Protocol',
    slug: 'master-autonomous-coding-agent-orchestrator',
    description: 'The definitive prompt protocol for coding agents (Cursor, Windsurf, Claude Code, Copilot) to inspect, plan, write, and verify code without regressions.',
    category: 'coding-debug-refactor',
    targetModel: 'Claude 3.5 Sonnet / Cursor / Claude Code',
    provider: 'Cursor',
    promptText: `You are an elite Staff Software Engineer operating as an autonomous coding agent. Execute the following engineering task with disciplined software craft:

TASK GOAL: [EXACT FEATURE OR FIX REQUIREMENT]
TARGET DIRECTORIES: [PATH OR MODULE CONSTRAINTS]

MANDATORY EXECUTION PROTOCOL:
Phase 1: Deep Reconnaissance (Do Not Blindly Overwrite)
- Inspect existing files, package dependencies, and architecture patterns before authoring code.
- Identify existing data types, shared utilities, and component styling conventions.
- Never delete working tests or remove documented features.

Phase 2: Architectural Plan & Stepwise Execution
- Formulate a surgical, incremental plan.
- Ensure strict TypeScript typing (no 'any' shortcuts, comprehensive interface definitions).
- Handle edge cases: null/undefined checks, network latency, aborted requests, empty states, and error boundaries.

Phase 3: Automated Verification
- Write or update unit/integration tests covering new logic and potential regressions.
- Execute the test suite and verify every test passes with zero failures.
- Run typecheck ('tsc --noEmit') and production build ('npm run build') to verify zero compilation errors.

Phase 4: Structured Completion Report
- Provide a concise summary of root causes, modified files, added tests, and verification output. Proceed autonomously.`,
    tags: ['autonomous-agent', 'cursor-rules', 'claude-code', 'engineering-protocol', 'verification'],
    tips: 'Paste this into Cursor Rules (.cursorrules), CLAUDE.md, or direct agent prompts to eliminate hallucinated code and regressions.',
    placeholders: ['[EXACT FEATURE OR FIX REQUIREMENT]', '[PATH OR MODULE CONSTRAINTS]'],
    customizationInstructions: 'Fill in your specific ticket requirements and project file paths before dispatching to your agent.',
    expectedOutputType: 'Rigorous step-by-step code execution with full test validation and clean build passing.',
    exampleUseCase: 'Complex multi-file refactoring, production bug fixing, and automated feature implementation.',
    officialToolUrl: 'https://cursor.com',
    authorOrSource: 'SwitchRoute Engineering Team',
  },
  {
    id: 'modern-landing-page-conversion-engine',
    title: 'High-Conversion SaaS Landing Page in Next.js & Tailwind',
    slug: 'modern-landing-page-conversion-engine',
    description: 'Prompts AI to build a complete conversion-optimized landing page with sticky nav, hero, social proof, bento grid, pricing, and FAQ.',
    category: 'website-landing-page',
    targetModel: 'Claude 3.5 Sonnet / Cursor',
    provider: 'Anthropic',
    promptText: `Build a modern, high-converting SaaS Landing Page for [PRODUCT_NAME] in Next.js 14 App Router and Tailwind CSS.

Include the following sequential sections:
1. Sticky Header: Glassmorphism blur, company logo, nav links (Features, Pricing, Wall of Love, Docs), theme toggle, and "Start Free Trial" CTA.
2. Hero Section:
   - Social proof badge: "Trusted by 10,000+ developers at top engineering teams".
   - High-impact headline: "[PRIMARY_VALUE_PROPOSITION]".
   - Subhead clarifying pain points solved in under 20 words.
   - Dual CTAs: Primary pill button with glowing hover effect, secondary "Watch 2-Min Demo" with modal trigger.
   - Interactive product UI preview frame with simulated real-time data glow.
3. Social Proof Marquee: Infinite auto-scrolling logo strip of 8 leading tech companies.
4. Bento Grid Features: 4 asymmetric feature cards showcasing [KEY_FEATURES] with animated micro-charts.
5. Interactive Pricing Matrix: Monthly/Annual billing toggle (highlighting 20% savings badge), 3 tier cards (Starter, Growth, Enterprise), feature checkmarks, and recommended tier callout.
6. FAQ Accordion: Accessible disclosure cards answering top 5 buyer objections.
7. Footer: Newsletter signup, product links, legal disclosures, and copyright. Code must be fully responsive and accessible.`,
    tags: ['landing-page', 'saas', 'nextjs', 'tailwind', 'conversion'],
    tips: 'Specify exact value proposition and brand keywords for tailored copywriting in the generated output.',
    placeholders: ['[PRODUCT_NAME]', '[PRIMARY_VALUE_PROPOSITION]', '[KEY_FEATURES]'],
    customizationInstructions: 'Input your product name, core pitch, and key product differentiators.',
    expectedOutputType: 'Production-ready Next.js / Tailwind landing page component with responsive layout.',
    exampleUseCase: 'Launching a new SaaS startup, MVP waitlist page, or developer tool marketing site.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'SwitchRoute Engineering Team',
  },
  {
    id: 'fullstack-auth-crud-postgresql-schema',
    title: 'Full-Stack CRUD Application with Prisma & NextAuth',
    slug: 'fullstack-auth-crud-postgresql-schema',
    description: 'Generates a robust full-stack architecture with Prisma ORM schemas, NextAuth OAuth & magic links, and protected server actions.',
    category: 'full-stack-development',
    targetModel: 'Claude 3.5 Sonnet / Cursor',
    provider: 'Anthropic',
    promptText: `You are a principal full-stack engineer. Build a secure, scalable CRUD architecture for [APPLICATION_NAME] using Next.js App Router, Prisma ORM, PostgreSQL, and Auth.js (NextAuth v5).

Deliverables:
1. 'prisma/schema.prisma':
   - User, Account, Session, VerificationToken models for Auth.js.
   - Domain entity model '[RESOURCE_NAME]' with fields (id, userId, title, status, metadata Json, timestamps).
   - Optimized indexes for queries by userId and status.
2. Server Actions ('actions/[resource].ts'):
   - 'createResource', 'getResources', 'updateResource', 'deleteResource'.
   - Validate incoming payloads with strict Zod schemas.
   - Verify session authentication and tenant ownership before any mutation.
   - Revalidate appropriate path tags with 'revalidatePath'.
3. React Client Component:
   - Optimistic UI updates using 'useOptimistic'.
   - Loading skeletons and accessible error toast triggers on failed mutations.
4. PostgreSQL RLS policies specification for defense-in-depth security.`,
    tags: ['full-stack', 'prisma', 'postgresql', 'authjs', 'server-actions'],
    tips: 'Ask the model to implement optimistic updates to deliver instantaneous user feedback.',
    placeholders: ['[APPLICATION_NAME]', '[RESOURCE_NAME]'],
    customizationInstructions: 'Define your application name and the primary entity you want users to manage (e.g. Projects, Invoices, Workflows).',
    expectedOutputType: 'Complete full-stack implementation including Prisma schema, authenticated Server Actions, and UI.',
    exampleUseCase: 'Scaffolding scalable authenticated SaaS backends with database integrity.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'SwitchRoute Engineering Team',
  },
  {
    id: 'accessible-form-engine-zod-validation',
    title: 'Type-Safe Accessible Form Engine with Zod & React Hook Form',
    slug: 'accessible-form-engine-zod-validation',
    description: 'Generates accessible, type-safe multi-field form components with asynchronous validation, field arrays, and WCAG AA compliance.',
    category: 'frontend-development',
    targetModel: 'Claude 3.5 Sonnet / Cursor',
    provider: 'Anthropic',
    promptText: `Write a production-grade, accessible form component in React and TypeScript using 'react-hook-form' and '@hookform/resolvers/zod'.

Form requirements:
1. Fields: Name, Email (with async domain check), Password (with live strength meter scoring 4 criteria), Country Select, Terms Checkbox, and Dynamic Tag Array (add/remove items).
2. Zod Schema: Strict types, custom regex patterns, and descriptive error messages for every failure state.
3. Accessibility:
   - Proper 'aria-invalid', 'aria-describedby', and 'role="alert"' linkages for error states.
   - Screen-reader announceable validation feedback.
   - High-contrast visible focus rings conforming to WCAG 2.1 AA.
4. State Handling: Disabled submit button while isSubmitting or isValidating, inline spinner, server-side error mapping, and form reset on success.
5. Unit Test: Vitest / React Testing Library test suite validating error triggers on empty submit and happy-path submission.`,
    tags: ['forms', 'react-hook-form', 'zod', 'accessibility', 'wcag'],
    tips: 'Use aria-describedby pointing to error IDs to ensure blind and low-vision users receive error notices immediately.',
    placeholders: ['[FIELD_LIST]'],
    customizationInstructions: 'Customize the list of form fields and validation rules to match your onboarding or checkout flow.',
    expectedOutputType: 'Complete accessible form component with Zod validation, error feedback, and unit tests.',
    exampleUseCase: 'User registration flows, enterprise settings forms, and multi-step checkout processes.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'SwitchRoute Engineering Team',
  },
  {
    id: 'resilient-rest-trpc-backend-router',
    title: 'Resilient tRPC / Express API Router with JWT & Rate Limiting',
    slug: 'resilient-rest-trpc-backend-router',
    description: 'Constructs a resilient Node.js / TypeScript API router featuring token bucket rate limiting, JWT verification, and standardized error responses.',
    category: 'web-app-development',
    targetModel: 'Claude 3.5 Sonnet / Cursor',
    provider: 'Cursor',
    promptText: `Build an enterprise-grade backend API router in TypeScript (Express or tRPC) for [API_SERVICE_NAME].

Architecture requirements:
1. Middleware Pipeline:
   - Structured JSON logging with request-id tracing (Winston / Pino).
   - Redis-backed sliding window rate limiter (100 requests per 15 minutes per IP/Token).
   - Strict CORS configuration and security headers with Helmet.
   - JWT authentication middleware parsing Bearer tokens with cryptographic expiration checks.
2. Endpoints / Procedures:
   - GET /api/v1/[RESOURCE]: Pagination with cursor support, sort direction, and field filtering.
   - POST /api/v1/[RESOURCE]: Idempotency key header handling to prevent duplicate billing or writes.
3. Error Handling:
   - Global error handler catching Zod validation errors, database constraint violations, and unhandled rejections.
   - Return standardized RFC 7807 Problem Details JSON format.
4. Integration Test: Supertest suite covering rate limit exhaustion (429) and invalid token rejection (401).`,
    tags: ['backend', 'trpc', 'api-router', 'rate-limiting', 'jwt'],
    tips: 'Idempotency keys on POST requests prevent duplicate customer charges during network retry spikes.',
    placeholders: ['[API_SERVICE_NAME]', '[RESOURCE]'],
    customizationInstructions: 'Define your service name and the resource endpoints to scaffold.',
    expectedOutputType: 'Hardened backend router code with middleware, rate limiting, and RFC 7807 error responses.',
    exampleUseCase: 'Building reliable public API services, microservice endpoints, and payment integrations.',
    officialToolUrl: 'https://cursor.com',
    authorOrSource: 'SwitchRoute Engineering Team',
  },

  // ==========================================
  // PHASE G: HIGGSFIELD AI VIDEO GENERATION (12 Prompts)
  // Official Docs: https://higgsfield.ai/
  // Camera movements, vertical 9:16, dynamic choreography
  // ==========================================
  {
    id: 'higgsfield-vertical-fashion-reel-motion',
    title: 'Vertical 9:16 High-Fashion Fabric Motion Reel',
    slug: 'higgsfield-vertical-fashion-reel-motion',
    description: 'Choreographed for Higgsfield AI mobile generation with fluid fabric movement, slow-motion wind sway, and cinematic lighting.',
    category: 'ai-video-generation',
    mediaType: 'video',
    promptProvenance: 'suggested-recreation',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    videoDetails: { previewUrl: '/prompts/generated/higgsfield-vertical-fashion-reel-motion.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://higgsfield.ai/', creatorAttribution: 'Original SwitchRoute prompt and preview; no third-party video reused.', permissionStatus: 'Original local poster; official provider link only.', aspectRatio: '9:16', guideSlugs: ['cinematic-ai-video-workflow'] },
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Vertical 9:16 cinematic video prompt for Higgsfield AI: High-fashion model walking in graceful slow motion across an illuminated rooftop runway at dusk. Oversized flowing iridescent silk cape billows in natural wind gusts with hyper-realistic fabric physics and ripple dynamics. Soft continuous low-angle tracking camera advancing smoothly backwards. Warm sunset backlight casting luminous rim light along silk edges. 60fps cinematic fluidity, zero morphing artifacts, photorealistic editorial lookbook quality.',
    tags: ['higgsfield', 'vertical-video', 'fashion', 'slow-motion', 'fabric-physics'],
    tips: 'Higgsfield excels at vertical 9:16 framing. Specify wind direction and fabric type for realistic fluid physics.',
    placeholders: ['[OUTFIT_TYPE]', '[LOCATION]', '[LIGHTING]'],
    customizationInstructions: 'Specify your model styling, fabric material (silk, velvet, metallic foil), and urban or natural setting.',
    expectedOutputType: 'Ultra-smooth 9:16 vertical video clip with realistic slow-motion fabric dynamics.',
    exampleUseCase: 'Instagram Reels, TikTok creative campaigns, and luxury fashion brand announcements.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-360-orbital-automotive-sweep',
    title: '360° Seamless Orbital Automotive Hero Sweep',
    slug: 'higgsfield-360-orbital-automotive-sweep',
    description: 'Executes a continuous 360-degree rotational camera orbit around a luxury vehicle with dynamic reflections and studio lighting.',
    category: 'cinematic-camera-vfx',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI camera control prompt: Continuous 360-degree orbital camera sweep rotating smoothly around a sculpted midnight-matte electric supercar parked inside an infinity mirror studio. The camera maintains a steady low 3-foot height, moving counter-clockwise at constant speed. Overhead linear LED strip lights reflect sequentially across curved body panels and aerodynamic carbon fiber spoilers. High frame rate, steady gimbal motion, pristine automotive commercial render.',
    tags: ['higgsfield', 'automotive', 'camera-orbit', 'commercial', 'reflections'],
    tips: 'Use "constant rotational velocity" in Higgsfield camera controls to keep orbit speeds steady without sudden jerks.',
    placeholders: ['[VEHICLE_TYPE]', '[STUDIO_SETTING]', '[LIGHTING_STYLE]'],
    customizationInstructions: 'Change vehicle model and studio environment (e.g. desert highway, futuristic neon hangar).',
    expectedOutputType: 'Commercial automotive hero video with continuous 360-degree rotational sweep.',
    exampleUseCase: 'Supercar launches, automotive commercials, and 3D vehicle showcase reels.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-whip-pan-architectural-transition',
    title: 'Dynamic Whip-Pan Architectural Space Reveal',
    slug: 'higgsfield-whip-pan-architectural-transition',
    description: 'High-speed directional whip pan camera transition connecting two distinct architectural spaces with authentic motion blur.',
    category: 'cinematic-camera-vfx',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI camera transition prompt: Camera starts inside a minimalist concrete brutalist living room, smoothly pushing in toward a floor-to-ceiling glass wall, then rapidly executes a fast lateral whip-pan to the right with realistic optical motion blur. The whip pan seamlessly snaps to a stop inside a lush tropical interior courtyard with cascading water features and dappled sunlight. Continuous uninterrupted momentum, natural shutter angle blur, cinematic spatial transition.',
    tags: ['higgsfield', 'whip-pan', 'camera-transition', 'architecture', 'motion-blur'],
    tips: 'Whip pans create natural match cuts between scenes when stitched into video editors.',
    placeholders: ['[INITIAL_SPACE]', '[DESTINATION_SPACE]'],
    customizationInstructions: 'Define the two architectural environments to transition between.',
    expectedOutputType: 'High-speed directional whip-pan clip ideal for seamless video transitions.',
    exampleUseCase: 'Architectural walkthrough reels, hospitality marketing, and real estate promos.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-macro-liquid-pour-commercial',
    title: 'Macro High-Speed Liquid Splash & Beverage Pour',
    slug: 'higgsfield-macro-liquid-pour-commercial',
    description: 'High-speed 1000fps macro simulation of liquid pouring into glass with refractive bubbles, droplets, and surface tension.',
    category: 'ai-video-generation',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI high-speed macro video: Extreme close-up shot recorded at simulated 1000fps phantom camera speed. Amber craft beverage pours in a crystalline stream into a heavy crystal tumbler with a single clear artisanal ice sphere. Micro-droplets splash upward in hyper-slow motion, suspended in mid-air with light refractively sparkling through individual droplets. Soft golden backlighting, macro depth of field with creamy background blur, premium beverage commercial quality.',
    tags: ['higgsfield', 'macro', 'liquid-physics', 'high-speed', 'beverage'],
    tips: 'Specifying 1000fps phantom camera speed guides Higgsfield into generating micro-droplet suspension.',
    placeholders: ['[LIQUID_TYPE]', '[CONTAINER]', '[LIGHTING]'],
    customizationInstructions: 'Swap beverage type (e.g., espresso pour, sparkling water, fruit smoothie) and glassware.',
    expectedOutputType: 'Slow-motion macro fluid dynamics video suitable for broadcast commercials.',
    exampleUseCase: 'Beverage advertising, food and hospitality promos, and visual effects reels.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-drone-descending-push-in-sunset',
    title: 'Cinematic Drone Push-In Over Coastal Cliffs',
    slug: 'higgsfield-drone-descending-push-in-sunset',
    description: 'Smooth aerial drone shot descending from high vantage point down to crashing coastal ocean waves during sunset.',
    category: 'cinematic-camera-vfx',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI aerial camera prompt: Cinematic FPV drone camera gliding smoothly forward and descending gracefully from 200 feet above dramatic black volcanic ocean cliffs down toward crashing emerald waves below. Golden hour sun dipping below the horizon casts long shadows across rugged sea stacks and sea foam spray. The camera maintains continuous forward push-in with gentle downward tilt. 4K aerial resolution, natural atmospheric mist, epic cinematic film score tone.',
    tags: ['higgsfield', 'drone-shot', 'aerial', 'cinematic', 'landscape'],
    tips: 'Combine forward push-in with a steady downward tilt to create expansive scale.',
    placeholders: ['[LANDSCAPE_LOCATION]', '[TIME_OF_DAY]'],
    customizationInstructions: 'Input desired landscape features such as mountain passes, desert dunes, or pine forest canyons.',
    expectedOutputType: 'Epic descending drone flight clip with steady camera trajectory and natural lighting.',
    exampleUseCase: 'Travel documentaries, outdoor adventure commercials, and YouTube cinematic intros.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-character-emotional-microgesture',
    title: 'Character Emotional Shift & Micro-Gesture Reveal',
    slug: 'higgsfield-character-emotional-microgesture',
    description: 'Directs character facial animation with authentic eye saccades, breathing micro-movements, and subtle emotional transitions.',
    category: 'ai-video-generation',
    mediaType: 'video',
    promptProvenance: 'suggested-recreation',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    videoDetails: { previewUrl: '/prompts/generated/higgsfield-character-emotional-microgesture.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://higgsfield.ai/', creatorAttribution: 'Original SwitchRoute prompt and preview; no third-party video reused.', permissionStatus: 'Original local poster; official provider link only.', aspectRatio: '9:16' },
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Create a short cinematic character-performance clip: an expressive adult protagonist looks through a rain-streaked window, shifting naturally from quiet reflection into a faint confident smile. Preserve the same facial identity and proportions throughout. Include subtle eye movements, gentle breathing, warm room-lamp reflections in the eyes, and softly focused raindrops outside. Use a stable intimate 50mm close-up with restrained motion and realistic skin. Avoid face morphing, exaggerated expression, abrupt camera movement, text, or logos.',
    tags: ['higgsfield', 'character-animation', 'micro-gestures', 'facial-performance', 'cinematic'],
    tips: 'This is an original suggested recreation prompt. Keep the camera steady and describe the start and end expressions to reduce face drift.',
    placeholders: ['[EMOTIONAL_TRANSITION]', '[SETTING]'],
    customizationInstructions: 'Describe the starting and ending emotional states and environment.',
    expectedOutputType: 'Realistic cinematic character close-up demonstrating nuanced performance and natural expressions.',
    exampleUseCase: 'Dramatic film storyboarding, video game cutscenes, and emotional narrative ads.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Original SwitchRoute suggested recreation; no provider prompt or creator clip reused.',
  },
  {
    id: 'higgsfield-highspeed-action-parallax-tracking',
    title: 'High-Speed Parallax Lateral Tracking Shot',
    slug: 'higgsfield-highspeed-action-parallax-tracking',
    description: 'Fast lateral tracking camera moving parallel to an athlete running through urban environments with strong background parallax.',
    category: 'cinematic-camera-vfx',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI camera tracking prompt: Dynamic high-speed lateral tracking camera mounted on a pursuit vehicle traveling at 30mph parallel to an athlete sprinting through an industrial dockyard. Foreground shipping containers and metal beams streak past the camera with intense optical parallax blur, while the runner remains crisply centered in sharp focus. Low-angle perspective, dynamic kick of dust and gravel, gritty film grading, high-energy sports commercial aesthetic.',
    tags: ['higgsfield', 'tracking-shot', 'parallax', 'action', 'sports'],
    tips: 'Layering foreground obstacles (like pillars or fences) heightens the visual sensation of speed.',
    placeholders: ['[SUBJECT_ACTION]', '[ENVIRONMENT]'],
    customizationInstructions: 'Change subject action (e.g. cyclist sprinting, sports car accelerating) and setting.',
    expectedOutputType: 'High-energy lateral tracking shot with pronounced depth parallax.',
    exampleUseCase: 'Athletic wear commercials, fitness brand reels, and action film sequences.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-silhouette-lighting-foggy-glass',
    title: 'Moody Backlit Silhouette Behind Steamy Glass',
    slug: 'higgsfield-silhouette-lighting-foggy-glass',
    description: 'Atmospheric video sequence featuring backlighting, volumetric condensation, and fingers wiping a viewing window.',
    category: 'ai-video-generation',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI moody cinematic prompt: Dark moody interior where a solitary figure stands behind a pane of steamy, condensed glass. Cool blue backlight casts a crisp silhouette of the character. The figure slowly reaches up and wipes a horizontal streak through the condensation with their fingers, revealing warm vibrant city lights glowing in the street below through the cleared glass. Steam condensation beads roll down naturally. Slow, deliberate camera push-in.',
    tags: ['higgsfield', 'silhouette', 'backlighting', 'condensation', 'moody'],
    tips: 'Wiping glass creates a compelling before/after reveal within a single continuous take.',
    placeholders: ['[FIGURE_DETAILS]', '[REVEALED_BACKGROUND]'],
    customizationInstructions: 'Describe the person in silhouette and what is revealed outside the window.',
    expectedOutputType: 'Atmospheric cinematic shot with physical condensation interaction and lighting contrast.',
    exampleUseCase: 'Music video sequences, suspense trailers, and evocative brand storytelling.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-isometric-miniature-stopmotion',
    title: 'Tilt-Shift Miniature Diorama Stop-Motion',
    slug: 'higgsfield-isometric-miniature-stopmotion',
    description: 'Simulates miniature tilt-shift photography with shallow horizontal focal band and playful stop-motion frame rate.',
    category: 'motion-design-animation',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI tilt-shift animation prompt: Isometric high-angle view of a bustling miniature European village harbor rendered with extreme tilt-shift optical blur (sharp horizontal focal band across the center, creamy blurred top and bottom). Tiny colorful fishing boats bob playfully on turquoise water with charming 12fps claymation/stop-motion cadence. Miniature toy figurines walk along cobblestones carrying microscopic market crates. Vibrant saturated colors, warm sunny day, whimsical diorama charm.',
    tags: ['higgsfield', 'tilt-shift', 'stop-motion', 'miniature', 'claymation'],
    tips: 'Setting a 12fps stepped frame rate mimics genuine physical stop-motion animation.',
    placeholders: ['[MINIATURE_SCENE]', '[WEATHER_SETTING]'],
    customizationInstructions: 'Design your miniature diorama theme (e.g. train station, winter ski resort, busy metropolis).',
    expectedOutputType: 'Playful tilt-shift miniature animation clip with charming stop-motion timing.',
    exampleUseCase: 'Brand explainer intros, animated infographics, and playful social media content.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-cyberpunk-neon-rain-chase',
    title: 'Futuristic Hovercraft Rain Chase Parallax',
    slug: 'higgsfield-cyberpunk-neon-rain-chase',
    description: 'Fast-paced sci-fi chase sequence through towering rainy metropolis canyons with neon reflections and engine exhaust flares.',
    category: 'ai-video-generation',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI sci-fi video prompt: Fast-paced forward tracking camera chasing a sleek aerodynamic hovercraft weaving between soaring cyberpunk skyscrapers in a torrential midnight rainstorm. Blue plasma engine thrusters emit pulsing particle contrails. Holographic vertical advertisements in magenta and cyan reflect across wet metallic facades and camera lens rain droplets. Dynamic camera roll and banking as the craft navigates tight turns. Blade Runner 2049 aesthetic, photorealistic atmospheric physics.',
    tags: ['higgsfield', 'cyberpunk', 'sci-fi', 'neon', 'action-chase'],
    tips: 'Adding camera banking and roll during turns heightens the visceral velocity of flying vehicles.',
    placeholders: ['[VEHICLE_DESIGN]', '[CITY_THEME]'],
    customizationInstructions: 'Specify vehicle propulsion colors and neon architectural landmarks.',
    expectedOutputType: 'High-octane futuristic chase sequence with atmospheric rain and volumetric neon lighting.',
    exampleUseCase: 'Game cinematic trailers, sci-fi worldbuilding showcases, and electronic music visuals.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-dolly-zoom-vertigo-effect',
    title: 'Dramatic Vertigo Dolly Zoom Character Reveal',
    slug: 'higgsfield-dolly-zoom-vertigo-effect',
    description: 'Executes the classic in-camera Vertigo contra-zoom (dolly in while zooming out) to convey sudden realization or disorientation.',
    category: 'cinematic-camera-vfx',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI camera movement prompt: Classic cinematic Vertigo effect (contra-zoom/dolly-zoom). Camera physically dollies forward toward the subject while the focal length zooms out simultaneously at an inverted proportional rate. The character’s face remains exactly the same size in the center frame, while the grand museum hall background dramatically warps, expands, and rushes backwards in perspective distortion. Natural facial tension, high dramatic tension, Hitchcockian cinematic mastery.',
    tags: ['higgsfield', 'dolly-zoom', 'vertigo-effect', 'camera-move', 'cinematic'],
    tips: 'The Vertigo effect is ideal for pivotal moments of revelation, shock, or psychological vertigo.',
    placeholders: ['[SUBJECT]', '[HALL_SETTING]'],
    customizationInstructions: 'Specify your character and the background architecture that expands behind them.',
    expectedOutputType: 'Masterclass contra-zoom shot with warping spatial background perspective.',
    exampleUseCase: 'Dramatic short film peaks, psychological thriller trailers, and high-impact reveals.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },
  {
    id: 'higgsfield-seamless-motion-graphic-loop',
    title: 'Hypnotic Seamless Kinetic Motion Graphic Loop',
    slug: 'higgsfield-seamless-motion-graphic-loop',
    description: 'Perfect 10-second seamless video loop of evolving iridescent geometric ribbons and floating metallic spheres.',
    category: 'motion-design-animation',
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Higgsfield AI looping animation prompt: Perfectly seamless 10-second kinetic motion graphic loop. Intertwined ribbons of liquid chrome and translucent frosted glass twist and flow through 3D space in endless mathematical harmony. Floating metallic spheres orbit around the central vortex with gentle physics. Soft studio illumination, iridescent chromatic aberration along edges, dark slate background (#0A0E17). The final frame matches the initial frame with zero jump or stutter.',
    tags: ['higgsfield', 'looping-video', 'motion-graphics', 'abstract', '3d'],
    tips: 'Request that initial and ending frames align for seamless looping on web landing page backgrounds.',
    placeholders: ['[COLOR_SCHEME]', '[SHAPE_MOTIF]'],
    customizationInstructions: 'Choose chrome, gold, pastel, or dark iridescent color motifs.',
    expectedOutputType: 'Hypnotic, stutter-free looping motion graphic background video.',
    exampleUseCase: 'Website hero video backgrounds, DJ stage backdrops, and digital art displays.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Higgsfield Creative Workflows',
  },

  // ==========================================
  // ADDITIONAL CURATED PROMPTS (Preserving & Updating Legacy Prompts)
  // Proprietary references updated to FLUX.1 and Imagen 3
  // ==========================================
  {
    id: 'cinematic-anamorphic-portrait',
    title: 'Cinematic Anamorphic Studio Portrait',
    slug: 'cinematic-anamorphic-portrait',
    description: 'Generates dramatic, award-winning editorial character portraits with authentic film grain and rim lighting.',
    category: 'ai-image-generation',
    targetModel: 'FLUX.1 / Imagen 3',
    provider: 'Black Forest Labs',
    promptText: 'Editorial close-up portrait of a thoughtful artisan in an ambient wood workshop, dust motes caught in afternoon sunlight, shot on Arri Alexa with Cooke Anamorphic 50mm T2.3, natural skin imperfections, subtle rim light, shallow depth of field, 35mm grain, color graded in warm amber and muted teal --ar 16:9',
    tags: ['portrait', 'cinematic', 'lighting', 'film-photography'],
    tips: 'Use prime cinema lens descriptors like Cooke Anamorphic 50mm to achieve authentic depth of field without artificial blur.',
    placeholders: ['[CHARACTER]', '[SETTING]', '[LIGHTING]'],
    customizationInstructions: 'Modify subject artisan and workshop setting.',
    expectedOutputType: '35mm anamorphic portrait with tactile film grain and natural skin texture.',
    exampleUseCase: 'Film pitch decks, editorial magazine spreads, and character portraits.',
    officialToolUrl: 'https://blackforestlabs.ai',
    authorOrSource: 'Original Creative Prompt',
  },
  {
    id: 'saas-landing-page-architecture',
    title: 'Modern Full-Stack SaaS Architecture Blueprint',
    slug: 'saas-landing-page-architecture',
    description: 'Prompts Claude 3.5 Sonnet to design scalable microservice schemas with PostgreSQL, Redis caching, and Stripe webhooks.',
    category: 'full-stack-development',
    targetModel: 'Claude 3.5 Sonnet / o1',
    provider: 'Anthropic',
    promptText: 'You are a principal cloud architect. Provide a production-ready architectural specification for a multi-tenant B2B SaaS platform handling 50k DAU. Include: 1) Normalized PostgreSQL schema with tenant_id RLS policies, 2) Event-driven async job architecture with Redis/BullMQ, 3) Idempotent Stripe webhook billing lifecycle handling, and 4) TypeScript data transfer object (DTO) interfaces with Zod validation schemas.',
    tags: ['architecture', 'saas', 'postgresql', 'typescript', 'stripe'],
    tips: 'Ask for specific SQL migration files in follow-up queries for copy-paste implementation.',
    placeholders: ['[PLATFORM_SCALE]', '[DATABASE_ENGINE]'],
    customizationInstructions: 'Specify your DAU scale and backend database preferences.',
    expectedOutputType: 'Comprehensive system architecture blueprint with schemas and webhook handlers.',
    exampleUseCase: 'Planning enterprise SaaS refactoring and infrastructure upgrades.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'Platform Engineering Team',
  },
  {
    id: 'slow-dolly-cyberpunk-rain',
    title: 'Smooth Forward Dolly Through Rainy City',
    slug: 'slow-dolly-cyberpunk-rain',
    description: 'Optimized for text-to-video engines like Runway Gen-3 and Kling to achieve steady physical camera movement.',
    category: 'ai-video-generation',
    mediaType: 'video',
    promptProvenance: 'suggested-recreation',
    rightsStatus: 'original',
    sourceCreator: 'SwitchRoute editorial team',
    videoDetails: { previewUrl: '/prompts/generated/slow-dolly-cyberpunk-rain.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://kling.ai/', creatorAttribution: 'Original SwitchRoute prompt and preview; no third-party video reused.', permissionStatus: 'Original local poster; official provider link only.', aspectRatio: '16:9', guideSlugs: ['cinematic-ai-video-workflow'] },
    targetModel: 'Runway Gen-3 / Kling AI',
    provider: 'Runway',
    promptText: 'Continuous smooth forward dolly camera motion drifting down an illuminated wet asphalt avenue in Tokyo at dusk. Reflections of vertical holographic neon signs shimmer on puddles. Natural pedestrian silhouettes walking with translucent umbrellas. 24fps film motion blur, photorealistic depth of field, cinematic lighting.',
    tags: ['video', 'camera-motion', 'cyberpunk', 'lighting'],
    tips: 'Set camera speed to low (0.5x) in video generators to prevent jarring temporal artifacts.',
    placeholders: ['[CITY_NAME]', '[TIME_OF_DAY]'],
    customizationInstructions: 'Change the city name and lighting condition.',
    expectedOutputType: 'Continuous forward camera dolly video clip with reflective wet pavement.',
    exampleUseCase: 'Atmospheric video b-roll and electronic music backdrop.',
    officialToolUrl: 'https://runwayml.com',
    authorOrSource: 'Original Creative Prompt',
  },
  {
    id: 'b2b-cold-email-sequence',
    title: 'High-Converting 3-Step B2B Cold Outreach',
    slug: 'b2b-cold-email-sequence',
    description: 'Generates personalized, non-spammy outbound sequences based on a prospect’s recent company milestones.',
    category: 'marketing-content-social',
    targetModel: 'ChatGPT / Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: 'Write a concise, 3-touch B2B outbound email sequence targeting VPs of Engineering. Email 1: Reference recent engineering scaling challenges without selling. Email 2: Share a concrete benchmark case study reducing CI/CD latency by 40%. Email 3: Polite 2-sentence break-up email. Rules: Under 120 words per email, no buzzwords ("revolutionize", "game-changer"), low-friction soft call to action.',
    tags: ['sales', 'email', 'copywriting', 'b2b'],
    tips: 'Fill in [Prospect Name] and [Company Recent News] variables before sending.',
    placeholders: ['[TARGET_ROLE]', '[CASE_STUDY_METRIC]'],
    customizationInstructions: 'Customize the target executive role and your company benchmark proof point.',
    expectedOutputType: 'Concise 3-part cold outbound email sequence under 120 words each.',
    exampleUseCase: 'Sales pipeline generation and developer relations outreach.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'Platform Growth Team',
  },
  {
    id: 'isometric-3d-app-icon',
    title: 'Vibrant Isometric 3D App Icon & Asset',
    slug: 'isometric-3d-app-icon',
    description: 'Renders glossy, rounded, high-contrast 3D app icons and feature illustrations suitable for landing pages.',
    category: '3d-design-product-vis',
    targetModel: 'FLUX.1 / Blender',
    provider: 'Black Forest Labs',
    promptText: 'Isometric 3D render of a luminous crystal database cylinder with glowing neon circuit paths and floating data cubes, smooth matte pastel acrylic and frosted glass materials, Blender 3D Cycles style, clean ambient occlusion, studio softbox lighting, isolated on solid dark slate background --ar 1:1',
    tags: ['3d', 'icon', 'isometric', 'blender', 'ui-design'],
    tips: 'Use an isolated dark background prompt modifier to easily cut out icons for web UI usage.',
    placeholders: ['[ICON_OBJECT]', '[COLOR_ACCENTS]'],
    customizationInstructions: 'Specify your core icon motif and neon accent colors.',
    expectedOutputType: 'Polished isometric 3D asset ready for feature grids and app icons.',
    exampleUseCase: 'Software marketing websites and documentation headers.',
    officialToolUrl: 'https://blackforestlabs.ai',
    authorOrSource: 'Original Creative Prompt',
  },
  {
    id: 'deep-competitive-teardown',
    title: 'Executive Competitive Intelligence Matrix',
    slug: 'deep-competitive-teardown',
    description: 'Directs research assistants to compile structured competitive teardowns with pricing, moats, and vulnerabilities.',
    category: 'coding-debug-refactor',
    targetModel: 'Perplexity / Claude 3.5 Sonnet',
    provider: 'Anthropic',
    promptText: 'Conduct an exhaustive competitive analysis between [Product A] and [Product B]. Build a markdown comparison matrix with the following columns: Core Value Proposition, Target Audience, Pricing Model & Transparency, Self-Hosting & Data Sovereignty, Technical Moats, and Known User Complaints from Reddit/G2. Conclude with an objective verdict for enterprise vs indie developer use cases.',
    tags: ['research', 'competitive-analysis', 'strategy', 'matrix'],
    tips: 'Replace [Product A] and [Product B] with actual software tools like Supabase and Firebase.',
    placeholders: ['[Product A]', '[Product B]'],
    customizationInstructions: 'Input the two direct competitors you want to compare.',
    expectedOutputType: 'Markdown comparison matrix analyzing pricing, features, and market moats.',
    exampleUseCase: 'Product strategy memos, investor decks, and software buyer decisions.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'Platform Research Team',
  },
  {
    id: 'dark-mode-dashboard-ui',
    title: 'Clean Minimalist Dark Mode Web App UI',
    slug: 'dark-mode-dashboard-ui',
    description: 'Generates UI concept designs featuring deep slate backgrounds, electric blue accents, and modern typography.',
    category: 'ui-ux-design-prototyping',
    targetModel: 'FLUX.1 / Gemini Nano Banana',
    provider: 'Black Forest Labs',
    promptText: 'UI/UX design of a modern fintech analytics web application, dark mode theme (#0B0F19 background), sleek typography, glowing micro-charts, clean navigation sidebar with glowing icons, Bento grid layout, subtle glassmorphism borders, Figma Dribbble Behance trending, high resolution, crisp vectors --ar 16:10',
    tags: ['ui', 'ux', 'dashboard', 'dark-mode', 'bento-grid'],
    tips: 'Specify hex color values like #0B0F19 to keep color schemes dark and consistent.',
    placeholders: ['[APP_DOMAIN]', '[BACKGROUND_HEX]'],
    customizationInstructions: 'Input domain (fintech, health, developer tooling) and exact background hex.',
    expectedOutputType: 'High-resolution web application UI mockup with bento grid layout.',
    exampleUseCase: 'Inspirational UI concepts for modern SaaS products.',
    officialToolUrl: 'https://blackforestlabs.ai',
    authorOrSource: 'Original Creative Prompt',
  },
  {
    id: 'clean-react-custom-hook',
    title: 'Robust React Hook with AbortController & Cache',
    slug: 'clean-react-custom-hook',
    description: 'Generates production-ready TypeScript React custom hooks handling race conditions, retry backoff, and caching.',
    category: 'frontend-development',
    targetModel: 'Claude 3.5 Sonnet / Cursor',
    provider: 'Cursor',
    promptText: 'Write a production-grade TypeScript React custom hook named useFetchWithCache<T>(url: string, options?: RequestInit). Features required: 1) In-memory LRU cache with TTL, 2) Automatic cancellation of in-flight requests using AbortController on unmount/re-query, 3) Exponential backoff retry logic (up to 3 attempts), 4) Strict TypeScript types with generic response inference, and 5) Jest unit test suite testing error boundaries.',
    tags: ['react', 'typescript', 'custom-hook', 'cache', 'testing'],
    tips: 'Ideal for building lightweight web apps without heavy dependencies like React Query.',
    placeholders: ['[HOOK_NAME]', '[FEATURE_REQUIREMENTS]'],
    customizationInstructions: 'Specify hook name and desired features such as debounce or persistence.',
    expectedOutputType: 'Type-safe React custom hook with AbortController and unit test suite.',
    exampleUseCase: 'Creating reusable data-fetching primitives in frontend client apps.',
    officialToolUrl: 'https://cursor.com',
    authorOrSource: 'Platform Engineering Team',
  },
  {
    id: 'launch-app-free-stack-deployment',
    title: 'Launch Your App for Free: Simple Free Deployment Stack',
    slug: 'launch-app-free-stack-deployment',
    description: 'A short, simple guide to launch any app for ₹0.\nThe free stack, one by one:\n1. Cloudflare Pages — free hosting for your app\n2. Neon — free PostgreSQL database for your app data\n3. Clerk — free sign-up and Google/GitHub login\n4. Resend — 3,000 free emails per month\n5. Cloudflare R2 — 10 GB free storage for files and images\n6. Vercel — free one-click deployment\nFollow the 5 simple steps below, connect these tools, and put your app live without spending anything.',
    category: 'web-app-development',
    targetModel: 'Claude / Cursor / Any AI Coding Agent',
    provider: 'Cursor',
    promptText: `Help me launch my app [APP_NAME] for free. Keep every step simple and short.

Use only these free tools:
1. Neon — free PostgreSQL database. Tell me how to create a project and where to paste the connection link.
2. Clerk — free login. Tell me how to add sign-up and Google/GitHub login.
3. Cloudflare R2 — free file storage (10 GB). Tell me how to store user files and images.
4. Resend — free email (3,000 emails per month, up to 100 per day). Tell me how to send a welcome email.
5. Deploy my app — pick ONE: Vercel (one-click deploy) or Cloudflare Pages (free hosting). Connect my GitHub repo [REPO_URL] and list every secret key I must add in Settings before I click Deploy.

Rules:
- Never put secret keys in the code. Keys go in Settings only.
- After each step, give me one small test so I can check it works.
- End with a short checklist.
- Also tell me what is NOT free: Google Play and Apple app store fees, and anything above the free limits.`,
    tags: ['deployment', 'free', 'app-building', 'vercel', 'cloudflare-pages', 'neon', 'clerk', 'resend', 'cloudflare-r2'],
    tips: 'App store fees are NOT free — Google Play and Apple charge to publish apps. The ₹0 cost holds only while you stay inside the free limits. Keep every secret key in Settings, never in your code.',
    guideSteps: [
      { title: 'Put your code on GitHub', text: 'This is your app’s home, and every update starts here. Upload your app code to a free GitHub repository.' },
      { title: 'Create your database on Neon', text: 'Make a free Neon project, copy the connection link, and paste it in your app settings. Your user data lives here.' },
      { title: 'Add login with Clerk', text: 'Create a free Clerk app and turn on Google or GitHub login, so users can sign up safely — without you building a login system yourself.' },
      { title: 'Add storage and email', text: 'Use Cloudflare R2 (10 GB free) for user files and images, and Resend (3,000 free emails per month) for welcome emails and password resets.' },
      { title: 'Deploy and go live', text: 'Pick only ONE — Vercel (one-click deploy) or Cloudflare Pages (free hosting). Connect your GitHub repo, add your secret keys in Settings, and click Deploy. Your app is live.' },
    ],
    placeholders: ['[APP_NAME]', '[REPO_URL]'],
    customizationInstructions: 'Write your app name and your GitHub repo link. The guide will adjust to your app.',
    expectedOutputType: 'A short step-by-step deployment plan with a final launch checklist.',
    exampleUseCase: 'A student or indie maker wants to launch a first app or MVP with zero cost.',
    officialToolUrl: 'https://vercel.com',
    aspectRatio: '4:5',
    authorOrSource: 'tech_hacks.ai',
    sourceCreator: 'tech_hacks.ai',
    promptProvenance: 'original',
    rightsStatus: 'original',
  },
  {
    id: 'vibe-coded-security-exposed-api-keys',
    title: 'Exposed API Keys and Secrets',
    slug: 'vibe-coded-security-exposed-api-keys',
    description: 'Prevent someone from extracting private credentials from the client and using your API account.',
    category: 'vibe-coded-app-security',
    targetModel: 'Cursor, Lovable, Bolt, and other AI coding assistants',
    provider: 'Cursor',
    promptText: `Act as a senior application security engineer. Audit my entire codebase for exposed API keys, secrets, tokens, and credentials.

Check for:
1. OpenAI, Anthropic, Stripe, and other third-party API keys embedded in frontend JavaScript, HTML, mobile code, or publicly accessible configuration files.
2. Secrets committed to source code, Git history, logs, error messages, or client-side environment variables such as VITE_* and NEXT_PUBLIC_*.
3. Backend API routes that expose credentials or allow unauthenticated users to make expensive API calls using my account.
4. Missing server-side validation, authorization, rate limiting, and abuse protection on sensitive endpoints.

Fix all confirmed issues. Move private credentials to server-side environment variables or a secrets manager, route privileged API calls through authenticated backend endpoints, and ensure the frontend never receives private secrets.

Add appropriate rate limits and input validation to prevent API abuse. Never print actual secret values in your report.

After making changes, scan the repository again and report every finding, its severity, the files changed, and the verification performed. If a secret has already been exposed, instruct me to revoke and rotate it because removing it from the code alone does not invalidate it.

Do not claim the application is secure merely because the code changes look correct. Identify anything that requires manual verification.`,
    tags: ['security', 'api-keys', 'secrets', 'vibe-coding', 'audit', 'cursor', 'lovable', 'bolt'],
    tips: 'Before you launch: review the actual code diff before accepting security changes. Run the generated tests and verify they fail when authorization is removed. Rotate any credentials that were exposed, even if you have since removed them from the code. Test with separate accounts and non-production data. Do not treat an AI-generated “all clear” as a security certification. These prompts are a starting point, not a guarantee of security — AI tools can miss vulnerabilities, misconfigure policies, or report tests they did not actually run. Use a qualified security review for sensitive or production systems.',
    expectedOutputType: 'Security audit report with findings, severity, files changed, and verification performed.',
    exampleUseCase: 'Auditing a vibe-coded app built with Cursor, Lovable, or Bolt before launch.',
    previewImage: '/prompts/generated/vibe-coded-security-exposed-api-keys.webp',
    previewImageAlt: 'A glowing shield protects floating golden keys among faint code brackets on a dark navy background.',
    aspectRatio: '1:1',
    createdAt: '2026-11-12T00:00:00.000Z',
  },
  {
    id: 'vibe-coded-security-supabase-rls',
    title: 'Supabase Database Security and RLS',
    slug: 'vibe-coded-security-supabase-rls',
    description: 'Stop users from reading or changing database records they are not permitted to access.',
    category: 'vibe-coded-app-security',
    targetModel: 'Cursor, Lovable, Bolt, and other AI coding assistants',
    provider: 'Cursor',
    promptText: `Act as a senior database security engineer. Audit my application's Supabase configuration, database schema, SQL migrations, access policies, and frontend database queries.

For every table containing user data or private application data:
1. Verify that Row Level Security (RLS) is enabled wherever appropriate.
2. Inspect existing RLS policies for overly permissive rules, including policies that allow unrestricted reads, writes, updates, or deletes.
3. Ensure authenticated users can access only the records they are authorized to access. For user-owned records, enforce ownership using the authenticated user's identity, such as auth.uid(), and the correct ownership column.
4. Check INSERT, SELECT, UPDATE, and DELETE permissions separately. Ensure users cannot assign records to another user or change ownership to bypass policies.
5. Inspect Supabase Storage policies, exposed database views, RPC functions, and grants for equivalent access-control weaknesses.
6. Verify that the Supabase service-role key and other privileged credentials never appear in frontend code.

Implement the required SQL migrations and least-privilege policies without breaking legitimate application functionality. Do not blindly enable RLS without creating and testing the correct policies.

Then test access using separate test accounts and anonymous sessions. Verify that one user cannot read or modify another user's records, and that unauthorized requests are denied by the database itself.

Provide a report of the tables audited, policies added or changed, tests executed, remaining risks, and any manual dashboard configuration required. Never use production personal data for security testing.`,
    tags: ['security', 'supabase', 'rls', 'database', 'vibe-coding', 'audit'],
    tips: 'Before you launch: review the actual code diff before accepting security changes. Run the generated tests and verify they fail when authorization is removed. Rotate any credentials that were exposed, even if you have since removed them from the code. Test with separate accounts and non-production data. Do not treat an AI-generated “all clear” as a security certification. These prompts are a starting point, not a guarantee of security — AI tools can miss vulnerabilities, misconfigure policies, or report tests they did not actually run. Use a qualified security review for sensitive or production systems.',
    expectedOutputType: 'Security audit report with tables audited, policies added or changed, tests executed, and remaining risks.',
    exampleUseCase: 'Locking down Supabase tables and Storage in a vibe-coded app before launch.',
    previewImage: '/prompts/generated/vibe-coded-security-supabase-rls.webp',
    previewImageAlt: 'A database cylinder wrapped in a glowing padlock inside a translucent shield on a dark navy background.',
    aspectRatio: '1:1',
    createdAt: '2026-11-12T00:00:00.000Z',
  },
  {
    id: 'vibe-coded-security-broken-authorization-idor',
    title: 'Broken Authorization and IDOR',
    slug: 'vibe-coded-security-broken-authorization-idor',
    description: "Prevent a logged-in user from changing an ID in a URL or request to access someone else's order, invoice, or profile.",
    category: 'vibe-coded-app-security',
    targetModel: 'Cursor, Lovable, Bolt, and other AI coding assistants',
    provider: 'Cursor',
    promptText: `Act as a senior application security engineer. Audit my entire application for Broken Access Control and Insecure Direct Object Reference (IDOR) vulnerabilities.

Inspect every page, API route, server action, database query, and resource accessed through a user-supplied identifier, including URLs such as /orders/101, /users/42, /invoices/123, and equivalent IDs in request bodies or query parameters.

For every sensitive resource:
1. Verify authentication where required.
2. Enforce server-side authorization on every read and write. Confirm the currently authenticated user has permission to access that specific resource, not merely that they are logged in.
3. Check resource ownership or explicit role-based permissions using trusted server-side identity and database relationships.
4. Apply authorization checks to GET, POST, PUT, PATCH, and DELETE operations, including nested resources, file downloads, exports, and background actions.
5. Prevent users from changing IDs, manipulating request payloads, or invoking backend endpoints directly to access another user's data.
6. Return appropriate 403 or 404 responses for unauthorized requests without leaking private record details.

Implement reusable authorization checks where practical. Add automated tests with at least two separate users, covering attempts to access, modify, and delete each other's resources, plus legitimate owner access and administrator access where applicable.

Run the tests and report the vulnerable endpoints, code changes, test results, and any unverified areas. Do not treat frontend route guards or hidden UI elements as security controls. Authorization must be enforced on the server or through correctly configured database policies.`,
    tags: ['security', 'authorization', 'idor', 'access-control', 'vibe-coding', 'audit'],
    tips: 'Before you launch: review the actual code diff before accepting security changes. Run the generated tests and verify they fail when authorization is removed. Rotate any credentials that were exposed, even if you have since removed them from the code. Test with separate accounts and non-production data. Do not treat an AI-generated “all clear” as a security certification. These prompts are a starting point, not a guarantee of security — AI tools can miss vulnerabilities, misconfigure policies, or report tests they did not actually run. Use a qualified security review for sensitive or production systems.',
    expectedOutputType: 'Security audit report with vulnerable endpoints, code changes, and test results.',
    exampleUseCase: 'Checking IDOR and broken access control across pages, API routes, and downloads.',
    previewImage: '/prompts/generated/vibe-coded-security-broken-authorization-idor.webp',
    previewImageAlt: 'Two locked doors with ID badges behind a checkpoint barrier on a dark navy background.',
    aspectRatio: '1:1',
    createdAt: '2026-11-12T00:00:00.000Z',
  },
  {
    id: 'premium-website-prompts-part-1',
    title: '5 Premium Website Prompts (Part 1)',
    slug: 'premium-website-prompts-part-1',
    description: 'Five complete, animated one-file websites from Aaghaz / Make First Million (@make.first.million): a workflow-automation SaaS landing page, a holographic trading-card marketplace, a dark techwear store with a 3D centrepiece, a warm coffee roastery one-pager, and an AI assistant site with a glowing particle orb. Copy a prompt, paste it into ChatGPT, Claude or Gemini, and get a complete index.html.',
    category: 'premium-website-prompts',
    targetModel: 'ChatGPT, Claude or Gemini',
    provider: 'Anthropic',
    promptText: `5 Premium Website Prompts (Part 1) — Aaghaz / Make First Million (@make.first.million)

Copy one prompt, paste it into ChatGPT, Claude or Gemini, and you get a complete, animated website in ONE file called index.html. We built every site in this guide from these exact prompts, so they work.

HOW TO USE A PROMPT (4 STEPS)
1. Copy one full prompt below (from its first line to its last line).
2. Paste it into a new chat in ChatGPT, Claude or Gemini and press send. Ask: "Give me the complete index.html in one code block."
3. Save the code: open Notepad (Windows) or TextEdit (Mac, plain text mode), paste the code, and save it as index.html. Double-click the file and it opens in your browser.
4. Remix and ship: ask the AI to change the brand name, text, colours or sections. To put it online for free, open Netlify Drop and drag the folder with your index.html onto the page. You get a live link in seconds.

Tip: Claude can also show the site live in a preview (an "artifact"), so you see it before you save it.
If a part looks broken, tell the AI exactly what you see, e.g. "the 3D object is not showing, fix it". It will send a fixed file.

---

MAKE IT YOURS
Change the brand: "Rename the brand to <your name> and rewrite all text for <your business>."
Change the colours: "Use #FF7D00 as the accent colour instead."
Add a section: "Add a testimonials section with 3 reviews after pricing."

Source: Aaghaz / Make First Million (@make.first.million) — "5 Premium Website Prompts (Part 1)". These prompts are not SwitchRoute originals; shared with credit.`,
    guideStepsHeading: 'The 5 prompts',
    guideSteps: [
      {
        title: 'Prompt 01: Pulse',
        text: `## Prompt 01: Pulse
What you get: a black + lime workflow-automation SaaS landing page. (93 lines)

You are an expert creative front-end developer. Build a single self-contained index.html (HTML + CSS + vanilla JS, no build step) for the website described below.

CONCEPT
Landing page for "Pulse", a fictional workflow-automation SaaS. Mood: dark, precise, electric. Think a premium dev-tool launch page: huge tight type, one neon accent, glass UI, motion that feels alive but calm.

COLOURS (use exactly these, as CSS variables)
--bg: #0B0B0C (page background)
--surface: #141416 (cards)
--line: rgba(255,255,255,0.08) (hairline borders)
--text: #F4F4F5 (primary text)
--muted: #8A8A93 (secondary text)
--lime: #C6F432 (the only accent: buttons, glows, ring, dots)
Text on lime buttons is #0B0B0C.

FONTS (Google Fonts)
Headings: "Inter Tight" 600/700, letter-spacing -0.045em, line-height 0.95.
Body: "Inter" 400/500. Labels/mono details: "JetBrains Mono" 400.

1. INTRO LOADER
Full-screen #0B0B0C overlay with a thin lime SVG ring (stroke 3px, 120px) in the centre. The ring's stroke-dashoffset fills 0 to 100% while a mono counter counts "00" to "100" in 1.1s. Then the overlay fades out and slides up (0.4s). The hero must be fully visible by 1.5s.

2. NAV (sticky, glass)
Left: logo = small lime circle with a pulsing ring + "Pulse" wordmark.
Centre links: Product, Workflows, Pricing, Docs. Right: "Sign in" text link + lime pill button "Start free".
Background rgba(11,11,12,0.6) with backdrop-filter: blur(14px); bottom hairline.

3. HERO (min-height 100vh, two columns: 55% text / 45% visual)
Eyebrow pill (mono, lime dot): "NEW · Pulse Agents 2.0 is live"
Headline (clamp 56px to 98px, max-width 720px so it wraps to 3 lines): "Automations that run while you sleep." with "while you sleep." in lime.
Subline (muted, max 520px): "Connect your apps, drop in an AI step, and let Pulse handle the busywork. 4,000+ teams ship 30 hours back every week."
Buttons: lime pill "Start building free →" and ghost pill "Watch 90s demo".
Under buttons, mono small: "No credit card · SOC 2 Type II · 99.99% uptime".
Background: a large soft lime radial glow (opacity 0.18) behind the visual plus a faint 48px grid fading out at the edges.

HERO VISUAL: a tilted glass window
A 520px wide window: rgba(255,255,255,0.04) fill, 1px hairline border, 20px radius, backdrop blur, transform: perspective(1400px) rotateY(-14deg) rotateX(8deg). It floats gently (translateY ±8px, 6s loop) and tilts slightly toward the mouse. Top bar: three dots + mono title "lead-to-deal.flow" + green "● Live" badge.
Inside, a vertical workflow of three node cards joined by SVG connector paths:
- TRIGGER: "New form submission" (icon: bolt)
- AI STEP: "Qualify lead with AI" with a lime border glow and a small shimmering progress bar
- ACTION: "Create deal + notify #sales" (icon: check)
Flowing dots: small lime circles travel along each connector path (SVG animateMotion or JS getPointAtLength), looping, staggered.
Each node flashes its border lime when a dot arrives. Footer row of the window: mono "Runs today 12,408 · avg 1.2s" where the run count ticks up by 1 every ~0.8s.

4. LOGOS STRIP
Label "Powering automations at" then an infinite marquee of 7 fictional wordmarks in muted grey: Northwind, Lumora, Kitebase, Orbitly, Hexa, Fernway, Quantica. Edge fade masks left and right.

5. FEATURES (3 cards)
Section title: "Everything runs on Pulse."
Card 1 "Visual builder": "Drag triggers, logic and actions onto one canvas. No code, no glue scripts."
Card 2 "AI steps": "Summarise, classify and draft inside any workflow with one block."
Card 3 "Never miss a run": "Automatic retries, version history and alerts the moment something breaks."
Cards: #141416, hairline border, 24px radius. Hover: lift 6px, border turns lime at 40%, a radial glow follows the cursor.

6. HOW IT WORKS (3 steps, horizontal, joined by a line that draws in on scroll)
01 Connect — "Plug in 300+ apps in two clicks."
02 Automate — "Describe the job in plain words. Pulse builds the flow."
03 Relax — "Watch it run, 24/7, while you do the real work."

7. PRICING (3 tiers, monthly)
Starter $0 — 1,000 runs, 5 workflows, community support. Button "Start free".
Pro $29 (highlighted with lime border + "Most popular" tag) — 50,000 runs, unlimited workflows, AI steps. Button "Go Pro".
Scale $99 — 500,000 runs, SSO, priority support. Button "Talk to sales".

8. CTA BAND
Big headline "Let the robots do Mondays." Subline "Start free. Set up your first automation in under five minutes."
Lime pill button "Start building free →". Lime glow behind.

9. FOOTER
Logo + "© 2026 Pulse Labs", four link columns (Product, Company, Resources, Legal), mono line "All systems normal ●".

MOTION
- Scroll reveals with IntersectionObserver: elements fade up 24px, 0.8s, cubic-bezier(.2,.7,.2,1), 80ms stagger.
- Headline words rise in one by one after the loader.
- Respect prefers-reduced-motion (disable loops, show final states).

RESPONSIVE
- Below 960px: hero stacks (text first, visual below, tilt reduced to 6deg), cards and pricing go to one column.
- Below 600px: hide centre nav links, headline min 44px, 20px side padding. No horizontal scroll ever.

QUALITY BAR
- Must look like a top-tier, award-worthy SaaS launch page in the first viewport.
- Only one accent colour; lime used sparingly so it pops.
- Crisp hairlines, generous spacing, consistent 8px rhythm.
- All animation at 60fps (transform/opacity only).
- No placeholder text, no broken images, no external images: build every visual with HTML, CSS and SVG.
- Fictional brands only. Output the complete file in one code block.`,
        image: '/prompts/generated/premium-website-pulse-site.webp',
        imageAlt: 'Pulse black and lime workflow-automation SaaS landing page with workflow nodes',
      },
      {
        title: 'Prompt 02: Vault',
        text: `## Prompt 02: Vault
What you get: a holographic trading-card marketplace. (79 lines)

You are an expert creative front-end developer. Build a single self-contained index.html (HTML + CSS + vanilla JS, no build step) for the website described below.

CONCEPT
"Vault" is a premium marketplace for graded collectible trading cards. Every card is stored in an insured vault, authenticated, and can be bought, sold or traded instantly without shipping. The feel is fintech meets luxury collectibles: dark, precise, confident, a little bit futuristic. Think private bank, not toy shop.

COLOURS (use exactly these)
- Background: #0A0E1A (navy-black)
- Surface / cards: #111729, borders #1E2740
- Electric blue (primary accent, buttons, glows): #3D7BFF
- Gold (secondary accent, rarity, numbers): #E8C26A
- Text: #F2F4FA, muted text #8A93AD
- Holographic foil gradient: #3D7BFF -> #9B6BFF -> #FF6BC8 -> #E8C26A -> #5CF2D6

FONTS
- Load from Google Fonts: "Space Grotesk" (500, 700) for headings and numbers, "Inter" (400, 500, 600) for body, "JetBrains Mono" (500) for tags and labels.
- Headings: tight letter-spacing (-0.03em), very large. Labels: uppercase mono, letter-spacing 0.18em, 12px.

LAYOUT AND SECTIONS (in this order, with this exact copy)

1. NAV (fixed, transparent, blurs on scroll)
- Left: logo = a small blue rounded square with a gold keyhole shape, then the word "VAULT".
- Centre links: Drops, Custody, Markets, Journal.
- Right: ghost button "Sign in", solid blue button "Open a vault".

2. HERO (full viewport height, two columns)
- Background: #0A0E1A with a faint blue radial glow behind the card, a subtle 64px grid of 1px lines at 4% opacity, and a slow drifting grain.
- Left column:
  - Tag row (mono pills): "Card Custody · Est. 2026" and a gold pill "● Live drop".
  - Headline (about 92px on desktop): "Own the rarest cards. Never touch a sleeve." — the words "rarest cards" painted with the holographic gradient.
  - Subline: "Vault authenticates, grades and stores your collectibles in an insured vault. Buy, sell and trade in seconds — the card never leaves the safe."
  - Buttons: solid blue "Explore live drops →" and outline "How custody works".
  - Below: a "drop progress" block. Huge Space Grotesk counter "020" in gold (about 120px) with the label "/ 100 minted" next to it, then the label "DROP 07 — AURORA SERIES", then a thin progress bar (4px, track #1E2740, fill blue-to-gold gradient) filled to 20%, with "20% claimed" and "Closes in 04:12:09" on either side underneath.
- Right column: THE HOLOGRAPHIC CARD (the hero visual, see below), with two small floating glass chips beside it: "Grade PSA-style 10 · Gem Mint" and "Last sale $12,480 ▲ 18%".

3. HERO VISUAL — HOLOGRAPHIC CARD
- A portrait trading card, ratio 63:88, about 380px wide, rounded 18px corners, gold 2px inner frame.
- Card art is pure CSS + inline SVG (no images): a fictional character "NOVA, the Star Warden" — a stylised armoured figure with a glowing visor and a big circular halo behind, built from SVG shapes, on a deep space background with small stars.
- Card text: top-left "NOVA", top-right "★ 1/100", bottom panel "Star Warden · Aurora Series", a row "ATK 98 DEF 91 RARITY Mythic", and serial "VLT-07-020".
- 3D tilt: on mousemove over the hero, rotate the card with rotateX/rotateY up to ±15° using perspective(1200px), smoothed with a lerp in requestAnimationFrame. On mouseleave, ease back to a gentle idle tilt (about rotateY -12°, rotateX 6°).
- Foil shine: an overlay layer with the holographic gradient at 45°, mix-blend-mode: color-dodge, opacity ~0.55, whose background-position follows the tilt, plus a white diagonal glare streak that moves across the card. When the mouse is idle, the foil slowly drifts on its own (CSS animation), so it always looks alive.
- Behind the card: a blurred blue glow and a soft gold reflection on the "floor".

4. LIVE DROPS (section title "Live drops", subline "Six cards on the block right now. Every one sits in our vault, verified.")
- A grid of 6 cards (3 x 2 on desktop). Each tile: mini CSS/SVG card art in a different hue (Nova, Ember Fox, Tidecaller, Iron Monk, Glass Serpent, Solar Kid), name, series, grade, price in gold, and a small "Bid" button.
- Hover: tile lifts 6px, border turns blue, a foil sheen sweeps across the mini card.

5. HOW CUSTODY WORKS (title "Your card never leaves the safe")
- 3 numbered steps in a row, mono numbers in gold: "01 Send it in" — "Ship once. We authenticate and grade every card on arrival." / "02 We vault it" — "Climate-controlled, insured, 24/7 monitored storage." / "03 Trade instantly" — "Ownership moves in seconds. Withdraw the physical card any time."
- A thin blue line connects the steps and draws itself left to right when it scrolls into view.

6. STATS (four big numbers, counting up when visible)
- "$184M" Cards in custody · "312K" Collectors · "1.4s" Average settlement · "0" Cards lost. Numbers in Space Grotesk, gold.

7. CTA (big centred panel with a blue glow border)
- Headline: "Your collection deserves a vault." Subline: "Open an account in two minutes. First withdrawal free."
- Buttons: "Open a vault" (blue) and "Talk to a specialist" (outline).

8. FOOTER
- Logo, short line "Vault Custody Ltd. A fictional company for demonstration.", link columns (Product, Company, Legal) and "© 2026 Vault".

MOTION
- On load: hero text fades up in a stagger (total under 1.2s), the card rises and settles into its idle tilt, the counter counts from 000 to 020 and the progress bar fills to 20%, all finished within 1.5s.
- Scroll: sections fade up with IntersectionObserver; stats count up; the custody line draws.
- Buttons: blue buttons glow brighter on hover and move 1px up.
- Respect prefers-reduced-motion: no tilt, no drifting, show final states.

RESPONSIVE
- Below 980px: hero stacks (text first, card below, card 300px wide), headline about 56px, drops grid 2 columns, steps stack vertically.
- Below 600px: drops grid 1 column, nav links hide behind a simple menu button, 20px side padding.
- Tilt follows touch drag on mobile.

QUALITY BAR
- Must look like a $50k agency site in the first screen, not a template.
- No external images; all art is CSS/SVG. Only Google Fonts as external dependency.
- Text is always readable: contrast at least 4.5:1 on body copy.
- 60fps animation: only animate transform and opacity (and background-position for the foil).
- Semantic HTML (header, main, section, footer), buttons are real buttons or links.
- No console errors; everything works by opening the file directly.
- Fictional brand only. No real company names, logos or characters.`,
        image: '/prompts/generated/premium-website-vault-site.webp',
        imageAlt: 'Vault holographic trading-card marketplace with graded collectible cards',
      },
      {
        title: 'Prompt 03: Nocturne',
        text: `## Prompt 03: Nocturne
What you get: a dark techwear store with a 3D centrepiece. (89 lines)

You are an expert creative front-end developer. Build a single self-contained index.html (HTML + CSS + vanilla JS, no build step) for the website described below.

BRAND & CONCEPT
- Name: NOCTURNE. A dark techwear / technical outerwear concept store. Fictional brand.
- Mood: after-midnight city, engineered garments, quiet luxury, lab precision. Think gallery, not supermarket.
- One striking 3D centrepiece, lots of negative space, tiny monospace labels everywhere.

COLOURS (use as CSS variables)
- --bg: #07070A (near-black page background)
- --panel: #0E0E13 (cards, sections)
- --line: rgba(255,255,255,0.06) (grid lattice and hairlines)
- --text: #EDEDF2 (primary text)
- --muted: #8A8A99 (secondary text)
- --accent: #B6A6FF (lavender glow) and --accent-2: #7CF7E4 (cyan glow)
- Iridescent gradient for highlights: #7CF7E4 -> #B6A6FF -> #FF9AD5

FONTS (Google Fonts)
- Headlines: "Space Grotesk" 500/700, tight letter-spacing (-0.04em), huge sizes.
- Micro-labels, prices, nav: "JetBrains Mono" 400/500, uppercase, letter-spacing 0.18em, 11px.
- <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">

BACKGROUND
- Full-page fixed canvas with a fine square grid lattice (48px cells, 1px lines in --line).
- Around the cursor, the grid lights up: lines within ~220px radius glow in --accent, fading out smoothly with distance. Grid intersections near the cursor get tiny bright dots.
- Without a mouse (or on load) place the glow just behind the hero object so the effect is visible.
- Add a soft radial vignette and very subtle film grain on top.

NAV (fixed, transparent, 28px side padding)
- Left: logo "NOCTURNE" in Space Grotesk 700, with a small pulsing cyan dot before it.
- Centre: Shop, Collections, Technology, About (mono, muted, turn white on hover with a 1px underline that draws in from left).
- Right: "Cart (0)" inside a thin pill border.

HERO (100vh)
- Corner micro-labels (mono, muted, absolutely positioned near the four corners): top-left "ENGINEERED FOR MOTION", top-right "DROP 04 / LIMITED", bottom-left "N 51.5072 / W 0.1276 — 02:14 AM", bottom-right "SCROLL TO EXPLORE ↓".
- Centrepiece: a glossy iridescent 3D object rotating slowly, using Three.js loaded from jsDelivr with a pinned version (three@0.160.0, ES module via an importmap).
  - Geometry: TorusKnotGeometry(1.1, 0.38, 320, 48, 2, 3) — reads like a sculpted, puffy, quilted form.
  - Material: MeshPhysicalMaterial with color #A49CC8, metalness 0.55, roughness 0.14, clearcoat 1, iridescence 1, iridescenceIOR 1.6, iridescenceThicknessRange [200, 900].
  - Lighting: RoomEnvironment through PMREMGenerator as scene.environment, plus a lavender (#B6A6FF) and a cyan (#7CF7E4) point light (intensity 90) orbiting slowly so the colours shift. Exposure 0.95, camera at z 9.6 so the object sits behind the headline. Keep the subline readable over it (soft dark text-shadow + faint radial scrim).
- Motion: rotate on Y ~0.15 rad/s and on X ~0.05 rad/s; gently tilt toward the mouse (lerped parallax). Fade/scale in over 1.2s on load.
- Transparent renderer, ACES filmic tone mapping, pixel ratio capped at 2.
- Fallback: if WebGL is not available, show a CSS-only iridescent orb (layered conic + radial gradients, blur glow, slow spin) in the same spot. Never leave the hero empty.
- Headline layered over the object, centred, very large (clamp(64px, 11vw, 190px)): line 1 "BUILT FOR" and line 2 "THE NIGHT" — line 2 filled with the iridescent gradient.
- Subline (muted, 18px, max 520px): "Waterproof shells, thermal mid-layers and modular cargo — engineered in small batches for people who move after dark."
- Buttons: primary "Shop Drop 04" (white fill, black text, pill) and secondary "Explore Technology →" (thin border pill). Hover: primary gets an iridescent glow, secondary border turns --accent.
- Small spec strip under the buttons (mono): "3L GORE-STYLE MEMBRANE · 20K MM WATERPROOF · 412 G".
- Intro: headline letters slide up with a stagger; everything must reach its final state within 1.5s.

SECTION 2 — PRODUCT GRID ("Drop 04")
- Label "01 / SHOP" and heading "The Drop 04 capsule."
- 4 cards in a row: dark panel, product visual area (abstract CSS-gradient silhouette, no stock photos), name, mono price.
  1. "Umbra Shell Jacket" — $480 2. "Vanta Thermal Mid" — $320 3. "Halo Cargo Pant" — $260 4. "Echo Sling 9L" — $140
- Hover: card lifts 6px, border glows lavender, a "+ ADD TO CART" mono label slides up.

SECTION 3 — TECHNOLOGY
- Label "02 / TECHNOLOGY", heading "Engineered layers. Zero compromise."
- 3 feature columns with a thin-line icon (inline SVG), title and one line:
  "Storm Membrane" — "Three-layer shell rated to 20,000 mm. Fully taped seams."
  "Thermal Mapping" — "Body-mapped insulation that breathes when you move."
  "Modular System" — "Magnetic anchor points. Clip, swap and carry your way."
- Big animated stat row: "20K" mm waterproof, "412" grams, "07" pockets — numbers count up when in view.

SECTION 4 — LOOKBOOK STRIP
- Label "03 / LOOKBOOK". A horizontal strip of 5 tall frames (gradient art + mono captions like "LOOK 01 — UMBRA / VANTA") that auto-scrolls slowly as a marquee and pauses on hover.

SECTION 5 — NEWSLETTER
- Heading "Get the next drop before it sells out." Email input + "Notify me" button inline, mono helper text "NO SPAM. ONE EMAIL PER DROP."

FOOTER
- Huge outlined wordmark "NOCTURNE" across the full width, link columns (Shop, Support, Studio), and "© 2026 NOCTURNE LABS. ALL RIGHTS RESERVED." in mono.

SCROLL & HOVER MOTION
- Sections fade + rise 24px into view with IntersectionObserver.
- The 3D object scales down slightly and drifts up as you scroll past the hero.
- Custom cursor: a small ring that follows the mouse with easing and grows over buttons/links.

RESPONSIVE
- Under 900px: nav links collapse into a "Menu" text button, product grid becomes 2 columns, features stack.
- Under 560px: product grid 1 column, headline clamps down, corner labels hide except top-left.
- Respect prefers-reduced-motion (stop rotation, marquee and count-ups).

QUALITY BAR
- Looks like a $50k agency build in the very first viewport. No placeholder text, no lorem ipsum.
- Perfect alignment, consistent spacing scale (8px), crisp hairlines.
- 60fps animation; requestAnimationFrame only; no layout thrashing.
- Hero is never blank: the object or its fallback is visible immediately.
- Semantic HTML, alt/aria labels, visible focus states.
- Everything in one file, works by double-clicking index.html.`,
        image: '/prompts/generated/premium-website-nocturne-site.webp',
        imageAlt: 'Nocturne dark techwear store with a 3D centrepiece and monospace labels',
      },
      {
        title: 'Prompt 04: Crema',
        text: `## Prompt 04: Crema
What you get: a warm specialty coffee roastery one-pager. (81 lines)

You are an expert creative front-end developer. Build a single self-contained index.html (HTML + CSS + vanilla JS, no build step) for the website described below.

CONCEPT
"Crema" is a small-batch specialty coffee roastery. The site is a warm, editorial one-pager that feels like a luxury packaging studio made it: rich espresso tones, elegant serif type, hand-drawn-feeling product art. Mood: slow, sensory, confident. Think candlelit cafe at 7am, not a fast-food chain.

COLOURS (use exactly these)
- Espresso dark: #1B0F0A (page background, start of gradient)
- Roast brown: #4A2A1A (end of gradient, cards)
- Cream: #F3E9DC (main text, cup, bag)
- Caramel accent: #C98A4B (buttons, highlights, lines, labels)
- Soft muted text: rgba(243,233,220,0.65)
Page background: radial + linear gradient from #1B0F0A to #4A2A1A, plus a very subtle grain overlay (SVG noise, 6% opacity).

FONTS
Google Fonts: "Cormorant Garamond" (500, 600, italic) for headlines, "Inter" (400, 500, 600) for body, "JetBrains Mono" (400) for the receipt. Headline letter-spacing -0.02em; small labels uppercase, 0.2em tracking.

SECTIONS (in this order, with this exact copy)
1. Nav (sticky, transparent, blur on scroll): wordmark "crema" in italic serif with a small caramel dot; links "Origins", "Brew", "Order", "Visit"; pill button "Shop beans".
2. Hero (100vh, two columns 55/45):
   - Label: "SMALL-BATCH ROASTERY · EST. 2019"
   - Headline: "Slow roast." (cream) on line one, "Fast mornings." (italic, caramel) on line two, ~128px.
   - Subline: "Single-origin beans, roasted in tiny batches every Tuesday and on your doorstep by Friday."
   - Buttons: "Find your roast" (solid caramel, dark text) and "Brew guide →" (ghost, cream border).
   - Trust row: "4.9 ★ from 12,000 cups" · "Roasted < 7 days ago" · "Free shipping over $40".
   - Visual (right column), drawn entirely in inline SVG/CSS, no images:
     a) A tall kraft-style coffee bag (cream body, caramel fold at top, tin-tie line) with a label reading "crema" (italic serif) and "· slow roast ·" underneath, plus "ETHIOPIA · 250g".
     b) In front of it, a takeaway cup (cream cup, caramel sleeve with the "c" monogram, brown lid).
     c) Three soft steam wisps rising from the lid.
     d) A large blurred caramel glow behind both objects and a soft shadow ellipse under them.
   - Hero animation:
     * Pour/fill intro: on load, a caramel-brown "coffee level" rect inside a clipPath of the cup rises from the bottom to full in 1.2s (ease-out), then the lid drops in 8px with a fade.
     * Bag slides up 40px and fades in (0.9s). Headline lines rise from a mask, staggered 120ms.
     * Steam: each wisp is an SVG path animated forever: translateY 0 → -40px, scaleX wobble, opacity 0 → 0.7 → 0, 3.6s, staggered 1.2s.
     * The whole visual floats gently (translateY ±8px, 6s loop) and tilts a few degrees toward the mouse (parallax, max 6deg).
     * All intro motion must finish within 1.5s so the hero is never blank.
3. Origins: label "THE ORIGINS", heading "Three beans. Three stories." Three cards:
   - "Yirgacheffe, Ethiopia" — notes: Jasmine · Bergamot · Peach — Light roast — $19
   - "Huila, Colombia" — notes: Caramel · Red apple · Cocoa — Medium roast — $18
   - "Sumatra, Indonesia" — notes: Cedar · Dark chocolate · Molasses — Dark roast — $20
   Each card has a coloured bean icon (SVG), notes as caramel pill chips, a roast meter (5 dots). Hover: card lifts 8px, border glows caramel, bean rotates 20deg.
4. Brew guide: heading "Pour-over in four slow steps." Numbered horizontal timeline: 01 "Grind" 18g, medium-fine · 02 "Bloom" 40g water, wait 30s · 03 "Pour" spiral to 300g · 04 "Sip" at 3:30, never rush. A caramel line draws across as you scroll.
5. Order: heading "Your Tuesday roast, sorted." Left: copy "Pick a bean, pick a rhythm. We roast it, pack it and ship it the same week." and button "Start subscription". Right: a paper "receipt" card (cream background, dark text, mono font, zig-zag torn bottom edge) whose lines TYPE OUT one by one when it scrolls into view: "CREMA ROASTERY / ORDER #0419", "1 x Yirgacheffe 250g ..... $19.00", "1 x Huila 250g .......... $18.00", "Grind: pour-over", "Shipping ............ FREE", "TOTAL ............... $37.00", "Thank you. Brew slow."
6. Visit: heading "Come smell the roaster." Address "48 Ember Lane, Old Mill District", hours table Mon–Fri 7:00–17:00, Sat 8:00–15:00, Sun "Roast day — closed". A stylised map card made of CSS lines with a pulsing caramel pin.
7. Footer: wordmark, "Roasted with patience.", small links, newsletter input with "Join the brew list" button, "© 2026 Crema Roastery. A fictional brand."

SCROLL AND HOVER MOTION
- Sections fade/rise in with IntersectionObserver (opacity 0→1, translateY 30px→0, 0.8s).
- Buttons: smooth 0.3s transitions, caramel button gets a lighter shade and soft glow on hover.
- Respect prefers-reduced-motion: disable loops, show final states.

RESPONSIVE
- Below 900px: hero stacks (text first, visual below at 80% width), headline ~64px, cards stack, timeline becomes vertical, nav links collapse into a simple menu button.
- No horizontal scroll at any width; 20px side gutters on mobile.

QUALITY BAR
- Looks like a real premium brand site in the very first viewport at 1600x1000.
- Product art is crisp vector, believable proportions, soft shadows and highlights; no emoji, no stock images.
- Generous whitespace, strong type hierarchy, consistent 8px spacing grid.
- No blank states: every animation has a visible final state within 1.5s.
- Semantic HTML, accessible contrast, alt/aria labels on the SVG art.
- One file, clean commented code, no console errors.`,
        image: '/prompts/generated/premium-website-crema-site.webp',
        imageAlt: 'Crema warm specialty coffee roastery one-pager with espresso tones and serif type',
      },
      {
        title: 'Prompt 05: Halo',
        text: `## Prompt 05: Halo
What you get: an AI assistant site with a glowing particle orb. (70 lines)

You are an expert creative front-end developer. Build a single self-contained index.html (HTML + CSS + vanilla JS, no build step) for the website described below.

BRAND & CONCEPT
- Product: "Halo", a calm, private AI assistant that reasons before it answers.
- Mood: deep space, quiet intelligence, soft light. Think observatory at night, not sci-fi cliché.
- The whole site is dark. Light only comes from mint and violet glows, like the assistant is "thinking".

COLOURS (use as CSS variables)
- --bg: #050507 (page background, near-black)
- --surface: rgba(255,255,255,0.04) with a 1px border rgba(255,255,255,0.08)
- --mint: #5CF2C8 (primary accent, buttons, highlights)
- --violet: #8B5CF6 (secondary accent, glows, gradients)
- --text: #F4F4F8 (headings), --muted: #9A9AAE (body copy)
- Signature gradient: linear-gradient(90deg, #5CF2C8, #8B5CF6)

FONTS (Google Fonts)
- Headings: "Instrument Serif" (regular + italic), large and tight (letter-spacing -0.02em).
- Body/UI: "Inter" 400/500/600.
- Link: https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap

SECTIONS (in this order, with this exact copy)
1. Nav (fixed, transparent, blurs on scroll): logo = small glowing mint dot + "Halo". Links: Capabilities, Demo, Privacy, Pricing. Right button: "Get early access" (mint pill, dark text).
2. Hero (100vh, centred):
   - Small pill badge: "● Halo 2 is now thinking in public beta"
   - Headline (clamp 56px to 120px): "An assistant that" then a line break and "actually *thinks.*" ("thinks." in italic with the mint-to-violet gradient as text fill).
   - Subline: "Halo reasons step by step, remembers what matters to you, and never sells a single word you type."
   - A glassy prompt bar (max-width 640px, backdrop-filter blur 20px, rounded 18px, gradient hairline border): a sparkle icon on the left, a typing placeholder that cycles through "Plan my week around three deadlines…", "Summarise this 40-page contract…", "Explain quantum computing like I'm twelve…" (type 45ms/char, hold 1.6s, delete, next), and a round mint "→" send button on the right.
   - Under it: small muted text "Free for 14 days · No card needed".
3. Capabilities: eyebrow "CAPABILITIES", heading "Three things it does better than anything else." Three glass cards with a glowing icon, title and one line:
   - "Deep reasoning" / "Breaks hard problems into steps and shows its working."
   - "Living memory" / "Learns your projects, people and preferences — only if you allow it."
   - "Works everywhere" / "Desktop, phone, browser and your inbox. One Halo, in sync."
4. Chat demo: heading "Watch it think." A large glass window with three traffic-light dots. It plays itself when scrolled into view: user bubble types "I have 2 hours. Should I study or go to the gym?", then a "Halo is thinking…" row with three pulsing mint dots for 1.2s, then the Halo reply types word by word: "Do both. 25 minutes of gym first boosts focus for the next 90. Then study in three 30-minute blocks with 5-minute breaks. I've added it to your calendar." Loop every 10s.
5. Privacy: two columns. Left: heading "Your thoughts stay yours." + paragraph "End-to-end encrypted. Processed on-device when possible. Never used to train models. Delete everything with one tap." Right: a glowing violet shield/lock made of concentric rings that slowly rotate. Three check rows: "Zero data selling", "On-device mode", "One-tap delete".
6. Pricing: heading "Simple pricing." Two cards side by side:
   - "Free" — "$0" /month — Daily reasoning, 7-day memory, 1 device — button "Start free" (ghost).
   - "Halo Pro" (highlighted with gradient border + "Most loved" tag) — "$18" /month — Unlimited reasoning, lifelong memory, all devices, priority speed — button "Go Pro" (mint).
7. CTA band: a large glow, heading "Meet the assistant that thinks with you." button "Get early access".
8. Footer: "Halo" logo, small links (Privacy, Terms, Careers, Contact), "© 2026 Halo Labs. Made with quiet light."

HERO VISUAL — THE ORB (most important)
- A full-screen <canvas> behind the hero text, devicePixelRatio aware, resized on window resize.
- Draw ~2,600 particles forming a glowing orb centred slightly above the middle of the hero (radius ≈ 30% of the smaller viewport side).
- Each particle has a radius from the centre and an angle. Start as a sphere-like cloud; over time particles drift onto a 2-arm logarithmic spiral (spiral-galaxy shape) and back, so the orb slowly "swirls into a galaxy" and relaxes again (12s cycle, eased).
- The whole orb rotates slowly (≈0.08 rad/s), inner particles faster than outer ones (differential rotation).
- Breathing: the orb scales between 0.94 and 1.06 with a 4s sine pulse; brightness pulses with it.
- Colour: particles near the core are mint (#5CF2C8) and white, outer ones blend to violet (#8B5CF6). Use globalCompositeOperation "lighter" for additive glow.
- Add a soft radial core glow (mint centre fading to violet to transparent) and a faint violet haze behind everything.
- The mouse gently pulls the orb (parallax up to 30px).
- The orb must be fully formed on the very first frame (no fade-in from nothing), and the headline must remain readable on top (add a subtle dark radial vignette behind the text).

MOTION
- Hero text fades up in a 0.9s stagger on load (badge, headline, subline, bar). Final state reached within 1.2s.
- Sections reveal on scroll with IntersectionObserver (opacity 0 → 1, translateY 24px → 0, 0.8s cubic-bezier(.2,.7,.2,1)).
- Cards: on hover lift 6px, the border brightens, and a mint/violet radial glow follows the cursor inside the card.
- Buttons: soft glow on hover, 1.02 scale.
- Respect prefers-reduced-motion (stop the swirl, keep a static orb).

RESPONSIVE
- Desktop first, max content width 1180px, 24px side padding.
- Under 900px: cards and pricing stack into one column, privacy columns stack, nav links hide (keep logo + button).
- Under 600px: headline min 48px, prompt bar full width, particle count halves for performance.

QUALITY BAR
- Looks like a funded startup's launch site on first glance, not a template.
- The orb is the star: luminous, deep, clearly a galaxy-like swirl, smooth at 60fps.
- Perfect typographic hierarchy; generous whitespace; nothing touches the edges.
- No external images; every visual is CSS, SVG or canvas.
- No console errors; no layout shift; semantic HTML; accessible contrast and focus states.
- All copy exactly as written above.`,
        image: '/prompts/generated/premium-website-halo-site.webp',
        imageAlt: 'Halo AI assistant site with a glowing mint particle orb on a dark background',
      },
    ],
    tags: ['website', 'landing-page', 'saas', 'workflow-automation', 'marketplace', 'trading-cards', 'collectibles', 'holographic', 'ecommerce', 'techwear', 'fashion-store', 'three-js', 'coffee', 'roastery', 'one-pager', 'editorial', 'ai-assistant', 'particle-orb', 'single-file-website', 'premium-website-prompts'],
    tips: 'Copy the full prompt, first line to last line. Paste it into a new chat in ChatGPT, Claude or Gemini and ask: "Give me the complete index.html in one code block." Save it as index.html (Notepad on Windows, TextEdit on Mac in plain-text mode), then double-click to open it in your browser. Remix and ship: ask the AI to change the brand name, text, colours or sections; put it online free with Netlify Drop (drag the folder onto the page). Tip: Claude can also preview the site live as an artifact. If a part looks broken, tell the AI exactly what you see, e.g. "the 3D object is not showing, fix it". Make it yours: "Rename the brand to <your name> and rewrite all text for <your business>." Change the colours: "Use #FF7D00 as the accent colour instead." Add a section: "Add a testimonials section with 3 reviews after pricing." Source: Aaghaz / Make First Million (@make.first.million) — "5 Premium Website Prompts (Part 1)". These prompts are not SwitchRoute originals; shared with credit.',
    customizationInstructions: 'Change the brand name, text, colours or sections — ask the AI to rename the brand, swap the accent colours for others, or add a section such as testimonials after pricing.',
    expectedOutputType: 'Five complete, animated one-file websites — a workflow-automation SaaS landing page, a holographic trading-card marketplace, a dark techwear store with a 3D centrepiece, a warm coffee roastery one-pager, and an AI assistant site with a glowing particle orb — each as a single animated index.html file.',
    exampleUseCase: 'Building five complete animated websites, one file each, to launch or prototype a SaaS product, a collectibles marketplace, a fashion store, a coffee brand, or an AI assistant.',
    authorOrSource: 'Aaghaz / Make First Million (@make.first.million) — "5 Premium Website Prompts (Part 1)"',
    sourceCreator: 'Aaghaz / Make First Million (@make.first.million)',
    previewImage: '/prompts/generated/premium-website-prompts-part-1.webp',
    previewImageAlt: 'Abstract premium artwork blending the five prompt palettes — lime, gold, lavender, caramel and mint — on a dark background.',
    mediaType: 'image',
    aspectRatio: '1:1',
    createdAt: '2026-11-13T00:00:00.000Z',
  },
];
