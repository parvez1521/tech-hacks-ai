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
    tags: ['featured-human-portraits', 'couple-portraits', 'editorial-photography', 'natural-skin', 'landscape-portrait'],
    tips: 'Replace both subject descriptions with fictional adults or people who have consented to image use. Specify age range, complexion, hairstyle, expression, and wardrobe separately for each person.',
    placeholders: ['[WOMAN DESCRIPTION]', '[MAN DESCRIPTION]', '[WARDROBE]', '[BACKGROUND]'],
    customizationInstructions: 'Choose two distinct adult subjects, clothing, background, and lighting. Keep the framing landscape when adding a page headline beside the image.',
    expectedOutputType: 'Landscape 3:2 two-person editorial portrait.',
    exampleUseCase: 'Editorial homepage artwork, creator profiles, or campaign portraits.',
    authorOrSource: 'Original Tech Hacks AI prompt; preview artwork created specifically for Tech Hacks AI.',
    previewImage: '/prompts/generated/portrait-editorial-duo.webp',
    previewImageAlt: 'A fictional adult woman with natural curls and a fictional adult man in an ivory knit pose side by side against a dark teal studio backdrop.',
    visualStyle: 'Premium editorial portrait',
    aspectRatio: '3:2',
    rightsStatus: 'original',
    sourceCreator: 'Tech Hacks AI editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 1,
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
    tags: ['featured-human-portraits', 'womens-portraits', 'street-style-lifestyle', 'window-light', 'photorealism'],
    tips: 'Describe a real lighting direction and one or two individual features rather than stacking generic “perfect face” terms.',
    placeholders: ['[AGE RANGE]', '[SKIN TONE]', '[HAIR]', '[DISTINCTIVE NON-IDENTIFYING DETAILS]', '[CLOTHING]', '[CITY OR BACKGROUND]'],
    customizationInstructions: 'Customize the adult subject’s age range, complexion, hairstyle, clothing, expression, and café setting. Use a consented likeness for any identifiable person.',
    expectedOutputType: 'Natural-light editorial portrait, 4:5.',
    exampleUseCase: 'Lifestyle portrait series and fashion editorial concepts.',
    authorOrSource: 'Original Tech Hacks AI prompt; preview artwork created specifically for Tech Hacks AI.',
    previewImage: '/prompts/generated/portrait-woman-windowlight.webp',
    previewImageAlt: 'A fictional adult woman with long dark curls and freckles sits beside a sunlit café window in a rust-colored shirt.',
    visualStyle: 'Natural-light lifestyle photography',
    aspectRatio: '4:5',
    rightsStatus: 'original',
    sourceCreator: 'Tech Hacks AI editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 2,
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
    authorOrSource: 'Original Tech Hacks AI prompt; preview artwork created specifically for Tech Hacks AI.',
    previewImage: '/prompts/generated/portrait-man-professional.webp',
    previewImageAlt: 'A fictional middle-aged adult man with salt-and-pepper hair wearing a navy blazer in a softly lit architecture studio.',
    visualStyle: 'Professional editorial headshot',
    aspectRatio: '1:1',
    rightsStatus: 'original',
    sourceCreator: 'Tech Hacks AI editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 3,
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
    tags: ['featured-human-portraits', 'couple-portraits', 'womens-portraits', 'mens-portraits', 'lifestyle-photography'],
    tips: 'Write one description per person and vary wardrobe silhouettes. It helps prevent face blending and duplicate clothing.',
    placeholders: ['[PERSON ONE DESCRIPTION]', '[PERSON TWO DESCRIPTION]', '[WARDROBE DETAILS]', '[SETTING]'],
    customizationInstructions: 'Change the adults, wardrobe, setting, time of day, pose, lens, and crop. Use only consenting or fictional subjects.',
    expectedOutputType: 'Editorial couple portrait, 4:5.',
    exampleUseCase: 'Couple portrait concepts and lifestyle campaign photography.',
    authorOrSource: 'Original Tech Hacks AI prompt; preview artwork created specifically for Tech Hacks AI.',
    previewImage: '/prompts/generated/portrait-couple-courtyard.webp',
    previewImageAlt: 'A fictional East Asian adult woman and Black adult man stand together in a softly lit courtyard at dusk.',
    visualStyle: 'Cinematic lifestyle portrait',
    aspectRatio: '4:5',
    rightsStatus: 'original',
    sourceCreator: 'Tech Hacks AI editorial team',
    promptProvenance: 'original',
    featured: true,
    featuredOrder: 4,
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
    tips: 'Use the local poster as a fictional reference image if your selected tool supports image-to-video. This is a Tech Hacks AI suggested recreation, not a prompt from PixVerse or a creator clip.',
    placeholders: ['[WIND STRENGTH]', '[CAMERA MOVE]', '[COLOR PALETTE]'],
    customizationInstructions: 'Tune wind, camera move, wardrobe color, and environment. Upload only an image you own or have permission to use.',
    expectedOutputType: 'Suggested vertical 9:16 portrait-motion clip; actual duration depends on the selected model.',
    exampleUseCase: 'Short-form fashion portrait clips and gentle image-to-video motion studies.',
    officialToolUrl: 'https://pixverse.ai/en',
    authorOrSource: 'Original Tech Hacks AI suggested recreation; no provider prompt or creator clip reused.',
    sourceUrl: 'https://pixverse.ai/en',
    sourceCreator: 'Tech Hacks AI editorial team',
    rightsStatus: 'original',
    rightsLicense: 'Original prompt and locally generated poster artwork.',
    promptProvenance: 'suggested-recreation',
    mediaType: 'video',
    aspectRatio: '9:16',
    previewImage: '/prompts/generated/pixverse-motion-portrait-poster.webp',
    previewImageAlt: 'A fictional adult Black woman in a cobalt jacket on a rooftop at blue hour, composed as a vertical cinematic still.',
    videoDetails: { previewUrl: '/prompts/generated/pixverse-motion-portrait-poster.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://pixverse.ai/en', creatorAttribution: 'Tech Hacks AI editorial team; original prompt and poster.', permissionStatus: 'Original Tech Hacks AI content. No third-party video reused.', aspectRatio: '9:16' },
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
    copyCount: 3840,
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
    copyCount: 2950,
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
    copyCount: 3410,
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
    copyCount: 2180,
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
    copyCount: 2650,
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
    copyCount: 3120,
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
    copyCount: 1980,
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
    copyCount: 2470,
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
    copyCount: 2290,
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
    copyCount: 2890,
    tags: ['fashion', 'ecommerce', 'apparel', 'lookbook', 'studio'],
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
    copyCount: 4210,
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
    copyCount: 3670,
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
    copyCount: 3180,
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
    copyCount: 2840,
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
    copyCount: 2510,
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
    copyCount: 3020,
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
    copyCount: 3380,
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
    copyCount: 2790,
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
    copyCount: 5120,
    tags: ['autonomous-agent', 'cursor-rules', 'claude-code', 'engineering-protocol', 'verification'],
    tips: 'Paste this into Cursor Rules (.cursorrules), CLAUDE.md, or direct agent prompts to eliminate hallucinated code and regressions.',
    placeholders: ['[EXACT FEATURE OR FIX REQUIREMENT]', '[PATH OR MODULE CONSTRAINTS]'],
    customizationInstructions: 'Fill in your specific ticket requirements and project file paths before dispatching to your agent.',
    expectedOutputType: 'Rigorous step-by-step code execution with full test validation and clean build passing.',
    exampleUseCase: 'Complex multi-file refactoring, production bug fixing, and automated feature implementation.',
    officialToolUrl: 'https://cursor.com',
    authorOrSource: 'Tech Hacks AI Engineering Team',
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
    copyCount: 4670,
    tags: ['landing-page', 'saas', 'nextjs', 'tailwind', 'conversion'],
    tips: 'Specify exact value proposition and brand keywords for tailored copywriting in the generated output.',
    placeholders: ['[PRODUCT_NAME]', '[PRIMARY_VALUE_PROPOSITION]', '[KEY_FEATURES]'],
    customizationInstructions: 'Input your product name, core pitch, and key product differentiators.',
    expectedOutputType: 'Production-ready Next.js / Tailwind landing page component with responsive layout.',
    exampleUseCase: 'Launching a new SaaS startup, MVP waitlist page, or developer tool marketing site.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'Tech Hacks AI Engineering Team',
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
    copyCount: 3890,
    tags: ['full-stack', 'prisma', 'postgresql', 'authjs', 'server-actions'],
    tips: 'Ask the model to implement optimistic updates to deliver instantaneous user feedback.',
    placeholders: ['[APPLICATION_NAME]', '[RESOURCE_NAME]'],
    customizationInstructions: 'Define your application name and the primary entity you want users to manage (e.g. Projects, Invoices, Workflows).',
    expectedOutputType: 'Complete full-stack implementation including Prisma schema, authenticated Server Actions, and UI.',
    exampleUseCase: 'Scaffolding scalable authenticated SaaS backends with database integrity.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'Tech Hacks AI Engineering Team',
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
    copyCount: 2980,
    tags: ['forms', 'react-hook-form', 'zod', 'accessibility', 'wcag'],
    tips: 'Use aria-describedby pointing to error IDs to ensure blind and low-vision users receive error notices immediately.',
    placeholders: ['[FIELD_LIST]'],
    customizationInstructions: 'Customize the list of form fields and validation rules to match your onboarding or checkout flow.',
    expectedOutputType: 'Complete accessible form component with Zod validation, error feedback, and unit tests.',
    exampleUseCase: 'User registration flows, enterprise settings forms, and multi-step checkout processes.',
    officialToolUrl: 'https://claude.com',
    authorOrSource: 'Tech Hacks AI Engineering Team',
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
    copyCount: 3340,
    tags: ['backend', 'trpc', 'api-router', 'rate-limiting', 'jwt'],
    tips: 'Idempotency keys on POST requests prevent duplicate customer charges during network retry spikes.',
    placeholders: ['[API_SERVICE_NAME]', '[RESOURCE]'],
    customizationInstructions: 'Define your service name and the resource endpoints to scaffold.',
    expectedOutputType: 'Hardened backend router code with middleware, rate limiting, and RFC 7807 error responses.',
    exampleUseCase: 'Building reliable public API services, microservice endpoints, and payment integrations.',
    officialToolUrl: 'https://cursor.com',
    authorOrSource: 'Tech Hacks AI Engineering Team',
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
    sourceCreator: 'Tech Hacks AI editorial team',
    videoDetails: { previewUrl: '/prompts/generated/higgsfield-vertical-fashion-reel-motion.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://higgsfield.ai/', creatorAttribution: 'Original Tech Hacks AI prompt and preview; no third-party video reused.', permissionStatus: 'Original local poster; official provider link only.', aspectRatio: '9:16', guideSlugs: ['cinematic-ai-video-workflow'] },
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Vertical 9:16 cinematic video prompt for Higgsfield AI: High-fashion model walking in graceful slow motion across an illuminated rooftop runway at dusk. Oversized flowing iridescent silk cape billows in natural wind gusts with hyper-realistic fabric physics and ripple dynamics. Soft continuous low-angle tracking camera advancing smoothly backwards. Warm sunset backlight casting luminous rim light along silk edges. 60fps cinematic fluidity, zero morphing artifacts, photorealistic editorial lookbook quality.',
    copyCount: 3720,
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
    copyCount: 3190,
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
    copyCount: 2640,
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
    copyCount: 2880,
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
    copyCount: 3050,
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
    sourceCreator: 'Tech Hacks AI editorial team',
    videoDetails: { previewUrl: '/prompts/generated/higgsfield-character-emotional-microgesture.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://higgsfield.ai/', creatorAttribution: 'Original Tech Hacks AI prompt and preview; no third-party video reused.', permissionStatus: 'Original local poster; official provider link only.', aspectRatio: '9:16' },
    targetModel: 'Higgsfield AI',
    provider: 'Higgsfield',
    promptText: 'Create a short cinematic character-performance clip: an expressive adult protagonist looks through a rain-streaked window, shifting naturally from quiet reflection into a faint confident smile. Preserve the same facial identity and proportions throughout. Include subtle eye movements, gentle breathing, warm room-lamp reflections in the eyes, and softly focused raindrops outside. Use a stable intimate 50mm close-up with restrained motion and realistic skin. Avoid face morphing, exaggerated expression, abrupt camera movement, text, or logos.',
    copyCount: 2940,
    tags: ['higgsfield', 'character-animation', 'micro-gestures', 'facial-performance', 'cinematic'],
    tips: 'This is an original suggested recreation prompt. Keep the camera steady and describe the start and end expressions to reduce face drift.',
    placeholders: ['[EMOTIONAL_TRANSITION]', '[SETTING]'],
    customizationInstructions: 'Describe the starting and ending emotional states and environment.',
    expectedOutputType: 'Realistic cinematic character close-up demonstrating nuanced performance and natural expressions.',
    exampleUseCase: 'Dramatic film storyboarding, video game cutscenes, and emotional narrative ads.',
    officialToolUrl: 'https://higgsfield.ai',
    authorOrSource: 'Original Tech Hacks AI suggested recreation; no provider prompt or creator clip reused.',
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
    copyCount: 2710,
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
    copyCount: 2580,
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
    copyCount: 2420,
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
    copyCount: 3310,
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
    copyCount: 2970,
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
    copyCount: 2830,
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
    copyCount: 1420,
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
    copyCount: 2310,
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
    sourceCreator: 'Tech Hacks AI editorial team',
    videoDetails: { previewUrl: '/prompts/generated/slow-dolly-cyberpunk-rain.webp', hostingMethod: 'link-only', sourcePageUrl: 'https://kling.ai/', creatorAttribution: 'Original Tech Hacks AI prompt and preview; no third-party video reused.', permissionStatus: 'Original local poster; official provider link only.', aspectRatio: '16:9', guideSlugs: ['cinematic-ai-video-workflow'] },
    targetModel: 'Runway Gen-3 / Kling AI',
    provider: 'Runway',
    promptText: 'Continuous smooth forward dolly camera motion drifting down an illuminated wet asphalt avenue in Tokyo at dusk. Reflections of vertical holographic neon signs shimmer on puddles. Natural pedestrian silhouettes walking with translucent umbrellas. 24fps film motion blur, photorealistic depth of field, cinematic lighting.',
    copyCount: 980,
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
    copyCount: 3150,
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
    copyCount: 1840,
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
    copyCount: 1590,
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
    copyCount: 2210,
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
    copyCount: 1890,
    tags: ['react', 'typescript', 'custom-hook', 'cache', 'testing'],
    tips: 'Ideal for building lightweight web apps without heavy dependencies like React Query.',
    placeholders: ['[HOOK_NAME]', '[FEATURE_REQUIREMENTS]'],
    customizationInstructions: 'Specify hook name and desired features such as debounce or persistence.',
    expectedOutputType: 'Type-safe React custom hook with AbortController and unit test suite.',
    exampleUseCase: 'Creating reusable data-fetching primitives in frontend client apps.',
    officialToolUrl: 'https://cursor.com',
    authorOrSource: 'Platform Engineering Team',
  },
];
