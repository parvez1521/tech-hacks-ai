export function getAnimatedCountValue(value: number, progress: number, reducedMotion = false): number {
  if (reducedMotion) return Math.round(value);
  const bounded = Math.max(0, Math.min(1, progress));
  return Math.round(value * (1 - Math.pow(1 - bounded, 3)));
}


export function formatCount(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

export function formatMilestoneCount(value: number, milestone = 1000): string {
  return value >= milestone ? `${milestone.toLocaleString()}+` : formatCount(value);
}
