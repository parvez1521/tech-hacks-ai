# Offer research log

Research date: 2026-10-21

This log records the first-party sources used to review the offer catalogue in
`src/data/offersData.ts`. Terms and eligibility change; `lastVerifiedAt` records
when these pages were checked. The provider page remains the source of truth at
claim time.

## Published active offers

| Offer | Official source | Review notes |
| --- | --- | --- |
| Reliance Jio + Google AI Pro | [Jio offer](https://www.jio.com/google-gemini-offer/), [terms](https://www.jio.com/jcms/en-in/jio-google-gemini-terms-and-conditions/) | Up to 18 months and 5 TB; eligibility depends on age and eligible Jio plan. |
| Google AI Plus Student Plan — India | [Google student offer](https://gemini.google/in/students/) | Redeem by 2026-12-31; payment method required; ₹399/month auto-renewal after one year unless cancelled. |
| GitHub Student Developer Pack | [Pack](https://education.github.com/pack), [Copilot for students](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students) | GitHub verifies student status; partner benefits have separate terms. |
| Perplexity Education Pro | [Education Pro terms](https://www.perplexity.ai/help-center/en/articles/12590157-what-is-education-pro) | $10/month; student/faculty SheerID verification. |
| Microsoft for Startups | [Program overview](https://learn.microsoft.com/en-us/startups/overview), [getting started](https://learn.microsoft.com/en-us/startups/microsoft-for-startups/getting-started-mfs) | Milestone-based credits; up to $150,000, subject to program eligibility and review. |
| AWS Activate | [Credits](https://aws.amazon.com/activate/credits), [application guide](https://aws.amazon.com/aws-startups/learn/applying-for-aws-activate-credits-a-step-by-step-guide/) | Founders tier starts at $1,000; Portfolio tier can reach $200,000 through an Activate Provider. |
| JetBrains Student Pack | [Education licenses](https://sales.jetbrains.com/hc/en-gb/articles/207241195-Do-you-offer-free-educational-licenses-for-students-and-teachers) | Free educational license for eligible students and teachers; verification rules apply. |
| Notion for Education | [Education plan](https://www.notion.com/help/notion-for-education) | Free single-member plan for eligible higher-education users; school email and annual reverification apply. |
| GitHub Copilot Free | [Plans](https://github.com/features/copilot/plans) | Free plan has monthly completion and AI usage limits; no payment card required. |
| Azure for Students | [Student offer](https://azure.microsoft.com/en-us/free/students/), [offer terms](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0170p/) | $100 credit for eligible students; term and renewal conditions apply. |
| Adobe Creative Cloud Student — India | [India offers](https://www.adobe.com/in/products/special-offers.html), [introductory terms](https://www.adobe.com/in/offer-terms/ccm-ste-introductory.html) | ₹398.99/month introductory annual commitment, then ₹699.01/month; auto-renewal applies. |
| Google for Startups Cloud AI tier | [AI startup program](https://cloud.google.com/startup/ai) | Up to $350,000 over two years for eligible startups, with program-specific stage and usage criteria. |
| Canva Education & Campus | [Eligibility](https://www.canva.com/education/eligibility-guidelines/) | Free Education applies to eligible K–12 communities; higher education is institution-based through Campus. |
| Cursor Hobby | [Pricing](https://cursor.com/pricing) | Free tier has limited Agent and Composer usage. |
| Google AI Studio / Gemini API | [Gemini API pricing and free tier](https://ai.google.dev/gemini-api/docs/pricing) | Country/model availability, rate limits, and data-use terms vary; review before using with sensitive data. |
| Cloudflare Workers Free | [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) | Free tier has request and CPU limits. |
| Vercel Hobby | [Plan terms](https://vercel.com/docs/plans/hobby) | Free plan is limited to personal, non-commercial use. |

## Excluded or held for review

- Figma Education remains `pending-verification` and is omitted from active
  offers because regional availability and eligibility in India were not
  established from the current global guidance.
- DigitalOcean Hatch was not listed: the historic Hatch program is no longer
  the current startup credits route; the replacement program has different
  eligibility and no universally applicable benefit amount.
- Cursor's student-year promotion was not listed as an India offer because
  India is not included in the current promotion's eligible-country list.
- No attempt was made to reach a target number of offers by adding expired,
  duplicate, or unsupported claims. The catalogue contains 17 active sourced
  offers and one explicitly held offer.

## Phase 3 additions — checked 2026-10-22

These are recurring free plans unless marked as a trial. Quotas and region
availability can change; the record avoids amounts where the provider page
exposes dynamic limits rather than a stable promise.

| Offer | Official source | Benefit and eligibility/status |
| --- | --- | --- |
| ChatGPT Free | [OpenAI pricing](https://openai.com/chatgpt/pricing/) | Active free plan with limited feature and usage access; OpenAI account and supported region. |
| Claude Free | [Anthropic pricing](https://www.anthropic.com/pricing), [plan help](https://support.anthropic.com/en/articles/11049762-choosing-a-claude-ai-plan) | Active $0 plan with limited usage; supported-region availability. |
| Perplexity Standard | [Perplexity plan guidance](https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you) | Active free Standard tier with limits on advanced searches and uploads. |
| GroqCloud Free Developer Tier | [Groq rate limits](https://console.groq.com/docs/rate-limits) | Free API experimentation subject to model-specific changing rate limits; no fixed credit amount claimed. |
| Supabase Free | [Supabase pricing](https://supabase.com/pricing), [billing docs](https://supabase.com/docs/guides/platform/billing-on-supabase) | Active free plan with quotas and inactivity pause behavior. |
| Firebase Spark | [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) | Active no-cost quotas for supported products; some services require Blaze billing. |
| MongoDB Atlas Free Cluster | [Atlas pricing](https://www.mongodb.com/pricing), [free cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/) | Active free shared cluster, 512 MB, with resource limits. |
| Google Cloud Free Trial | [Free trial terms](https://docs.cloud.google.com/free/docs/free-cloud-features), [eligibility FAQ](https://cloud.google.com/signup-faqs) | New customers may receive $300 for 90 days; billing profile and trial restrictions apply. |
| Oracle Cloud Free Tier | [Oracle Free Tier](https://www.oracle.com/cloud/free/), [FAQ](https://www.oracle.com/cloud/free/faq/) | Trial credit is time-limited; eligible Always Free services have regional/capacity constraints. |
| Neon Free | [Neon pricing](https://neon.com/pricing), [1 GB plan announcement](https://neon.com/blog/neon-free-plan-1-gb-per-project) | Active free Postgres plan with 1 GB per project stated by provider; other usage limits apply. |
| Turso Free | [Turso pricing](https://turso.tech/pricing) | Active no-cost database plan with published quotas; exact quotas remain on the provider page because they can change. |
| IBM Cloud Lite | [IBM Cloud free overview](https://cloud.ibm.com/docs/overview?topic=overview-tutorial-try-for-free) | Active no-cost Lite service plans; any welcome credit is eligibility-specific and is not promised here. |

The audited catalogue now has 29 active offers (12 Phase 3 additions) and one
pending-verification offer. This is fewer than the requested 30–40 *additional*
entries; no unsupported records were added to reach that target. The active
records include free plans as well as eligibility-gated, paid-discount, and
credit offers; each is individually labeled in the catalogue.
