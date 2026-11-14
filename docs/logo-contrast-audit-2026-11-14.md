# Logo contrast audit — 2026-11-14

Branch: `fix/logo-contrast-2026-11-14` (base `main` @ `9ea9a53`, PR #91).
Fix commit: `a7b1ead` — "Fix logo contrast: measured per-logo tile tones for 770 logos".

## The problem

User report (Hinglish, 2026-11-14): logos have contrast issues everywhere — check
each individual logo against its background, they merge/blend into it in places.

The audit confirmed it: **873 of 1,906 logos (45.8%) fail** on at least one
background they actually sit on. The failure is concentrated in dark theme
(the site default): 710 fail on the dark card, only 263 on the light card.
The dominant cause is that Simple Icons ship black — 481 of the 710 dark-card
failures are black `simple-icons` marks with no tile or treatment.

## Method

1. **Enumerated every render path.** All brand logos render through
   `src/components/BrandLogo.tsx` — container mode (logo `<img>` on a
   `bg-card` tile + border) and `showContainer={false}` bare mode (9 usages:
   `AiAlternativesShowcase`, `PromptCard`, `SwitchFlow` ×2, `SwitchFlowMini`
   ×2, HomePage pills ×2, `PromptDetailPage`). No other component renders a
   brand logo `<img>` (the only exceptions are admin-only tiles and the
   site's own favicon mark). The initials fallback is a fixed `#334155`
   background + white text (10.35:1 — passes).
2. **Measured rendered pixels, not nominal fill colours.** Each asset was
   rasterized (cairosvg/Pillow) at 64×64, live-fetched Google favicons
   included, and scored with WCAG contrast + visible-pixel fraction against
   the 9 backgrounds logos actually sit on: dark card `#22110C`, dark page
   `#160A07`, dark pill `#1C0E09`, light card `#FFFFFF`, light page `#FFF7EE`,
   light pill `#FFF5EA`, blue chip `#EFF6FF` (and dark/light page-task
   variants). Page/card colours were re-derived from `src/index.css`
   (source of truth — the `DESIGN.md` palette table was stale and was
   corrected in this PR).
3. **Derived the tile tone per logo by readable share.** For each transparent
   failing logo, the real asset was rasterized at 128px; mark pixels
   (alpha > 128) were scored for the share reaching WCAG 3:1 against a white
   tile and against a dark tile (`#111C2F`); the higher share wins
   (tie → light). 767 transparent tones, 0 unrenderable, 0 unfixable.
4. **Re-verified the audit's tile-mode classification by eye.** The audit's
   bbox-border heuristic over-flagged saturated/gradient marks as tile-mode.
   A 79-logo contact sheet (dark + light card) was inspected visually: 78 of
   79 are clearly legible on both cards. 40 of the 79 had opaque coverage
   < 0.9 (transparent assets misclassified as tile-mode); of those, only 3
   genuinely need a tile: `dify`, `docusign`, `kie-ai` → light. A 25-logo
   tone-assignment sheet was also visually verified — all assignments look
   right.

## Results

| | Count |
|---|---:|
| Registry entries | 1,906 |
| Measured | 1,871 |
| **Failing (≥ 1 real background)** | **873** |
| Passing | 998 |
| Unmeasurable (Google favicon 404) | 35 |
| Initials tiles (all pass) | 6 |

| Background | Failing |
|---|---:|
| Dark card `#22110C` | 710 |
| Dark page `#160A07` | 705 |
| Dark pill `#1C0E09` | 705 |
| Light card `#FFFFFF` | 263 |
| Light page `#FFF7EE` | 265 |
| Light pill `#FFF5EA` | 271 |
| Blue chip `#EFF6FF` | 271 |

Failure patterns: dark-only 602 · light-only 163 · both themes 108.
Effectively invisible on ≥ 1 background (visible-pixel fraction < 0.02): 17,
including `suno` (white mark on its own white CSS tile — invisible everywhere)
and `mendix` (1.4%-of-tile glyph).

Render classes: local asset 577 (557 SVG, 13 PNG, 6 WebP, 1 JPG — all files
exist) · remote Google favicon 1,323 (1,192 fetched OK, 35 HTTP 404) ·
initials tile 6.

## The fix (commit `a7b1ead`)

A measured per-logo tile tone — presentation only, the mark is never
recoloured, redrawn, inverted or substituted:

- **New `src/data/logoTileTones.ts`** — `LOGO_TILE_TONES` for **770 logos:
  603 light (white `#ffffff` tile) + 167 dark (dark `#111c2f` tile)**,
  plus `getLogoTileTone(slug)` (normalizes case/whitespace).
- **`src/components/BrandLogo.tsx`** — looks the tone up and appends
  `brand-logo-image--tile-light` / `--tile-dark` to the `<img>` class in
  **both** branches (container and bare), so the 9 bare spots
  (AiAlternativesShowcase, PromptCard, SwitchFlow, SwitchFlowMini, HomePage
  pills, PromptDetailPage) are covered too. No size, gating, or
  status-string changes.
- **`src/index.css`** — the two tile classes use raw `background:` (dodging
  the `.dark [class~="bg-white"]` override that would turn a plain `bg-white`
  tile dark). **Removed the old `.brand-logo-image--suno` white-tile rule** —
  suno is a white mark; the old rule made it invisible everywhere. It is now
  governed by the tone map (`dark`).
- **`DESIGN.md`** — corrected the stale brand-palette table to the real
  `src/index.css` token values.
- **New `tests/logo_tile_tones.test.js`** (8 tests): map size 770
  (603 light / 167 dark); every slug exists in the runtime registry; lookup
  normalization + unknown → `undefined`; spot checks; no mapped slug keeps a
  per-slug CSS rule + suno rule gone; tile classes use raw backgrounds;
  `BrandLogo` applies `tileClass` in both img branches; bare spots untouched.

No logo artwork file was changed. No brand mark was redrawn or recoloured.
The tile is a solid background behind the untouched mark (owner ban list
respected: no glass cards, no gradients, no glow).

## What this does NOT fix (103 of the 873, verified)

- **102 tile-mode logos the audit flagged but are visually fine.** The 3:1
  pixel rule over-flags saturated/gradient marks (e.g. Hacker News white Y
  on orange = 2.94:1 but perfectly readable). Verified on the contact sheet;
  no tile added — adding one would hide the mark's own opaque tile.
- **`codev` — genuinely weak on light card, not fixable by CSS.** White
  swirl invisible on white; its asset is fully opaque, so no CSS tile can
  sit behind it. Needs a replacement asset — out of scope for this PR.
- **35 unmeasurable logos** (Google favicon 404) are not in the 873; they
  render the initials fallback and are listed in the audit work files.

Pre-existing note (unchanged by this PR): `hailuo-ai` sits on a pre-existing
per-slug dark tile (`src/index.css:912-919`, one of the 5 dark per-slug
rules). Its mark is a subtle light glyph on dark navy — measured passing,
identical before/after.

## Validation

- **Tests: 666 pass / 0 fail** (658 existing + 8 new), 131 suites.
- **Production build: green, exit 0, 1,227 route pages.**
- **Rendered screenshots (real headless-Chrome captures, before vs after):**
  local production builds of `main` and of this branch, served on
  `127.0.0.1:4174` (before) / `4173` (after); desktop 1440×900 dark + light
  and mobile 390×844 dark; pages `/`, `/alternatives/supabase`,
  `/free-ai-sites`. Page heights identical before/after
  (home 9,704px, supabase 3,040px, free-ai-sites 10,392px) — no layout shift.
  - `/alternatives/supabase` dark: PocketBase, Appwrite, Milvus, Qdrant,
    Turso, Convex (dark marks, invisible before) now sit on white tiles and
    are clearly legible; Chroma / Weaviate / initials tiles unchanged.
  - `/alternatives/supabase` light: no regressions (dark marks were already
    fine; white tiles are near-invisible on white cards but the marks read).
  - `/free-ai-sites` light: Ollama (white llama, invisible before) now on a
    dark tile, clearly legible. Runway / Hailuo unchanged (pre-existing
    tile-mode assets / per-slug rules).
  - Homepage dark desktop + mobile: bare-spot pills fixed (ComfyUI, Qwen
    Code, Goose GitHub marks now on white tiles); layout identical.
  - Capture notes: the first after-run was discarded — it served a stale
    build (old server still bound to port 4173 + browser disk cache serving
    the previous build's hashed assets; caught via a probe showing 404s on
    the CSS/JS and a 1424px unstyled logo). Re-ran with a fresh browser
    profile, `Network.setCacheDisabled`, and explicit theme + cookie-consent
    localStorage per capture; ScrollMorph reveals given 2.3s to settle so
    tiles show cards at full opacity.

Full per-logo measurements: `audit/FAILING-LOGOS.md`, `audit/failing-logos.json`,
`audit/measurements.json` in the task work area
(`~/workspace/switchroute-logo-contrast-2026-11-14/audit/`).

## Toned slugs — light tile (603)

<!-- Generated from audit/final-tones.json — dark (transparent) marks get a white tile. -->

```
1panel
1password
2fas
activeloop
actual
adguard
aegis-authenticator
affine
airbyte
akaunting
alacritty
alfred
algolia
amazonaws
amd
amp
android
angular
anki
ansvisor
anydesk
apache-answer
apache-druid
apache-superset
apollo-graphql
appian
apple
apple-music
appsmith
appwrite
arc
argos
asana
aseprite
aspentech-infoplus-21
astro
audacity
auth0
authentik
automatisch
backblaze
basecamp
baserow
bb
beekeeper-studio
bento
better-auth
betterstack
bigcommerce
bitbucket
bitly
bitwarden
blackboard
blender
bluesky
box
brainscape
braintrust
brandfolder
brave
brevo
bruno
budibase
bun
calendesk
campaign-monitor
camtasia
carrd
ccleaner
chatbot
chatfuel
chatwoot
checkmk
chromatic
cinny
circle
circleci
classroomio
clerk
clickhouse
clickup
cline
clockify
cloudcannon
cloudflare-workers
cloudinary
cloudron
coda
coder
coderabbit
cogvideox
collabora-online
comma
confluence
contentful
convex
coolify
cora
coursera
cpanel
craft
cratedb
creem
crewai
crowdin
cryptomator
cryptpad
darktable
dash0
dashlane
datadog
dataforseo
datagrip
davinci-resolve
davinciresolve
dbeaver
deepnote
deezer
demi-ai
deno
dialzara
dify
digg
digitalocean
discord
discourse
docker
documenso
docusign
dodo-payments
dropbox
drovio
drupal
duckduckgo
dynatrace
eden-ai
ego-lite
elasticsearch
element
elementor
emby
enpass
ente
erpnext
ethora
ever-gauzy
ever-teams
evernote
excalidraw
facebook
fathom
fauna
featurevisor
fillout
firefly-iii
firefox
flickr
flipt
flowise-ai
fluxer
forgejo
formbricks
framer
fumadocs
ge-proficy-historian
ghost
ghostfolio
ghostty
gimp
gitbook
gitea
github
github-actions
gitkraken
gitlab
glide
gmail
goodreads
google-analytics
google-assistant
google-authenticator
google-chrome
google-cloud
google-cloud-composer
google-cloud-storage
google-docs
google-drive
google-keep
google-maps
google-meet
google-sheets
google-tasks
google-translate
googlechrome
googledrive
googleforms
gpt4all
grafana
grammarly
graphite
greenhouse
greptimedb
guilded
gumroad
hashicorp-boundary
hasura
hebbia
helium
helixdb
helpdesk
helpscout
hermes-agent
hey
highlight
hive
home-assistant
hootsuite
horilla
hotjar
httpie
hubspot
huly
humanloop
icinga
ifttt
imgix
imgur
influxdb
inkscape
insomnia
instagram
instapaper
instatus
intel
intercom
invidious
invoice-ninja
iterm-2
javascript
jellyfin
jenkins
jira
jitsi
joplin
jupyter
kaggle
kagi
kanri
karakeep
kdenlive
keepassxc
keeper
keploy
keras
keycloak
kie-ai
kilocode
kite
kodi
kong
krita
kubernetes
langchain
langgraph
languagetool
langwatch
lastpass
launchdarkly
learnworlds
lemmy
lemon-squeezy
librechat
libreoffice
libretranslate
librewolf
limesurvey
linear
linkedin
linktree
listmonk
literal
livechat
livekit
llama-cpp
lm-studio
lmstudio
localsend
localstack
logicmonitor
logseq
logstash
looker
loom
loops
luma
luma-dream-machine
lyzr
mailchimp
mailgun
mastodon
matillion
matomo
mautic
medium
medusa
meetily
mega
mendeley
mermaid
meta
mezon
microsoftazure
microsoftedge
microstrategy
milvus
minio
mintlify
miro
mixpanel
mixpost
modal
mole
monetr
mongodb
monica
monogame
morphic
msty-claw
msty-nexus
msty-studio
mural
neo4j
neovim
netdata
netflix
netlify
new-relic
nextcloud
nextdns
nextdotjs
nhost
nodedotjs
nordvpn
notesnook
notificationapi
notifuse
novu
ntfy
nuclear
nutanix
nvidia
obs-studio
obsidian
obsstudio
oceanbase
odoo
ohdear
okta
oneglanse
onyx
opencode
opennotas
openproject
openrouter
opensearch
openstack
opentofu
openvpn
opera
opsgenie
orama
organic-maps
ory
osmand
outline
owncloud
paddle
pagecloud
pagerduty
pangolin
paperless-ngx
parlant
passbolt
paypal
paypal-braintree
peekaping
peertube
percy
pi
pinboard
pingdom
piwigo
pixelfed
plane
planetscale
plesk
plex
pocketbase
poe
post-bridge
postal
posthog
postiz
prefect
pretix
pro-tools
processwire
prometheus
proton-drive
proton-mail
proton-vpn
pullfrog
pulumi
puppet
pylon
python
pytorch
qdrant
qlik
qodo
qualcomm
qualtrics
quickbooks
quizlet
qwen
railway
rasa
raycast
react
red-hat-openshift
redash
reddit
redis
redmine
refine
reflex
refworks
render
replicate
replit
rescuetime
resend
retell
retool
roam-research
rocket-chat
rocket-money
rollbar
roundcube
rowy
rust
ryot
safari
samsung
sanity
sap
scalar
scikitlearn
scrunch
seafile
searxng
sellfy
semaphore
semrush
sendible
sentry
sequin
serif
session
shaper
sharex
shopify
shopware
signal
simkl
simple-analytics
siyuan
sketch
slack
snowflake
soundcloud
spike-api
splunk
spotify
spree-commerce
squarespace
startpage
statuspage
storyblok
strapi
streamlit
stremio
stripe
sublime-text
substack
sumo-logic
superhuman-docs
superhuman-mail
sure-am
survicate
svelte
tabnine
tailscale
tailwindcss
tdengine
teamviewer
telegram
telegraph
temporal
tensorflow
terraform
things
thinkific
threads
threema
tianji
ticket-tailor
ticktick
tidal
tidb
tiktok
timescale
tirreno
todoist
toggl
torbrowser
tower
trae
trello
trench
tresorit
tricentis
turso
tuta
tv-time
twenty
twisp
typescript
udemy
umbrel
unity
unraid
unreal-engine
upsource
uptime-kuma
userlist
usersnap
usertour
uservoice
v0
valentina-studio
vault
vaultwarden
vbulletin
veeam
verifywise
vertabelo
victoriametrics
vikunja
visualstudiocode
vite
vivaldi
vmware
voiden
vuedotjs
vvveb-cms
wakatime
wallabag
warp
warpdrive
waveterm
webex
webflow
weblate
weebly
weights-and-biases
weightsandbiases
wetransfer
wezterm
whatsapp
windsurf
wire
wireguard
wix
woocommerce
woodpecker-ci
wordpress
x
xero
yaak
youtube
youtube-music
yunohost
zed
zedindustries
zen-browser
zendesk
zerotier
zoho
zola
zoom
zotero
zulip
```

## Toned slugs — dark tile (167)

<!-- Generated from audit/final-tones.json — light (white) marks get a dark tile. -->

```
aider
angellist
anthias
apitable
appdynamics
aqua-voice
atomic-crm
azure-ad
azure-blob-storage
azure-data-explorer
azure-data-factory
azure-durable-functions
azure-logic-apps
bamboohr
base44
bench
bio-fm
blinko
blitzrecorder
brave-search
bugsink
capjs
chartbrew
chromium
cleanshot
close
cloudberry
cloudquery
codezero
comfyui
copilot
copilot-autopilot
courier
cozy
daisydisk
desktime
deta-surf
directadmin
docsbot
drools
duplicacy
dyrector
em-client
excel
fider
flow
gatus
google-location-sharing
grepture
grist
hackatime
handy
harness
hcaptcha
hoppscotch
huggingface
iubenda
jan
jotform
keila
kener
keyshade
kodus
kokoro-tts
korbit
koru
kutt
ladybird
langfuse
llm-gateway
losslesscut
lovable
lucidchart
mackeeper
macro-chat
macro-crm
macro-docs
macro-mail
macro-tasks
manage
manticore
markup
mcaptcha
memgraph
mendix
microsoft
microsoft-365
microsoft-365-copilot
microsoft-authenticator
microsoft-azure
microsoft-copilot-studio
microsoft-dev-box
microsoft-dynamics-365
microsoft-office
microsoft-onedrive
microsoft-outlook
microsoft-sharepoint
microsoft-teams
microsoft-visio
microsoft-word
midori-browser
mode
moosend
nanobot
navicat
nemoclaw
nightingale
office-online
ollama
onenote
onlyoffice-docs
open-interpreter
openlane
openlit
openllmetry
openshot
opnform
optisigns
orbital
ottomatik
ox-alpha
padloc
paralino
penpot
perplexity
portkey-ai-gateway
postgraphile
postman
power-apps
power-bi
psono
quackback
qwen-code
sensei
sharepoint
shortio
site24x7
solarwinds
stabilityai
stable-diffusion-3
statusnook
storj
suno
supabase
tableau
tableplus
taiga
tawk-to
tella
terminal
testerarmy
testsigma
tigergraph
trypost
umami
unibee
uptimerobot
vector
vistasocial
voibe
wan-video
yaffa
zammad
zeroclaw
ziit
zitadel
zo-computer
```
