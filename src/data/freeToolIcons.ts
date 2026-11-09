import type { LucideIcon } from 'lucide-react';
import {
  Braces,
  CaseSensitive,
  FileImage,
  QrCode,
  Scaling,
  Shapes,
  Sparkles,
} from 'lucide-react';

/**
 * One distinct Lucide icon per free utility, keyed by the tool's stable id.
 *
 * This map is deliberately separate from the `iconName` strings in
 * freeToolsData.ts: those values are not unique (Image, Braces, FileAudio
 * and Youtube each repeat) and three of them (CodeXml, FileInfo, Icons) do
 * not exist in the installed lucide-react version, so they can never render.
 * Every icon below is unique per tool and verified against the installed
 * lucide-react exports. tests/free_tools_icons.test.js pins both properties.
 */
export const freeToolIcons: Record<string, LucideIcon> = {
  'image-resizer': Scaling,
  'heic-to-png': FileImage,
  'qr-generator': QrCode,
  'word-counter': CaseSensitive,
  'json-formatter': Braces,
  'svg-to-png': Shapes,
  'prompt-builder': Sparkles,
};
