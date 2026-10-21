# Open-source UI library review

Review date: 2026-10-21

The existing app already uses React, Tailwind CSS, and Lucide icons. For the
requested lightweight animated treatment, native CSS transitions and SVG
assets provide the needed effects without adding a new runtime dependency.

| Project | License / fit | Decision |
| --- | --- | --- |
| [Magic UI](https://github.com/magicuidesign/magicui) | MIT-licensed components; examples can assume a Next.js-oriented setup. | No integration. Existing CSS and React patterns cover the needed motion. |
| [Motion](https://github.com/motiondivision/motion) | MIT; adds an animation dependency to the current app. | No integration. Avoid a second animation system for small effects. |
| [React Bits](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md) | Source license includes Commons Clause restrictions on selling, sublicensing, or redistributing the software itself. | No integration. License is a poor fit for a broadly reusable component library. |
| [shadcn/ui](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) | MIT; copy-and-own components rather than a runtime package. | No integration. The project already has its own Tailwind component system; copying another set would add overlap. |

Current direction: keep interactions accessible and reduced-motion aware using
the app's existing CSS, use the existing Lucide package for interface icons,
and prefer lightweight inline SVG or CSS for decorative visuals. Revisit only
if a concrete UI need cannot be met cleanly with the current stack.
