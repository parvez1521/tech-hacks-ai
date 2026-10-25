export interface CropFieldDraft {
  x: string;
  y: string;
  width: string;
  height: string;
}

export interface CropRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CropValidationResult =
  | { valid: true; crop: CropRectangle }
  | { valid: false; error: string };

function parseWholeNumber(value: string, label: string, minimum: number): number | string {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return `${label} must be a whole number.`;
  }

  const parsed = Number(trimmed);
  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    return `${label} must be ${minimum === 0 ? 'zero or greater' : 'at least 1'}.`;
  }
  return parsed;
}

/**
 * Validate user-entered image crop coordinates without silently clamping their values.
 * Input dimensions are natural pixel dimensions of the original image.
 */
export function validateCropDraft(
  draft: CropFieldDraft,
  imageWidth: number,
  imageHeight: number,
): CropValidationResult {
  if (!Number.isSafeInteger(imageWidth) || imageWidth < 1 ||
      !Number.isSafeInteger(imageHeight) || imageHeight < 1) {
    return { valid: false, error: 'The source image has invalid dimensions. Choose another image.' };
  }

  const x = parseWholeNumber(draft.x, 'X', 0);
  if (typeof x === 'string') return { valid: false, error: x };
  const y = parseWholeNumber(draft.y, 'Y', 0);
  if (typeof y === 'string') return { valid: false, error: y };
  const width = parseWholeNumber(draft.width, 'Width', 1);
  if (typeof width === 'string') return { valid: false, error: width };
  const height = parseWholeNumber(draft.height, 'Height', 1);
  if (typeof height === 'string') return { valid: false, error: height };

  if (x >= imageWidth || y >= imageHeight) {
    return {
      valid: false,
      error: `X must be 0–${imageWidth - 1} and Y must be 0–${imageHeight - 1} for this image.`,
    };
  }
  if (x + width > imageWidth) {
    return { valid: false, error: `Width is too large at X=${x}. Maximum width is ${imageWidth - x}px.` };
  }
  if (y + height > imageHeight) {
    return { valid: false, error: `Height is too large at Y=${y}. Maximum height is ${imageHeight - y}px.` };
  }

  return { valid: true, crop: { x, y, width, height } };
}
